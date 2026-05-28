import { notFound } from "next/navigation";
import { getCategory } from "@/lib/repos/categories";
import { CategoryForm } from "@/components/category-form";
import { updateCategoryAction } from "@/lib/actions/categories";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) notFound();
  const category = getCategory(id);
  if (!category) notFound();

  const action = updateCategoryAction.bind(null, id);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Редактировать категорию</h1>
      <CategoryForm action={action} initial={category} submitLabel="Сохранить" />
    </div>
  );
}
