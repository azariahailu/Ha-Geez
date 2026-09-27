import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";
import { LoginForm } from "@/components/login-form";
import { DEV_ADMIN_PASSWORD, isAdmin, usingDevPassword } from "@/lib/auth";
import { listAdmin, statusCounts } from "@/lib/entries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; q?: string }>;
}) {
  const params = await searchParams;
  const signedIn = await isAdmin();

  if (!signedIn) {
    const error =
      params.error === "bad"
        ? "That password is not right."
        : params.error === "config"
          ? "A password has not been set."
          : null;
    return (
      <main id="content" className="mx-auto max-w-5xl px-4 py-12">
        <LoginForm error={error} devPassword={usingDevPassword() ? DEV_ADMIN_PASSWORD : null} />
      </main>
    );
  }

  const query = typeof params.q === "string" ? params.q : "";
  const [counts, pending, published, rejected] = await Promise.all([
    statusCounts(),
    listAdmin("pending"),
    listAdmin("published", query, 150),
    listAdmin("rejected"),
  ]);

  return (
    <main id="content" className="mx-auto max-w-5xl px-4 py-10">
      <AdminDashboard
        pending={pending}
        published={published}
        rejected={rejected}
        counts={counts}
        query={query}
      />
    </main>
  );
}
