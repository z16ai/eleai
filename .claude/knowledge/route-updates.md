# 路由更新 & 结构变更知识

## Rules for eleai-studio project

### 1. Current Route Structure (Final)

Required URLs:
- `/` → Home page (landing)
- `/image` → Image Studio (with sidebar)
- `/video` → Video Studio (with sidebar)
- `/audio` → Audio Lab (with sidebar)

Folder structure:
```
src/app/
├── page.tsx
├── layout.tsx (root)
├── image/
│   ├── layout.tsx (includes Sidebar)
│   └── page.tsx
├── video/
│   ├── layout.tsx (includes Sidebar)
│   └── page.tsx
├── audio/
│   ├── layout.tsx (includes Sidebar)
│   └── page.tsx
└── api/...
```

**Each studio page must have its own layout.tsx** that imports Sidebar.

### 2. After changing route structure, ALWAYS do:

```bash
# 1. Kill old dev server
# 2. Clear cache
rm -rf .next
# 3. Rebuild & restart
npm run dev
```

**Why?** Next.js keeps old compiled files in `.next` cache, changing folder structure without clearing cache causes 404/500 errors.

### 3. Links to check after route change

Always update these files:
- `src/components/Sidebar.tsx` → all `href`
- `src/app/page.tsx` → all three card links + Start Now button + bottom CTA

### 4. Current working state (as of 2025-04-02)

✅ **Final correct state:**
- URLs: `/image`, `/video`, `/audio` (no `/studio/` prefix)
- No parentheses in folder names
- Each page has own layout with Sidebar
- All links updated correctly
