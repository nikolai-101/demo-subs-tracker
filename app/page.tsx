import Link from "next/link";
import { listSubscriptions } from "@/lib/repos/subscriptions";
import { totalsByCurrency } from "@/lib/domain/normalize";
import { classifyUpcoming } from "@/lib/domain/dashboard";
import {
  formatDateRu,
  formatMoney,
  formatRelativeDays,
} from "@/lib/domain/format";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmForm } from "@/components/confirm-form";
import { markChargedAction } from "@/lib/actions/subscriptions";

export default function DashboardPage() {
  const allActive = listSubscriptions({ status: "active" });
  const totals = totalsByCurrency(allActive);
  const today = new Date();
  const { overdue, upcoming } = classifyUpcoming(allActive, today, 7);

  const hasAny = allActive.length > 0;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Дашборд</h1>
        <Link href="/subscriptions/new">
          <Button>+ Добавить подписку</Button>
        </Link>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>В месяц (нормализовано)</CardTitle>
        </CardHeader>
        <CardBody>
          {Object.keys(totals).length === 0 ? (
            <p className="text-sm text-muted">
              {hasAny
                ? "Нет активных подписок с суммой."
                : "Добавь первую подписку — здесь появится месячная сумма."}
            </p>
          ) : (
            <div className="space-y-2">
              {Object.entries(totals)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([currency, amount]) => (
                  <div
                    key={currency}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="text-3xl font-semibold tracking-tight tabular-nums">
                      {formatMoney(amount, currency)}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-muted">
                      {currency}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </CardBody>
      </Card>

      {overdue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Просрочены</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="divide-y divide-border">
              {overdue.map(({ subscription: s, daysUntil }) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/subscriptions/${s.id}/edit`} className="font-medium hover:underline">
                        {s.name}
                      </Link>
                      <Badge tone="danger">Просрочена</Badge>
                    </div>
                    <div className="text-sm text-muted">
                      {formatMoney(s.amount, s.currency)} •{" "}
                      {formatDateRu(s.next_charge_date)} ({formatRelativeDays(daysUntil)})
                    </div>
                  </div>
                  <ConfirmForm
                    action={async () => {
                      "use server";
                      await markChargedAction(s.id);
                    }}
                    label="Списалось"
                    variant="primary"
                  />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ближайшие 7 дней</CardTitle>
        </CardHeader>
        <CardBody>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">На этой неделе списаний не ожидается.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map(({ subscription: s, daysUntil }) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/subscriptions/${s.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {s.name}
                    </Link>
                    <div className="text-sm text-muted">
                      {formatDateRu(s.next_charge_date)} • {formatRelativeDays(daysUntil)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums">
                      {formatMoney(s.amount, s.currency)}
                    </div>
                    <div className="text-xs text-muted">
                      {s.period === "monthly" ? "ежемесячно" : "ежегодно"}
                    </div>
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
