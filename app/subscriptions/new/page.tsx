import { listCategories } from "@/lib/repos/categories";
import { SubscriptionForm } from "@/components/subscription-form";
import { createSubscriptionAction } from "@/lib/actions/subscriptions";

export default function NewSubscriptionPage() {
  const categories = listCategories();
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Новая подписка</h1>
      <SubscriptionForm
        action={createSubscriptionAction}
        categories={categories}
        submitLabel="Создать"
      />
    </div>
  );
}
