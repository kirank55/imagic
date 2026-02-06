# Prisma Database Guide

This guide explains how Prisma is set up in this project, how it works, and the workflows for making changes and deploying to production.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [How Prisma Works](#how-prisma-works)
4. [Initial Setup](#initial-setup)
5. [Making Schema Changes](#making-schema-changes)
6. [Deploying to Production](#deploying-to-production)
7. [Common Commands Reference](#common-commands-reference)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses **Prisma 7.x** with PostgreSQL. Prisma provides:

- **Type-safe database queries** - Full TypeScript support with autocomplete
- **Schema-first design** - Define your data model in `schema.prisma`
- **Migrations** - Version-controlled database changes
- **Prisma Client** - Auto-generated query builder

### Key Differences in Prisma 7.x

Prisma 7.x has breaking changes from earlier versions:

1. **Driver Adapters Required**: The client no longer reads `DATABASE_URL` automatically. You must provide an explicit driver adapter.
2. **Generator Provider**: Uses `prisma-client` instead of `prisma-client-js`
3. **Custom Output**: We generate the client to `app/generated/prisma/` instead of `node_modules/`

---

## Project Structure

```
imagic/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── migrations/            # Migration history
│   │   └── 20260206_add_users/
│   │       └── migration.sql
│   └── prisma.config.ts       # Prisma configuration (in root)
├── app/
│   └── generated/
│       └── prisma/            # Generated Prisma Client (gitignored)
│           ├── client.ts      # Main PrismaClient export
│           ├── models.ts      # Generated model types
│           └── ...
├── lib/
│   └── prisma.ts              # Singleton Prisma instance
└── .env                       # Database URL and secrets
```

---

## How Prisma Works

### 1. Schema Definition (`prisma/schema.prisma`)

The schema file defines your data models:

```prisma
generator client {
  provider = "prisma-client"           // Prisma 7.x provider
  output   = "../app/generated/prisma" // Custom output location
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(cuid())
  email     String?  @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Relations
  accounts  Account[]
  sessions  Session[]
}
```

### 2. Prisma Config (`prisma.config.ts`)

Prisma 7.x uses a config file to specify the database URL:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### 3. Driver Adapter (`lib/prisma.ts`)

Prisma 7.x requires an explicit driver adapter to connect to the database:

```typescript
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Create PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Singleton pattern for development (prevents multiple connections on hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 4. The Generation Process

When you run `npx prisma generate`:

```
schema.prisma → Prisma Generator → app/generated/prisma/
                                   ├── client.ts (PrismaClient)
                                   ├── models.ts (User, Account, etc.)
                                   └── internal/ (runtime types)
```

The generated client provides type-safe methods:

```typescript
// Fully typed - TypeScript knows the shape of User
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" },
  include: { accounts: true },
});
// user is typed as User & { accounts: Account[] } | null
```

---

## Initial Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted like Neon, Supabase, etc.)

### Step 1: Install Dependencies

```bash
npm install prisma @prisma/client @prisma/adapter-pg pg
npm install --save-dev @types/pg
```

### Step 2: Set Up Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@host:5432/database_name?sslmode=require"
```

**For Neon (serverless PostgreSQL):**
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Step 3: Initialize Prisma (if starting fresh)

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Empty schema template
- `.env` - Environment file (if not exists)

### Step 4: Define Your Schema

Edit `prisma/schema.prisma` with your models (see Step 3 of implementation plan).

### Step 5: Run Initial Migration

```bash
npx prisma migrate dev --name init
```

This:
1. Creates a new migration file in `prisma/migrations/`
2. Applies the migration to your database
3. Regenerates the Prisma Client

### Step 6: Generate Client (if needed separately)

```bash
npx prisma generate
```

---

## Making Schema Changes

### Development Workflow

When you need to modify the database schema:

#### 1. Edit the Schema

Open `prisma/schema.prisma` and make changes:

```prisma
model User {
  // ... existing fields
  bio String?  // ← Add new field
}
```

#### 2. Create and Apply Migration

```bash
npx prisma migrate dev --name add_user_bio
```

This command:
- Generates SQL migration in `prisma/migrations/YYYYMMDDHHMMSS_add_user_bio/`
- Applies migration to your development database
- Regenerates Prisma Client

#### 3. Verify Types

The Prisma Client is automatically updated. Your new field is now available:

```typescript
const user = await prisma.user.create({
  data: {
    email: "test@example.com",
    bio: "Hello world", // ← New field available
  },
});
```

### Types of Schema Changes

| Change Type | Migration Command | Notes |
|------------|-------------------|-------|
| Add new model | `migrate dev --name add_modelname` | Safe operation |
| Add optional field | `migrate dev --name add_fieldname` | Safe operation |
| Add required field | `migrate dev --name add_fieldname` | Must provide default |
| Rename field | `migrate dev --name rename_x_to_y` | May need manual SQL |
| Delete field | `migrate dev --name remove_fieldname` | Data loss warning |
| Change field type | `migrate dev --name change_fieldtype` | May need manual SQL |

### Handling Required Fields on Existing Data

If adding a required field to a table with existing data:

```prisma
model User {
  // Option 1: Make it optional
  newField String?
  
  // Option 2: Provide a default
  newField String @default("default_value")
  
  // Option 3: Use migration to set values first (advanced)
}
```

---

## Deploying to Production

### Pre-Deployment Checklist

- [ ] All migrations tested locally
- [ ] `prisma/migrations/` committed to git
- [ ] Production `DATABASE_URL` configured
- [ ] Prisma Client generation added to build script

### Build Configuration

Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

The `postinstall` script ensures Prisma Client is generated on platforms like Vercel.

### Deployment Workflow

#### Option A: Automatic Migrations (Recommended for most cases)

Add to your deployment pipeline:

```bash
# Apply pending migrations to production
npx prisma migrate deploy
```

This command:
- ✅ Applies pending migrations in order
- ✅ Does NOT create new migrations
- ✅ Safe for production (no interactive prompts)
- ❌ Will fail if migrations conflict

#### Option B: Manual Migration (For complex changes)

1. **Generate migration locally** (don't apply):
   ```bash
   npx prisma migrate dev --name my_change --create-only
   ```

2. **Review the SQL**:
   ```sql
   -- prisma/migrations/20260206_my_change/migration.sql
   ALTER TABLE "User" ADD COLUMN "bio" TEXT;
   ```

3. **Modify if needed** (add data migrations, custom SQL)

4. **Apply locally**:
   ```bash
   npx prisma migrate dev
   ```

5. **Deploy**:
   ```bash
   npx prisma migrate deploy
   ```

### Platform-Specific Notes

#### Vercel

```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

Environment variables: Add `DATABASE_URL` in Vercel dashboard.

#### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# Run migrations on container start
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

#### Railway / Render

Most platforms support running migrations as a release command:

```yaml
# railway.toml or render.yaml
build:
  command: npm install && npx prisma generate && npm run build
release:
  command: npx prisma migrate deploy
```

---

## Common Commands Reference

### Development Commands

| Command | Purpose |
|---------|---------|
| `npx prisma generate` | Regenerate Prisma Client from schema |
| `npx prisma migrate dev --name <name>` | Create and apply migration |
| `npx prisma migrate dev --create-only` | Create migration without applying |
| `npx prisma studio` | Open visual database browser |
| `npx prisma db push` | Push schema to DB without migration (prototyping) |
| `npx prisma db pull` | Pull schema from existing DB |

### Production Commands

| Command | Purpose |
|---------|---------|
| `npx prisma migrate deploy` | Apply pending migrations |
| `npx prisma migrate status` | Check migration status |
| `npx prisma migrate resolve --applied <name>` | Mark migration as applied |

### Debugging Commands

| Command | Purpose |
|---------|---------|
| `npx prisma validate` | Validate schema syntax |
| `npx prisma format` | Format schema file |
| `npx prisma db execute --file script.sql` | Run raw SQL |

---

## Troubleshooting

### "Module '@prisma/client' has no exported member 'PrismaClient'"

**Cause**: Prisma Client not generated, or wrong import path.

**Fix**:
```bash
npx prisma generate
```

Then ensure correct import:
```typescript
// For custom output location:
import { PrismaClient } from "@/app/generated/prisma/client";

// NOT:
import { PrismaClient } from "@prisma/client";  // ❌ Wrong for custom output
```

### "Expected 1 arguments, but got 0" on new PrismaClient()

**Cause**: Prisma 7.x requires an adapter.

**Fix**: Provide a driver adapter:
```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const adapter = new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL }));
const prisma = new PrismaClient({ adapter });
```

### "Migration failed to apply"

**Cause**: Database state conflicts with migration.

**Fix options**:
1. Resolve conflicts manually and mark as applied:
   ```bash
   npx prisma migrate resolve --applied <migration_name>
   ```

2. Reset database (⚠️ DELETES ALL DATA):
   ```bash
   npx prisma migrate reset
   ```

### "Prepared statement already exists" (connection pooling)

**Cause**: Using transaction poolers (PgBouncer, Neon) without proper config.

**Fix**: Use connection string with `?pgbouncer=true`:
```env
DATABASE_URL="postgresql://...?pgbouncer=true&connect_timeout=15"
```

### Types not updating after schema change

**Cause**: Prisma Client not regenerated.

**Fix**:
```bash
npx prisma generate
```

If using VS Code, restart TypeScript server: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

---

## Quick Reference Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT WORKFLOW                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Edit schema.prisma                                           │
│         ↓                                                         │
│  2. npx prisma migrate dev --name <name>                         │
│         ↓                                                         │
│     ┌─────────────────────────────────────┐                      │
│     │ Creates migration SQL               │                      │
│     │ Applies to dev database             │                      │
│     │ Regenerates Prisma Client           │                      │
│     └─────────────────────────────────────┘                      │
│         ↓                                                         │
│  3. Commit migration files to git                                │
│         ↓                                                         │
│  4. Push to production                                           │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                     PRODUCTION WORKFLOW                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Build: npx prisma generate                                   │
│         ↓                                                         │
│  2. Deploy: npx prisma migrate deploy                            │
│         ↓                                                         │
│     ┌─────────────────────────────────────┐                      │
│     │ Applies all pending migrations      │                      │
│     │ No new migrations created           │                      │
│     │ Safe for CI/CD                      │                      │
│     └─────────────────────────────────────┘                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma 7.x Migration Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [NextAuth + Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma)
- [Neon with Prisma](https://neon.tech/docs/guides/prisma)
