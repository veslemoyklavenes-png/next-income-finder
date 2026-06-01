# Next Income Finder

A production-ready AI web tool that gives midlife women a ranked, specific income plan based on their real situation right now.

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Environment variables

Create a `.env.local` file in the project root (one already exists as a template) and fill in:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → service_role key (keep this secret) |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

---

## 3. Supabase setup

In your Supabase project, open the **SQL Editor** and run this once:

```sql
-- Usage tracking
CREATE TABLE IF NOT EXISTS ai_usage (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date    date not null,
  count   integer not null default 1,
  unique (user_id, date)
);
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own rows" ON ai_usage FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Generation history
CREATE TABLE IF NOT EXISTS generation_history (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  inputs     jsonb not null,
  output     text not null,
  created_at timestamptz not null default now()
);
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own rows" ON generation_history FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

Also go to **Authentication → URL Configuration** and add:
- Site URL: `http://localhost:3000` (dev) or your production URL
- Redirect URLs: `http://localhost:3000/auth/callback` and `https://yourdomain.com/auth/callback`

---

## 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Sales placeholder: `/`
- Sign up / sign in: `/login`
- Dashboard: `/dashboard`
- The AI tool: `/tool`

---

## 5. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → New Project → Import the repo.
3. Add all four environment variables under **Settings → Environment Variables**.
4. Click **Deploy**.
5. After deploy, update your Supabase redirect URL to include your Vercel domain.

---

## 6. Customer login URL

After launch, email every customer who purchases:

```
https://[yourdomain.com]/login
```

They create an account with their email and a password, then land on the dashboard and can open the tool immediately.

---

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (@supabase/ssr) — auth + database
- **Anthropic SDK** — claude-sonnet-4-6 with prompt caching
- **Tailwind CSS** — Lora + Inter fonts, sage green / deep navy brand
- **Vercel** — deployment
