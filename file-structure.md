# Next.js SaaS App with Turborepo File Structure

This document outlines the file structure for a Next.js SaaS application using Turborepo.

## Root Level

- `apps/`: Contains your applications (the main web app and the image API).
- `packages/`: Contains shared code, like UI components or configuration.
- `package.json`: Manages dependencies for the entire monorepo.
- `turbo.json`: The configuration file for Turborepo.

## Applications (`apps`)

### `web` (Next.js Frontend)

- `app/`: The main application directory for your Next.js app.
  - `(auth)`: Route group for authentication-related pages.
    - `login/page.tsx`: The login page.
  - `(dashboard)`: Route group for pages behind authentication.
    - `profile/page.tsx`: The user profile page.
    - `upload/page.tsx`: The page for uploading images.
    - `images/`:
      - `page.tsx`: The "My Images" page, displaying a gallery of user images.
      - `[imageId]/page.tsx`: The page for viewing a single image and its details.
  - `api/`: For your Next.js API routes.
    - `auth/`: Handles authentication, e.g., with NextAuth.js.
  - `components/`: React components for the web app.
    - `ui/`: General UI components (e.g., buttons, inputs).
    - `auth/`: Components specific to authentication (e.g., login form).
    - `dashboard/`: Components for the authenticated parts of the app.
  - `lib/`: Helper functions and utilities.
    - `auth.ts`: Authentication-related helpers.
    - `db.ts`: Database connection and query logic.
  - `public/`: Static assets like images and fonts.

### `image-api` (Image Optimization API)

- `src/`: The source code for your image processing API.
  - `index.ts`: The main entry point for the API server.
  - `auth.ts`: Handles authentication and authorization for the API.
  - `optimize.ts`: The core logic for image compression, conversion, and resizing.

## Shared Packages (`packages`)

### `ui`

- `src/`: Reusable React components shared across your applications.
  - `button.tsx`: A shared button component.
  - `card.tsx`: A shared card component.

### `config`

- `eslint-preset.js`: Shared ESLint configuration.
- `tsconfig/`: Shared TypeScript configurations (`base.json`, `nextjs.json`, etc.).
