# Release Planner Web - Portal# Release Planner Portal

Modern web application for release planning, product management, feature tracking, and calendar management.React + TypeScript + Vite + Tailwind CSS + MUI + Redux Toolkit + TanStack Query.

## 🚀 Getting Started## 📚 Documentation

```bashPara documentación completa del proyecto, incluyendo refactorización, builder patterns y arquitectura, consulta:

npm install

npm run dev→ **[docs/README.md](./docs/README.md)** - Índice central de documentación

```

### Documentación Rápida

Open [http://localhost:5173](http://localhost:5173) in your browser.

- 🚀 **[Inicio Rápido](./docs/REFACTORING_SUMMARY.md)** - Resumen de cambios recientes

## 📁 Project Structure- 🏗️ **[Arquitectura Builder](./docs/BUILDER_ARCHITECTURE.md)** - Diseño y patrones

- ❓ **[FAQs](./docs/BUILDERS_FAQ.md)** - Preguntas frecuentes

````

portal/### Código

├── src/

│   ├── pages/              # Page components- 📁 **[Builders](./src/builders/)** - Implementación de builder patterns

│   ├── components/         # UI components- 📦 **[Constants](./src/constants/)** - Constantes centralizadas

│   ├── features/           # Feature modules- 🎯 **[Features](./src/features/)** - Feature modules

│   │   ├── product/        # Products management

│   │   ├── feature/        # Features management---

│   │   ├── calendar/       # Calendars management

│   │   └── releasePlans/   # Release plans## Getting started

│   ├── layouts/            # Layout components

│   ├── store/              # Redux store```bash

│   ├── utils/              # Utilitiescd portal

│   ├── api/                # API configurationnpm install

│   └── App.tsx             # Main app componentnpm run dev

├── public/                 # Static assets```

├── docs/                   # Documentation

│   ├── CALENDAR_FEATURE_SUMMARY.mdBuild for production:

│   ├── CALENDAR_TOOLBAR_ENHANCEMENT.md

│   ├── DESIGN_AUDIT_REPORT.md```bash

│   └── ... more docsnpm run build

├── package.jsonnpm run preview

├── tsconfig.json```

├── vite.config.ts

└── tailwind.config.js## Tech stack

````

- **React (Vite + TS)**: fast dev/build

## 📚 Documentation- **Tailwind CSS**: utility-first styling; Excel-inspired palette

- **MUI (Material Design)**: accessible, robust components

All documentation is located in the `docs/` folder:- **Redux Toolkit**: predictable app state

- **TanStack Query**: server state, caching, smart refetching

- **[CALENDAR_FEATURE_SUMMARY.md](docs/CALENDAR_FEATURE_SUMMARY.md)** - Calendar management implementation- **React Router**: routing and layouts

- **[CALENDAR_TOOLBAR_ENHANCEMENT.md](docs/CALENDAR_TOOLBAR_ENHANCEMENT.md)** - Interactive toolbar features

- **[DESIGN_AUDIT_REPORT.md](docs/DESIGN_AUDIT_REPORT.md)** - Complete design audit and compliance## Structure

- **[DESIGN_STANDARDS.md](docs/DESIGN_STANDARDS.md)** - Design and UX standards

- **[UX_STANDARDS_REPORT.md](docs/UX_STANDARDS_REPORT.md)** - UX implementation details```

src/

## 🎯 Features api/ # Query client, API modules

layouts/ # App layouts (MainLayout)

### 📊 Release Planner pages/ # Route pages (Home)

- Create and manage release plans store/ # Redux store and typed hooks

- Gantt chart visualization assets/ # Static assets

- Drag-and-drop timeline management theme.ts # MUI theme (Excel palette)

  main.tsx # Providers (Redux, Query, Router, Theme)

### 🏢 Product Management App.tsx # Routes

- Add/Edit/Delete products index.css # Tailwind entry

- Manage product components```

- Version tracking

## Layout template

### ✨ Feature Management

- Track features across productsThe `MainLayout` implements:

- Feature categorization

- Status management- Header (MUI AppBar) with toggles

- Left sidebar (navigation): permanent on desktop, drawer on mobile

### 📅 Calendar Management- Right sidebar (context): permanent on large screens, drawer otherwise

- Manage holidays and special days- Footer

- Multiple calendar support- Content container (responsive)

- Filter and sort capabilities

Sidebars are controlled via Redux (`ui` slice), ensuring consistent behavior across pages.

## 🎨 Design

## Styling

- **Material UI** - 100% Material UI components

- **Minimalist Design** - Clean, simple interfaceTailwind configured with an Excel-like primary palette (`primary` 50–900, main `#217346`). Use Tailwind utilities for layout and spacing, and MUI components for interactions and accessibility.

- **Responsive Layout** - Works on all devices

- **Theme System** - Full theming supportExamples:

## 🛠️ Technology Stack- Containers: `className="py-6"`

- Text colors: `text-primary-700`

- **React 19** - UI framework- Hover states: `hover:text-primary-600`

- **TypeScript 5.9** - Type safety

- **Vite 5** - Build tool## Best practices

- **Material UI 7** - Component library

- **Redux Toolkit** - State management- Keep server state in TanStack Query; use Redux for UI/app settings

- **React Query** - Data fetching- Co-locate components with pages when only used there; otherwise place in `components/`

- **React Router** - Routing- Use feature folders for larger domains (e.g., `features/releases/`)

- Reuse the `MainLayout` for all routes; render content via React Router `<Outlet />`

## 📱 Navigation- Prefer MUI components for form controls and accessibility

- **Release Planner** - Main planning view
- **Products** - Product management
- **Features** - Feature tracking
- **Calendars** - Holiday/special days management

## 🚀 Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Tests
npm run test
npm run test:coverage

# Linting
npm run lint
```

## 📦 Key Modules

### Features Architecture

Each feature module follows this structure:

```
feature/
├── types.ts           # TypeScript interfaces
├── constants.ts       # Constants & mock data
├── components/        # UI components
│   ├── Component.tsx
│   └── index.ts       # Barrel export
├── hooks/             # Custom hooks
│   └── useFeature.ts
├── utils/             # Utility functions
│   └── featureUtils.ts
└── index.ts           # Feature export
```

### State Management

- Redux for global UI state (sidebar, theme)
- Custom React hooks for feature-specific state
- React Query for server state (future)

## 🎓 Development Guidelines

1. **Components** - Functional components with hooks
2. **Styling** - Material UI `sx` prop for styling
3. **Types** - Full TypeScript coverage
4. **Testing** - Unit and integration tests
5. **Accessibility** - WCAG 2.1 AA compliance

## 📝 Commit History

Latest commits:

- Move all .md documentation files to docs folder
- Add interactive toolbar with view, filter, and sort controls
- Add Calendar Management feature
- Refactor Features with component decomposition
- Design audit and compliance reports

## 🔗 Related Resources

- [Material UI Documentation](https://mui.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

Proprietary - Release Planner

## 👨‍💻 Development

**Status**: ✅ Production Ready

For detailed documentation, visit the `docs/` folder.

---

_Last Updated: November 10, 2025_
