import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageEditor } from "@/components/page-editor";
import { hasAdminPassword, isAdmin } from "@/lib/auth";
import { loadCopy } from "@/lib/copy";
import { fieldsFor, pageBySlug } from "@/lib/site-copy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Edit page",
  robots: { index: false, follow: false },
};

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pageBySlug(slug);
  if (!page) notFound();
  if (!(await hasAdminPassword())) redirect("/admin");
  if (!(await isAdmin())) redirect("/admin");

  const copy = await loadCopy();

  return (
    <main id="content" className="mx-auto max-w-3xl px-4 py-10">
      <PageEditor page={page} fields={fieldsFor(slug)} initial={copy} />
    </main>
  );
}
