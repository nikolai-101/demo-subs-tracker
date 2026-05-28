import { listCategories } from "@/lib/repos/categories";
import { CategoryForm } from "@/components/category-form";
import {
  createCategoryAction,
  deleteCategoryAction,
} from "@/lib/actions/categories";
import { ConfirmForm } from "@/components/confirm-form";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const categories = listCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Категории</h1>

      <Card>
        <CardHeader>
          <CardTitle>Новая категория</CardTitle>
        </CardHeader>
        <CardBody>
          <CategoryForm action={createCategoryAction} submitLabel="Создать" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Все категории</CardTitle>
        </CardHeader>
        <CardBody>
          {categories.length === 0 ? (
            <p className="text-sm text-muted">Пока пусто. Создай первую категорию выше.</p>
          ) : (
            <ul className="divide-y divide-border">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-3 rounded-full border border-border"
                      style={{ backgroundColor: c.color ?? "transparent" }}
                    />
                    <span className="font-medium">{c.name}</span>
                    {c.color && <span className="text-xs text-muted">{c.color}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/categories/${c.id}/edit`}>
                      <Button variant="secondary" size="sm">
                        Изменить
                      </Button>
                    </Link>
                    <ConfirmForm
                      action={async () => {
                        "use server";
                        await deleteCategoryAction(c.id);
                      }}
                      label="Удалить"
                      variant="danger"
                      confirm="Удалить категорию? У подписок она просто отвяжется."
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
