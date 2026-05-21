# Синхронизация задач и уведомлений по ролям (Supabase)

Без общего сервера каждый телефон хранит данные отдельно — поэтому руководитель на ПК не видит выполнение на телефоне сотрудника, пока не отправят ссылку.

С **Supabase** (бесплатный тариф) задачи и уведомления **по ролям** синхронизируются сами:

| Событие | Кому приходит |
|---------|----------------|
| Назначили задачу | Сотруднику (`employeeId`) + руководство (`manager`, `admin`) |
| Отметили «Выполнена» | Руководство + тот, кто назначил |

## 1. Проект Supabase

1. [supabase.com](https://supabase.com) → New project.
2. SQL Editor → выполнить:

```sql
create table matrix_tasks (
  id text primary key,
  employee_id text not null,
  title text not null,
  assigned_by text not null,
  due_date text not null,
  status text not null,
  created_at text not null
);

create table matrix_notifications (
  id text primary key,
  kind text not null,
  task_id text not null,
  employee_id text not null,
  employee_name text not null,
  task_title text not null,
  assigned_by text not null,
  target_employee_id text,
  target_roles text[],
  created_at text not null,
  read boolean default false
);

alter publication supabase_realtime add table matrix_tasks;
alter publication supabase_realtime add table matrix_notifications;

-- Демо: открытый доступ по anon (для продакшена — RLS и политики)
alter table matrix_tasks enable row level security;
alter table matrix_notifications enable row level security;
create policy "demo_all_tasks" on matrix_tasks for all using (true) with check (true);
create policy "demo_all_notifications" on matrix_notifications for all using (true) with check (true);
```

3. Settings → API: скопировать **Project URL** и **anon public** key.

## 2. Переменные для сборки

В `web-matrix/.env` (локально) или GitHub Actions secrets для Pages:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

Пересобрать и задеплоить `web-matrix`.

## 3. Проверка

- Руководитель на ПК: «Сотрудники» → назначить задачу охране.
- Охрана на телефоне: «Мои задачи» — задача появляется без ссылки.
- Охрана: «Выполнена» + подтверждение.
- Руководитель на ПК: «Уведомления руководству» — запись о выполнении.

Жёлтый баннер «отправьте ссылку» исчезает, когда синхронизация включена.
