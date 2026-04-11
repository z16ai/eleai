# Local Supabase Development

This document contains instructions for local Supabase development with Docker.

## Status

- ✅ `supabase init` completed
- ⏳ Docker images downloading / starting

## Current Setup

All migrations are in `supabase/migrations/`, ready to apply to local database:

| Migration | Description |
|-----------|-------------|
| `001_create_tables.sql` | Initial tables creation |
| `003_reset_points_function.sql` | Reset daily points function |
| `005_bypass_rls.sql` | Bypass RLS |
| `006_add_public_field.sql` | Add public field to images |
| `007_add_web3_account.sql` | Add `web3_account JSONB` to `user_profiles` |
| `008_fix_user_points_rls.sql` | Add INSERT policy for `user_points` |
| `009_recreate_all_user_points_policies.sql` | Recreate all RLS policies for `user_points` |

## How to complete local setup

### 1. Start Supabase

```bash
supabase start
```

This will:
- Pull all required Docker images
- Start Postgres, Auth, Storage, Kong, etc.
- Apply all migrations from `supabase/migrations/`

### 2. Get API keys

When `supabase start` completes, it will output:

```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbox URL: http://localhost:54324/inbox
        anon key: <anon-key-output-here>
   service_role key: <service-role-key-output-here>
```

### 3. Update `.env.local`

Update your `.env.local` with the output values:

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-output>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-from-output>
```

### 4. Import remote data (optional)

If you want to migrate existing data from remote database to local:

```bash
# Dump from remote
supabase db dump --remote --file remote-dump.sql

# Restore to local
supabase db restore remote-dump.sql
```

### 5. Run Next.js

```bash
npm run dev
```

## Connection Info for Local Development

| Service | Address |
|---------|---------|
| Postgres | `postgresql://postgres:postgres@localhost:54322/postgres` |
| API | `http://localhost:54321` |
| Studio | `http://localhost:54323` |

## Common Issues

### 1. Images pulling slow

Docker images are large (~1-2GB total), be patient. If it gets stuck, try:

```bash
docker pull supabase/postgres:15.1.0.148
supabase start
```

### 2. Containers not starting

```bash
supabase stop
docker system prune -f
supabase start
```

### 3. Migrations not applied

```bash
supabase db push
```

## Current Changes in Migration

- Added `web3_account JSONB` field to `user_profiles`
- Fixed RLS policies for `user_points` (added INSERT policy)
- All existing migrations preserved

## Verify Everything Works

After starting:

1. Open `http://localhost:54323` → Supabase Studio local
2. Check `public` schema → tables `user_profiles`, `user_points`, `image_generations` exist
3. Check `user_profiles` has `web3_account` column
4. Check RLS is enabled on all tables
5. Run `npm run dev` → open app → login → verify points display and image generation works
