# Release Planner Portal

React + TypeScript + Vite + Tailwind CSS + MUI + Redux Toolkit + TanStack Query.

## 📚 Documentation

Para documentación completa del proyecto, incluyendo refactorización, builder patterns y arquitectura, consulta:

→ **[docs/README.md](./docs/README.md)** - Índice central de documentación

### Documentación Rápida

- 🚀 **[Inicio Rápido](./docs/REFACTORING_SUMMARY.md)** - Resumen de cambios recientes
- 🏗️ **[Arquitectura Builder](./docs/BUILDER_ARCHITECTURE.md)** - Diseño y patrones
- ❓ **[FAQs](./docs/BUILDERS_FAQ.md)** - Preguntas frecuentes

### Código

- 📁 **[Builders](./src/builders/)** - Implementación de builder patterns
- 📦 **[Constants](./src/constants/)** - Constantes centralizadas
- 🎯 **[Features](./src/features/)** - Feature modules

---

## Getting started

```bash
cd portal
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Tech stack

- **React (Vite + TS)**: fast dev/build
- **Tailwind CSS**: utility-first styling; Excel-inspired palette
- **MUI (Material Design)**: accessible, robust components
- **Redux Toolkit**: predictable app state
- **TanStack Query**: server state, caching, smart refetching
- **React Router**: routing and layouts

## Structure

```
src/
  api/            # Query client, API modules
  layouts/        # App layouts (MainLayout)
  pages/          # Route pages (Home)
  store/          # Redux store and typed hooks
  assets/         # Static assets
  theme.ts        # MUI theme (Excel palette)
  main.tsx        # Providers (Redux, Query, Router, Theme)
  App.tsx         # Routes
  index.css       # Tailwind entry
```

## Layout template

The `MainLayout` implements:

- Header (MUI AppBar) with toggles
- Left sidebar (navigation): permanent on desktop, drawer on mobile
- Right sidebar (context): permanent on large screens, drawer otherwise
- Footer
- Content container (responsive)

Sidebars are controlled via Redux (`ui` slice), ensuring consistent behavior across pages.

## Styling

Tailwind configured with an Excel-like primary palette (`primary` 50–900, main `#217346`). Use Tailwind utilities for layout and spacing, and MUI components for interactions and accessibility.

Examples:

- Containers: `className="py-6"`
- Text colors: `text-primary-700`
- Hover states: `hover:text-primary-600`

## Best practices

- Keep server state in TanStack Query; use Redux for UI/app settings
- Co-locate components with pages when only used there; otherwise place in `components/`
- Use feature folders for larger domains (e.g., `features/releases/`)
- Reuse the `MainLayout` for all routes; render content via React Router `<Outlet />`
- Prefer MUI components for form controls and accessibility
