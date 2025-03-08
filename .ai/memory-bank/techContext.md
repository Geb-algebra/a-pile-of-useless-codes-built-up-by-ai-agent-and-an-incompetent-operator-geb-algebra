# Technical Context

## Technologies Used

### Core Technologies

1. **TypeScript**
   - Used throughout the application for type safety
   - Branded types for domain-specific string identifiers

2. **React (v19)**
   - Frontend UI library
   - Component-based architecture

3. **React Router (v7)**
   - Routing library
   - Formerly known as Remix
   - Provides loader/action pattern for data fetching and mutations

4. **Vite**
   - Build tool and development server
   - Fast HMR (Hot Module Replacement)

### UI and Styling

1. **Tailwind CSS (v4)**
   - Used for styling shapes and colors of HTML elements and texts
   - Not used for defining layouts and placements of elements

2. **CSS Modules**
   - Used for defining layouts and placements of elements
   - Not used for styling shapes and colors

3. **shadcn/ui**
   - UI component library
   - Used as copy-and-paste style, not installed via CLI
   - `cn` utility for shadcn components is in `app/utils/css.ts`

4. **class-variance-authority**
   - For creating variant components

5. **clsx & tailwind-merge**
   - Utilities for conditional class names

### Backend and Data

1. **Hono**
   - HTTP server framework
   - Used with hono-react-router-adapter

2. **localforage**
   - Client-side storage library
   - Used for persisting domain objects in browser storage

3. **Cloudflare Workers**
   - Serverless platform
   - Used for deployment (via Wrangler)

### Development Tools

1. **Biome**
   - Linter and formatter
   - Used for code quality and consistency

2. **Vitest**
   - Testing framework
   - Used for unit testing

3. **pnpm**
   - Package manager
   - Used for dependency management

## Development Setup

### Project Structure

```
domain-modeler/
├── app/
│   ├── components/
│   │   ├── atoms/
│   │   ├── layout/
│   │   └── ui/
│   ├── domain/
│   │   ├── llm/
│   │   └── modeling/
│   ├── routes/
│   └── utils/
├── public/
└── [configuration files]
```

### Key Configuration Files

1. **package.json**
   - Project dependencies and scripts

2. **tsconfig.json**
   - TypeScript configuration

3. **vite.config.ts**
   - Vite bundler configuration

4. **biome.json**
   - Biome linter and formatter configuration

5. **wrangler.toml**
   - Cloudflare Workers configuration

### Development Workflow

1. **Development Server**
   - Run with `pnpm dev`
   - Uses React Router's development server

2. **Building**
   - Run with `pnpm build`
   - Builds the application for production

3. **Testing**
   - Run with `pnpm test:unit`
   - Uses Vitest for unit testing

4. **Validation**
   - Run with `pnpm validate`
   - Runs linting and type checking

5. **Deployment**
   - Run with `pnpm deploy`
   - Deploys to Cloudflare Workers

## Technical Constraints

1. **Browser Compatibility**
   - Modern browsers only (no IE support)
   - Relies on modern JavaScript features

2. **Client-Side Storage**
   - Limited by browser storage quotas
   - Data persistence is local to the browser

3. **Performance Considerations**
   - LLM processing may have latency
   - Complex domain models may impact UI responsiveness

## Dependencies

### Production Dependencies

- `@radix-ui/react-slot`: Slot component for composition
- `@react-router/node`: Server-side rendering for React Router
- `@react-router/serve`: Static file server for React Router
- `class-variance-authority`: Variant component creation
- `clsx`: Conditional class names utility
- `hono`: HTTP server framework
- `hono-react-router-adapter`: Adapter for using Hono with React Router
- `isbot`: Bot detection
- `localforage`: Client-side storage
- `react` & `react-dom`: React library
- `react-router`: Routing library
- `tailwind-merge`: Tailwind class merging utility
- `tailwindcss-animate`: Animation utilities for Tailwind

### Development Dependencies

- `@biomejs/biome`: Linter and formatter
- `@hono/vite-dev-server`: Development server for Hono
- `@react-router/dev`: Development tools for React Router
- `@react-router/remix-routes-option-adapter`: Adapter for Remix routes
- `@tailwindcss/vite`: Tailwind plugin for Vite
- `@types/*`: TypeScript type definitions
- `@vitejs/plugin-react`: React plugin for Vite
- `@vitest/ui`: UI for Vitest
- `happy-dom`: DOM implementation for testing
- `miniflare`: Local development for Cloudflare Workers
- `react-router-devtools`: Development tools for React Router
- `remix-flat-routes`: Flat routing for Remix
- `tailwindcss`: CSS framework
- `typescript`: TypeScript compiler
- `vite`: Build tool
- `vite-tsconfig-paths`: TypeScript path resolution for Vite
- `vitest`: Testing framework
- `wrangler`: CLI for Cloudflare Workers
