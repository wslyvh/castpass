import { SendEmail } from "@/components/send";
import { VerifyEmail } from "@/components/verify";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <SendEmail />
      <VerifyEmail />
    </div>
  );
}
