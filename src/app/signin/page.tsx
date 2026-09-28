import { Suspense } from "react";
import { SignInForm } from "./SignInForm";
import { AuthShell } from "./AuthShell";

export const metadata = { title: "Log in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = mode === "register" ? "register" : "login";

  return (
    <AuthShell
      realm="developer"
      initialMode={initialMode}
      corner={[]}
    >
      <Suspense fallback={null}>
        <SignInForm initialMode={initialMode} />
      </Suspense>
    </AuthShell>
  );
}
