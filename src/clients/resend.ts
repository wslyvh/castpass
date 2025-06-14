import { EmailTemplate } from "@/components/templates/email";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

if (!resendApiKey || !resendFromEmail) {
  console.warn(
    "RESEND_API_KEY or RESEND_FROM_EMAIL environment variable is not defined. Email sending will not work."
  );
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmailVerification({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  if (!resend || !resendFromEmail) {
    return { success: false, error: "Resend client not configured." };
  }

  try {
    await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject: "Castpass verification",
      react: EmailTemplate({ name, email }),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Unknown error" };
  }
}
