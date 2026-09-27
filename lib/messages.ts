import { getDb } from "@/lib/db";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  body: string;
  createdAt: string;
};

export async function insertMessage(input: { name: string; email: string; body: string }): Promise<void> {
  const client = await getDb();
  await client.execute({
    sql: "INSERT INTO messages (id, name, email, body, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [crypto.randomUUID(), input.name, input.email, input.body, new Date().toISOString()],
  });
}

export async function listMessages(limit = 200): Promise<ContactMessage[]> {
  const client = await getDb();
  const result = await client.execute({
    sql: "SELECT id, name, email, body, created_at FROM messages ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  });
  return result.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    body: String(row.body),
    createdAt: String(row.created_at),
  }));
}

export async function messageCount(): Promise<number> {
  const client = await getDb();
  const result = await client.execute("SELECT COUNT(*) AS c FROM messages");
  return Number(result.rows[0]?.c ?? 0);
}

export async function deleteMessage(id: string): Promise<boolean> {
  const client = await getDb();
  const result = await client.execute({ sql: "DELETE FROM messages WHERE id = ?", args: [id] });
  return result.rowsAffected > 0;
}
