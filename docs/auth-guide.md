# Authentication Guide

This guide covers the NextAuth.js setup for Google OAuth authentication in this project.

---

## Overview

The app uses **NextAuth.js v4** with:
- **Google OAuth** as the authentication provider
- **Prisma Adapter** for storing users, accounts, and sessions in PostgreSQL
- **Database-backed sessions** (not JWT)

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Login Page    │────▶│  Google OAuth    │────▶│    Database     │
│  /login         │     │  (NextAuth)      │     │  (Prisma)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  Session Created │
                        │  (user.id added) │
                        └──────────────────┘
```

---

## File Structure

| File | Purpose |
|------|---------|
| `lib/auth.ts` | NextAuth configuration (providers, callbacks, adapter) |
| `app/api/auth/[...nextauth]/route.ts` | API route handler for auth endpoints |
| `components/SessionProvider.tsx` | Client wrapper for session context |
| `app/layout.tsx` | Wraps app with SessionProvider |
| `app/login/page.tsx` | Login UI with Google button |
| `types/next-auth.d.ts` | TypeScript augmentation for session.user.id |

---

## Setup Requirements

### 1. Environment Variables

Add to `.env`:

```env
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Secret to your `.env`

---

## How It Works

### Session Callback

The session callback in `lib/auth.ts` adds the database user ID to the session:

```typescript
callbacks: {
    session: async ({ session, user }) => {
        if (session.user) {
            session.user.id = user.id;  // Add database ID
        }
        return session;
    },
},
```

This allows you to access `session.user.id` anywhere in your app.

### Type Safety

`types/next-auth.d.ts` extends the default session type:

```typescript
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
```

---

## Usage

### Client Components

```tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>Signed in as {session.user.email}</p>
                <p>User ID: {session.user.id}</p>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        );
    }
    return <button onClick={() => signIn("google")}>Sign in</button>;
}
```

### Server Components / API Routes

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Access session.user.id, session.user.email, etc.
    return Response.json({ userId: session.user.id });
}
```

### Protecting Pages

```tsx
// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return <div>Welcome, {session.user.name}</div>;
}
```

---

## Database Models

The Prisma schema includes these NextAuth models:

| Model | Purpose |
|-------|---------|
| `User` | Core user record (email, name, image) |
| `Account` | OAuth provider connections (tokens, provider IDs) |
| `Session` | Active login sessions |
| `VerificationToken` | Email verification tokens |

See `prisma/schema.prisma` for full definitions.

---

## Troubleshooting

### "NEXTAUTH_SECRET" is required

Add `NEXTAUTH_SECRET` to your `.env` file.

### OAuth callback error

Ensure your Google OAuth redirect URI matches exactly:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### Session is null

1. Check that `SessionProvider` wraps your app in `layout.tsx`
2. Verify the user exists in the database
3. Check browser cookies are enabled

### TypeScript: Property 'id' does not exist on session.user

Ensure `types/next-auth.d.ts` exists and is included in your `tsconfig.json`:

```json
{
  "include": ["**/*.ts", "**/*.tsx", "types/**/*.d.ts"]
}
```

---

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://next-auth.js.org/providers/google)
- [Prisma Adapter](https://authjs.dev/getting-started/adapters/prisma)
