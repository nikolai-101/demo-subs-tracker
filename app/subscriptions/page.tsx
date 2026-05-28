import Link from "next/link";
import { listSubscriptions } from "@/lib/repos/subscriptions";
import { listCategories } from "@/lib/repos/categories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import {
  formatDateRu,
  formatMoney,
  formatRelativeDays,
} from "@/lib/domain/format";
import { ConfirmForm } from "@/components/confirm-form";
import {
  cancelSubscriptionAction,
  deleteSubscriptionAction,
  markChargedAction,
  restoreSubscriptionAction,
} from "@/lib/actions/subscriptions";
import { differenceInCalendarDays, parseISO } from "date-fns";
import type { SubscriptionStatus } from "@/lib/types";

interface Props {
  searchParams: Promise<{
    status?: string;
    category?: string;
    sort?: string;
  }>;
}

const VALID_STATUS = new Set(["active", "cancelled", "all"]);
const VALID_SORT = new Set(["next_charge_date", "amount", "name"]);

export default async function SubscriptionsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = (VALID_STATUS.has(sp.status ?? "") ? sp.status : "active") as
    | SubscriptionStatus
    | "all";
  const sort = (VALID_SORT.has(sp.sort ?? "") ? sp.sort : "next_charge_date") as
    | "next_charge_date"
    | "amount"
    | "name";

  let categoryId: number | "uncategorized" | undefined;
  if (sp.category === "uncategorized") categoryId = "uncategorized";
  else if (sp.category && /^\d+$/.test(sp.category)) categoryId = Number(sp.category);

  const subs = listSubscriptions({ status, categoryId, sort });
  const categories = listCategories();
  const today = new Date();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Подписки</h1>
        <Link href="/subscriptions/new">
          <Button>+ Добавить</Button>
        </Link>
      </header>

      <form className="flex flex-wrap items-end gap-3" action="/subscriptions">
        <FilterSelect
          label="Статус"
          name="status"
          value={status}
          options={[
            { value: "active", label: "Активные" },
            { value: "cancelled", label: "Отменённые" },
            { value: "all", label: "Все" },
          ]}
        />
        <FilterSelect
          label="Категория"
          name="category"
          value={sp.category ?? ""}
          options={[
            { value: "", label: "Все" },
            { value: "uncategorized", label: "Без категории" },
            ...categories.map((c) => ({ value: String(c.id), label: c.name })),
          ]}
        />
        <FilterSelect
          label="Сортировка"
          name="sort"
          value={sort}
          options={[
            { value: "next_charge_date", label: "По дате списания" },
            { value: "amount", label: "По сумме" },
            { value: "name", label: "По названию" },
          ]}
        />
        <Button type="submit" variant="secondary" size="md">
          Применить
        </Button>
      </form>

      {subs.length === 0 ? (
        <EmptyState status={status} />
      ) : (
        <div className="space-y-3">
          {subs.map((s) => {
            const days = differenceInCalendarDays(parseISO(s.next_charge_date), today);
            const overdue = s.status === "active" && days < 0;
            return (
              <Card key={s.id}>
                <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      {s.status === "cancelled" && <Badge>Отменена</Badge>}
                      {overdue && <Badge tone="danger">Просрочена</Badge>}
                      {s.category_name && (
                        <Badge
                          tone="accent"
                          style={
                            s.category_color
                              ? {
                                  backgroundColor: `${s.category_color}1a`,
                                  color: s.category_color,
                                }
                              : undefined
                          }
                        >
                          {s.category_name}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted">
                      {formatMoney(s.amount, s.currency)} •{" "}
                      {s.period === "monthly" ? "ежемесячно" : "ежегодно"} •{" "}
                      {formatDateRu(s.next_charge_date)}{" "}
                      {s.status === "active" && (
                        <span className="text-muted">({formatRelativeDays(days)})</span>
                      )}
                    </div>
                    {s.note && <div className="text-xs text-muted">{s.note}</div>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.status === "active" && (
                      <ConfirmForm
                        action={async () => {
                          "use server";
                          await markChargedAction(s.id);
                        }}
                        label="Списалось"
                        variant="primary"
                      />
                    )}
                    <Link href={`/subscriptions/${s.id}/edit`}>
                      <Button variant="secondary" size="sm">
                        Изменить
                      </Button>
                    </Link>
                    {s.status === "active" ? (
                      <ConfirmForm
                        action={async () => {
                          "use server";
                          await cancelSubscriptionAction(s.id);
                        }}
                        label="Отменить"
                        variant="warn"
                        confirm="Отменить подписку? Она перестанет учитываться в активных тратах."
                      />
                    ) : (
                      <>
                        <ConfirmForm
                          action={async () => {
                            "use server";
                            await restoreSubscriptionAction(s.id);
                          }}
                          label="Восстановить"
                          variant="secondary"
                        />
                        <ConfirmForm
                          action={async () => {
                            "use server";
                            await deleteSubscriptionAction(s.id);
                          }}
                          label="Удалить"
                          variant="danger"
                          confirm="Удалить подписку безвозвратно? История платежей тоже удалится."
                        />
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-muted">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-10 rounded-md border border-border bg-card px-3 text-sm text-fg"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyState({ status }: { status: string }) {
  return (
    <Card>
      <CardBody className="space-y-3 py-12 text-center">
        <div className="text-base font-medium">
          {status === "cancelled" ? "Отменённых подписок пока нет" : "Подписок пока нет"}
        </div>
        <p className="text-sm text-muted">
          {status === "cancelled"
            ? "Здесь будут подписки, которые ты отменишь."
            : "Добавь первую — и она появится в этом списке и на дашборде."}
        </p>
        {status !== "cancelled" && (
          <div>
            <Link href="/subscriptions/new">
              <Button>+ Добавить подписку</Button>
            </Link>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
