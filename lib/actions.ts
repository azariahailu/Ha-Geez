"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearRecoveryFlash,
  clearSession,
  createAdminPassword,
  createSession,
  hasAdminPassword,
  isAdmin,
  loginWithPassword,
  resetWithRecovery,
  stageRecoveryFlash,
} from "@/lib/auth";
import {
  findPublishedWords,
  importPublished,
  insertSubmissions,
  publishEntry,
  savePublished,
  setStatus,
} from "@/lib/entries";
import { savePageCopy } from "@/lib/copy";
import { deleteMessage, insertMessage } from "@/lib/messages";
import { pageBySlug } from "@/lib/site-copy";
import { parseLexiconSheet } from "@/lib/sheet";
import { normalize, wordKey } from "@/lib/text";
import type { ActionError, ActionOk, EntryDraft } from "@/lib/types";

const draftSchema = z.object({
  word: z.string().trim().min(1, "Add a Ge'ez headword.").max(120, "That headword is too long."),
  origin: z.string().trim().max(500, "The origin is too long."),
  definition: z
    .string()
    .trim()
    .min(1, "Add an Amharic definition.")
    .max(4000, "That definition is too long."),
  notes: z.string().trim().max(2000, "The note is too long."),
});

const submitSchema = z.object({
  email: z.string().trim().max(200),
  website: z.string().optional(),
  entries: z.array(draftSchema).min(1, "Add at least one word.").max(20, "Submit up to 20 words at a time."),
});

function refreshLexicon(id?: string) {
  updateTag("lexicon");
  revalidatePath("/");
  revalidatePath("/dictionary");
  revalidatePath("/api/search");
  revalidatePath("/admin");
  if (id) revalidatePath(`/dictionary/${id}`);
}

function cleanDraft(entry: z.infer<typeof draftSchema>): EntryDraft {
  return {
    word: normalize(entry.word),
    origin: normalize(entry.origin),
    definition: normalize(entry.definition),
    notes: normalize(entry.notes),
  };
}

function passwordIssue(password: string, confirm: string): "short" | "long" | "match" | null {
  if (password.length < 8) return "short";
  if (password.length > 200) return "long";
  if (password !== confirm) return "match";
  return null;
}

export async function loginAction(formData: FormData) {
  const given = String(formData.get("password") ?? "");
  const result = await loginWithPassword(given);
  if (result === "unset") redirect("/admin");
  if (result === "locked") redirect("/admin?error=locked");
  if (result !== "ok") {
    await new Promise((resolve) => setTimeout(resolve, 400));
    redirect("/admin?error=bad");
  }
  await createSession();
  redirect("/admin");
}

export async function setupPasswordAction(formData: FormData) {
  if (await hasAdminPassword()) redirect("/admin");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const issue = passwordIssue(password, confirm);
  if (issue) redirect(`/admin?error=${issue}`);
  try {
    const { recoveryCode } = await createAdminPassword(password);
    await stageRecoveryFlash(recoveryCode);
    await createSession();
  } catch (error) {
    if (error instanceof Error && error.message === "password-exists") {
      redirect("/admin?error=taken");
    }
    redirect("/admin?error=save");
  }
  redirect("/admin");
}

export async function resetPasswordAction(formData: FormData) {
  if (!(await hasAdminPassword())) redirect("/admin");
  const code = String(formData.get("recovery") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const issue = passwordIssue(password, confirm);
  if (issue) redirect(`/admin/reset?error=${issue}`);
  const result = await resetWithRecovery(code, password);
  if (!result.ok) {
    if (result.reason === "unset") redirect("/admin");
    if (result.reason === "locked") redirect("/admin/reset?error=locked");
    await new Promise((resolve) => setTimeout(resolve, 400));
    redirect("/admin/reset?error=bad");
  }
  await stageRecoveryFlash(result.recoveryCode);
  await createSession();
  redirect("/admin");
}

export async function acknowledgeRecovery() {
  if (!(await isAdmin())) return;
  await clearRecoveryFlash();
  revalidatePath("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin");
}

export async function submitEntries(input: {
  email: string;
  website?: string;
  entries: EntryDraft[];
}): Promise<ActionError | ActionOk<{ words: string[]; alreadyPublished: string[] }>> {
  if (input.website && input.website.trim()) {
    return { ok: true, words: input.entries.map((entry) => entry.word), alreadyPublished: [] };
  }

  const parsed = submitSchema.safeParse({
    ...input,
    entries: input.entries.filter(
      (entry) => entry.word.trim() || entry.origin.trim() || entry.definition.trim() || entry.notes.trim(),
    ),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const email = parsed.data.email;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email address does not look complete." };
  }

  const entries = parsed.data.entries.map(cleanDraft);
  try {
    const alreadyPublished = await findPublishedWords(entries.map((entry) => wordKey(entry.word)));
    await insertSubmissions({ email, entries });
    revalidatePath("/admin");
    return { ok: true, words: entries.map((entry) => entry.word), alreadyPublished };
  } catch {
    return { ok: false, error: "The submission could not be saved. Try again in a moment." };
  }
}

export async function reviewEntry(input: {
  id: string;
  intent: "publish" | "reject" | "save" | "queue";
  word?: string;
  origin?: string;
  definition?: string;
  notes?: string;
}): Promise<ActionError | ActionOk> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Your session ended. Refresh the page and sign in again." };
  }

  if (input.intent === "reject") {
    const updated = await setStatus(input.id, "rejected");
    if (!updated) return { ok: false, error: "That ticket could not be declined." };
    refreshLexicon(input.id);
    return { ok: true };
  }

  if (input.intent === "queue") {
    const updated = await setStatus(input.id, "pending");
    if (!updated) return { ok: false, error: "That entry could not be returned to the queue." };
    refreshLexicon(input.id);
    return { ok: true };
  }

  const parsed = draftSchema.safeParse({
    word: input.word ?? "",
    origin: input.origin ?? "",
    definition: input.definition ?? "",
    notes: input.notes ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the fields and try again." };
  }
  const draft = cleanDraft(parsed.data);

  try {
    if (input.intent === "save") {
      const saved = await savePublished(input.id, draft);
      if (saved === "conflict") {
        return { ok: false, error: "Another published headword already uses that spelling." };
      }
      if (saved === "missing") return { ok: false, error: "That published entry is no longer there." };
      refreshLexicon(input.id);
      return { ok: true };
    }

    const published = await publishEntry(input.id, draft);
    if (!published) return { ok: false, error: "That ticket is no longer waiting for review." };
    refreshLexicon(input.id);
    return { ok: true };
  } catch {
    return { ok: false, error: "The lexicon could not be updated." };
  }
}

export async function importSheet(formData: FormData): Promise<
  | ActionError
  | ActionOk<{
      preview: boolean;
      created: number;
      updated: number;
      unchanged: number;
      imported: number;
      errors: string[];
      sample: SheetPreview[];
    }>
> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Your session ended. Refresh the page and sign in again." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a CSV or Excel file." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: "Files larger than 8 MB need to be split." };
  }

  const parsed = parseLexiconSheet(new Uint8Array(await file.arrayBuffer()), file.name);
  if (parsed.rows.length === 0) {
    return { ok: false, error: parsed.errors[0] ?? "No rows could be read." };
  }

  const preview = String(formData.get("mode") ?? "") === "preview";
  const sample = parsed.rows.slice(0, 12).map((row) => ({
    line: row.line,
    word: row.word,
    origin: row.origin,
    definition: row.definition,
  }));

  if (preview) {
    return {
      ok: true,
      preview: true,
      created: 0,
      updated: 0,
      unchanged: 0,
      imported: parsed.rows.length,
      errors: parsed.errors,
      sample,
    };
  }

  try {
    const result = await importPublished(parsed.rows);
    refreshLexicon();
    return {
      ok: true,
      preview: false,
      ...result,
      imported: parsed.rows.length,
      errors: parsed.errors,
      sample,
    };
  } catch {
    return { ok: false, error: "The sheet could not be imported." };
  }
}

type SheetPreview = { line: number; word: string; origin: string; definition: string };

function refreshPages() {
  revalidatePath("/", "layout");
}

export async function savePageAction(input: {
  slug: string;
  values: Record<string, string>;
}): Promise<ActionError | ActionOk> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Your session ended. Refresh the page and sign in again." };
  }
  if (!pageBySlug(input.slug)) return { ok: false, error: "That page is not editable." };
  try {
    const issue = await savePageCopy(input.slug, input.values);
    if (issue) return { ok: false, error: issue };
    refreshPages();
    return { ok: true };
  } catch {
    return { ok: false, error: "The page could not be saved." };
  }
}

const messageSchema = z.object({
  name: z.string().trim().min(1, "Add your name.").max(80, "That name is too long."),
  email: z.string().trim().min(1, "Add an email address.").max(200, "That email address is too long."),
  message: z.string().trim().min(1, "Write a message.").max(4000, "That message is too long."),
  website: z.string().optional(),
});

export async function sendMessage(input: {
  name: string;
  email: string;
  message: string;
  website?: string;
}): Promise<ActionError | ActionOk> {
  if (input.website && input.website.trim()) return { ok: true };
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.data.email)) {
    return { ok: false, error: "That email address does not look complete." };
  }
  try {
    await insertMessage({
      name: normalize(parsed.data.name),
      email: parsed.data.email.trim(),
      body: parsed.data.message.normalize("NFC").replace(/[\u200B-\u200D\uFEFF]/g, "").trim(),
    });
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "The message could not be sent. Try again in a moment." };
  }
}

export async function removeMessage(id: string): Promise<ActionError | ActionOk> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Your session ended. Refresh the page and sign in again." };
  }
  const removed = await deleteMessage(id);
  if (!removed) return { ok: false, error: "That message is no longer there." };
  revalidatePath("/admin");
  return { ok: true };
}
