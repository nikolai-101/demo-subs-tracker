import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Трекер подписок",
  description: "Локальный учёт подписок",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen antialiased">
        <header className="border-b border-border bg-card">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Подписки
            </Link>
            <div className="flex gap-4 text-sm text-muted">
              <Link href="/" className="hover:text-fg">
                Дашборд
              </Link>
              <Link href="/subscriptions" className="hover:text-fg">
                Подписки
              </Link>
              <Link href="/categories" className="hover:text-fg">
                Категории
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
