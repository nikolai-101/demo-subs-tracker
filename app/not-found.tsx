import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 py-10 text-center">
      <h1 className="text-2xl font-semibold">Не найдено</h1>
      <p className="text-sm text-muted">Такой страницы или записи нет.</p>
      <Link href="/" className="text-sm text-accent hover:underline">
        На дашборд →
      </Link>
    </div>
  );
}
