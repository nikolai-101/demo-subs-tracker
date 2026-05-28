# Трекер подписок

Локальный учёт платных подписок: одно приложение, один пользователь, файл SQLite в `data/subscriptions.db`. См. [docs/PRD.md](docs/PRD.md) для полного контекста.

## Запуск

```bash
npm install
npm run dev
# http://localhost:3000
```

При первом старте автоматически создаётся `data/subscriptions.db` и применяется схема из `lib/schema.sql`.

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Запускает Next.js dev-сервер на :3000. |
| `npm run build` | Продакшен-сборка. |
| `npm start` | Запускает собранное приложение. |
| `npm test` | Прогоняет юнит-тесты (Vitest) для доменной логики. |
| `npm run test:watch` | То же в watch-режиме. |

## Стек

- **Next.js 15** (App Router, Server Actions).
- **better-sqlite3** — синхронный драйвер SQLite, инициализируется через singleton в [lib/db.ts](lib/db.ts).
- **Tailwind CSS** + минимальные UI-примитивы в [components/ui/](components/ui).
- **zod** для валидации форм в [lib/validation.ts](lib/validation.ts); формы — `useActionState` поверх Server Actions.
- **date-fns** для календарной арифметики (cap-to-last-day из коробки).
- **Vitest** для юнит-тестов доменной логики.

## Что покрыто тестами

- Сдвиг даты следующего списания, включая 31 января → 28/29 февраля, високосный год, переход через год — [lib/domain/next-date.test.ts](lib/domain/next-date.test.ts).
- Нормализация месячной суммы и агрегация по валютам — [lib/domain/normalize.test.ts](lib/domain/normalize.test.ts).
- Классификация «просрочено / ближайшие 7 дней» — [lib/domain/dashboard.test.ts](lib/domain/dashboard.test.ts).

## Структура

```
app/
├── page.tsx                 # Дашборд
├── subscriptions/
│   ├── page.tsx             # Список + фильтры
│   ├── new/page.tsx         # Создание
│   └── [id]/edit/page.tsx   # Редактирование
└── categories/
    ├── page.tsx             # CRUD категорий
    └── [id]/edit/page.tsx
components/                  # UI-примитивы + формы
lib/
├── db.ts                    # better-sqlite3 singleton + migration on boot
├── schema.sql               # DDL
├── types.ts
├── validation.ts            # zod
├── domain/                  # normalize, next-date, dashboard, format
├── repos/                   # subscriptions, categories, events
└── actions/                 # Server Actions
data/
└── subscriptions.db         # gitignored
```

## Бэкап

База — обычный файл `data/subscriptions.db`. Достаточно скопировать его, чтобы сохранить состояние. Автобэкап не предусмотрен (см. PRD §6).

## Решения, зафиксированные в MVP

- **Арифметика месяцев**: используется `date-fns/addMonths` с cap-to-last-day. Пример: `2026-01-31` + 1 месяц = `2026-02-28`. Зафиксировано тестами.
- **Просроченные периоды**: при нажатии «Списалось» сдвигается ровно один период. Если пропущено несколько — нажать столько же раз. Батч-подтверждение — вне MVP.
- **Мультивалюта**: суммы по валютам показываются отдельными строками, конвертация не выполняется.
- **Удаление vs отмена**: основной поток — «Отменить» (подписка уходит в архив). «Удалить» доступно только из архива и просит подтверждение.
- **Миграции**: при старте `db.ts` прогоняет `schema.sql` через `CREATE TABLE IF NOT EXISTS`. Версионирование введём при первом ALTER.

## Контрибьюция

Проект следует [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow): `main` всегда деплоибельна, вся работа идёт через короткоживущие фича-ветки.

1. **Создай ветку** от свежего `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b feat/short-description
   ```
   Префиксы: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`.
2. **Коммить мелко и осмысленно.** Стиль сообщений — как в истории (`feat:`, `fix:`, `chore:`, `docs:`).
3. **Прогони проверки локально** перед пушем:
   ```bash
   npm test
   npm run build
   ```
4. **Запушь ветку** и открой Pull Request в `main`:
   - заголовок — что и зачем;
   - описание — короткий чек-лист изменений и как проверить;
   - привяжи issue, если есть.
5. **Code review → squash & merge** в `main`. После мержа ветка удаляется.
6. **Hotfix** — такая же фича-ветка от `main` с префиксом `fix/`, без отдельных release-веток.

Прямые пуши в `main` не делаем — только через PR.
