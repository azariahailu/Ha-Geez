import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResetForm } from "@/components/reset-form";
import { hasAdminPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

function resetError(code: string | undefined): string | null {
  if (code === "short") return "Use at least 8 characters.";
  if (code === "long") return "That password is too long.";
  if (code === "match") return "The two passwords do not match.";
  if (code === "bad") return "That recovery code is not right.";
  if (code === "locked") return "Too many attempts. Wait a few minutes and try again.";
  return null;
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await hasAdminPassword())) redirect("/admin");
  const params = await searchParams;
  return (
    <main id="content" className="mx-auto max-w-5xl px-4 py-12">
      <ResetForm error={resetError(params.error)} />
    </main>
  );
}
