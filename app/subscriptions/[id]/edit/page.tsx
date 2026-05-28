import { notFound } from "next/navigation";
import { listCategories } from "@/lib/repos/categories";
import { getSubscription } from "@/lib/repos/subscriptions";
import { SubscriptionForm } from "@/components/subscription-form";
import { updateSubscriptionAction } from "@/lib/actions/subscriptions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSubscriptionPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) notFound();
  const sub = getSubscription(id);
  if (!sub) notFound();
  const categories = listCategories();

  const action = updateSubscriptionAction.bind(null, id);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Редактировать подписку</h1>
      <SubscriptionForm
        action={action}
        categories={categories}
        initial={sub}
        submitLabel="Сохранить"
      />
    </div>
  );
}
