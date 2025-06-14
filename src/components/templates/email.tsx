interface EmailTemplateProps {
  name: string;
  email: string;
}

export function EmailTemplate({ name, email }: EmailTemplateProps) {
  const domain = email.split("@")[1];

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to Castpass 👋</h1>
      <p className="mt-4">
        Verifying your email address to manage channel subscriptions.
      </p>
      <p className="mt-4">
        Your details:
        <ul>
          <li>Username: {name}</li>
          <li>Email: {email}</li>
          <li>Domain: {domain}</li>
        </ul>
      </p>
    </div>
  );
}
