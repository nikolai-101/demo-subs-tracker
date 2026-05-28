"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categorySchema } from "@/lib/validation";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/repos/categories";

export interface ActionResult {
  ok: boolean;
  fieldErrors?: Record<string, string>;
  error?: string;
}

function parseFormData(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });
}

export async function createCategoryAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flatten(parsed.error.flatten().fieldErrors),
    };
  }
  try {
    createCategory(parsed.data);
  } catch (e) {
    if (e instanceof Error && e.message.includes("UNIQUE")) {
      return { ok: false, fieldErrors: { name: "Категория с таким названием уже есть" } };
    }
    throw e;
  }
  revalidatePath("/categories");
  revalidatePath("/subscriptions");
  redirect("/categories");
}

export async function updateCategoryAction(
  id: number,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flatten(parsed.error.flatten().fieldErrors),
    };
  }
  try {
    updateCategory(id, parsed.data);
  } catch (e) {
    if (e instanceof Error && e.message.includes("UNIQUE")) {
      return { ok: false, fieldErrors: { name: "Категория с таким названием уже есть" } };
    }
    throw e;
  }
  revalidatePath("/categories");
  revalidatePath("/subscriptions");
  redirect("/categories");
}

export async function deleteCategoryAction(id: number): Promise<void> {
  deleteCategory(id);
  revalidatePath("/categories");
  revalidatePath("/subscriptions");
}

function flatten(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fieldErrors)) {
    if (v && v.length > 0) out[k] = v[0];
  }
  return out;
}
