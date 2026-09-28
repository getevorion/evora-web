import { Suspense } from "react";
import { SignInForm } from "../signin/SignInForm";
import { AuthShell } from "../signin/AuthShell";

export const metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <AuthShell
      realm="developer"
      initialMode="register"
      corner={[]}
    >
      <Suspense fallback={null}>
        <SignInForm initialMode="register" />
      </Suspense>
    </AuthShell>
  );
}
