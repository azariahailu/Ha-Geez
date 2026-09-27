import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";
import { LoginForm } from "@/components/login-form";
import { RecoveryNotice } from "@/components/recovery-notice";
import { SetupForm } from "@/components/setup-form";
import { hasAdminPassword, isAdmin, readRecoveryFlash } from "@/lib/auth";
import { listAdmin, statusCounts } from "@/lib/entries";
import { listMessages, messageCount } from "@/lib/messages";
import { COPY_PAGES } from "@/lib/site-copy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

function setupError(code: string | undefined): string | null {
  if (code === "short") return "Use at least 8 characters.";
  if (code === "long") return "That password is too long.";
  if (code === "match") return "The two passwords do not match.";
  if (code === "save") return "The password could not be saved. Try again.";
  return null;
}

function loginError(code: string | undefined): string | null {
  if (code === "bad") return "That password is not right.";
  if (code === "locked") return "Too many attempts. Wait a few minutes and try again.";
  if (code === "taken") return "A password is already set. Enter it.";
  return null;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string }>;
}) {
  const params = await searchParams;
  const configured = await hasAdminPassword();

  if (!configured) {
    return (
      <main id="content" className="mx-auto max-w-5xl px-4 py-12">
        <SetupForm error={setupError(params.error)} />
      </main>
    );
  }

  const signedIn = await isAdmin();
  if (!signedIn) {
    return (
      <main id="content" className="mx-auto max-w-5xl px-4 py-12">
        <LoginForm error={loginError(params.error)} />
      </main>
    );
  }

  const recoveryCode = await readRecoveryFlash();
  const query = typeof params.q === "string" ? params.q : "";
  const [counts, pending, published, rejected, messages, messageTotal] = await Promise.all([
    statusCounts(),
    listAdmin("pending"),
    listAdmin("published", query, 150),
    listAdmin("rejected"),
    listMessages(),
    messageCount(),
  ]);

  return (
    <main id="content" className="mx-auto max-w-5xl px-4 py-10">
      {recoveryCode ? <RecoveryNotice code={recoveryCode} /> : null}
      <AdminDashboard
        pending={pending}
        published={published}
        rejected={rejected}
        counts={counts}
        query={query}
        messages={messages}
        messageTotal={messageTotal}
        pages={COPY_PAGES}
      />
    </main>
  );
}
