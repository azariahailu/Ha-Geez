export type EntryStatus = "pending" | "published" | "rejected";

export type PublicEntry = {
  id: string;
  word: string;
  origin: string;
  definition: string;
  notes: string;
  letter: string;
};

export type AdminEntry = PublicEntry & {
  email: string;
  status: EntryStatus;
  createdAt: string;
  updatedAt: string;
};

export type EntryDraft = {
  word: string;
  origin: string;
  definition: string;
  notes: string;
};

export type ActionError = { ok: false; error: string };
export type ActionOk<T extends object = object> = { ok: true } & T;
