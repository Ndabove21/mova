"use server";

import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  type: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
  /** Honeypot: los bots lo completan, las personas no lo ven. */
  website: z.string().max(0).optional().or(z.literal("")),
  locale: z.enum(["es", "en"]),
});

export type ContactState = {
  status: "idle" | "ok" | "error";
  fieldErrors?: Partial<Record<"name" | "email" | "message", true>>;
};

export async function sendContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    company: formData.get("company") ?? "",
    type: formData.get("type") ?? "",
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "",
    locale: formData.get("locale") ?? "es",
  });

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "message") fieldErrors[key] = true;
      // El honeypot no se avisa: se responde "ok" y no se manda nada.
      if (key === "website") return { status: "ok" };
    }
    return { status: "error", fieldErrors };
  }

  const data = parsed.data;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !to || !from) {
    console.warn(
      "[MOVA] Falta configurar RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL. Consulta recibida:",
      data
    );
    // En desarrollo dejamos pasar para poder probar el flujo completo.
    return { status: process.env.NODE_ENV === "production" ? "error" : "ok" };
  }

  const subject = `MOVA · ${data.type || "Consulta"} — ${data.name}`;
  const lines = [
    `Nombre: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Empresa / proyecto: ${data.company}` : null,
    data.type ? `Tipo: ${data.type}` : null,
    `Idioma del sitio: ${data.locale}`,
    "",
    data.message,
  ].filter(Boolean) as string[];

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text: lines.join("\n"),
    });
    if (error) {
      console.error("[MOVA] Resend devolvió un error:", error);
      return { status: "error" };
    }
    return { status: "ok" };
  } catch (err) {
    console.error("[MOVA] No se pudo enviar el mail:", err);
    return { status: "error" };
  }
}
