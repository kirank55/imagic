# AI Development Instructions for Next.js App in Turborepo

This file provides guidance for AI assistants to build new features or make improvements to the Next.js apps in this Turborepo.

## How to Request a New Feature

When requesting a new feature, provide the following context:

- Which app/package to modify (e.g., `apps/web`, `apps/docs`, or a package in `packages/`)
- A clear description of the feature or change
- Any relevant user stories, UI mockups, or acceptance criteria
- Dependencies or related files, if known

## Best Practices for AI Development

- Follow the existing project structure and conventions
- Use TypeScript and React best practices
- Reuse shared components from `packages/ui` when possible
- Update or create tests if applicable
- Document new features in the relevant `README.md` or here

## Example Feature Request

> Add a dark mode toggle to the navigation bar in `apps/web`.
>
> - The toggle should switch between light and dark themes.
> - Use a shared component if possible.
> - Update documentation if needed.

## Running and Testing Changes

- Use `pnpm install` to install dependencies
- Use `pnpm --filter <app> dev` to run the app in development mode
- Use `pnpm build` to build all apps and packages

## Additional Notes

- For shared logic or UI, prefer placing code in `packages/`
- Reference the Turborepo and Next.js documentation for advanced patterns

---

Update this file with new instructions as the project evolves.
