import { getDb } from "@/lib/db";
import type { Category } from "@/lib/types";

export function listCategories(): Category[] {
  return getDb()
    .prepare<[], Category>("SELECT id, name, color FROM categories ORDER BY name ASC")
    .all();
}

export function getCategory(id: number): Category | null {
  return (
    getDb()
      .prepare<[number], Category>(
        "SELECT id, name, color FROM categories WHERE id = ?",
      )
      .get(id) ?? null
  );
}

export function createCategory(input: { name: string; color: string | null }): number {
  const info = getDb()
    .prepare("INSERT INTO categories (name, color) VALUES (?, ?)")
    .run(input.name, input.color);
  return Number(info.lastInsertRowid);
}

export function updateCategory(
  id: number,
  input: { name: string; color: string | null },
): void {
  getDb()
    .prepare("UPDATE categories SET name = ?, color = ? WHERE id = ?")
    .run(input.name, input.color, id);
}

export function deleteCategory(id: number): void {
  getDb().prepare("DELETE FROM categories WHERE id = ?").run(id);
}
