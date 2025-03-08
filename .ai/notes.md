# Project Intelligence Notes

This file captures important patterns, preferences, and project intelligence for the Domain Modeler project.

## Project Patterns

### Domain-Driven Design Implementation

- Each domain has its own directory under `app/domain/`
- Domain objects are defined as TypeScript types in `models.ts`
- Factory classes create domain objects with proper validation in `factories.ts`
- Repository classes handle data persistence in `repositories.ts`
- Services (to be implemented) will contain business logic in `services.ts`
- All business logic should be implemented as pure functions that don't mutate arguments

### Type Safety

- The project uses branded types for domain-specific string identifiers
- Example: `BrandedString<"EntityId">` ensures type safety for entity IDs
- These are defined in `app/utils/types.ts`

### Data Persistence

- The project uses `localforage` for client-side storage
- Each domain object type has its own storage instance
- Repositories abstract the storage implementation

### UI Component Structure

- UI components are organized in `app/components/`
- Atomic design pattern is used (atoms, layout, ui)
- shadcn/ui components are used with copy-paste approach (not installed via CLI)
- `cn` utility for shadcn components is in `app/utils/css.ts`

### Styling Approach

- Tailwind CSS is used ONLY for styling shapes and colors
- CSS Modules are used ONLY for defining layouts and placements
- This separation of concerns should be strictly maintained

### Routing

- React Router v7 (formerly Remix) is used for routing
- Route modules follow a specific pattern with loader/action functions
- Server-side code (loader/action) and client-side code are separated

## Workflow Preferences

### Development Process

1. Domain objects are created and updated by the operator
2. Implementation follows the plan → test → implement → validate cycle
3. Tests should be written before implementation
4. `pnpm run validate` must pass before reporting completion

### Testing Strategy

- Unit tests are written for all factories, repositories, and services
- Tests are located alongside the implementation files with `.test.ts` suffix
- Vitest is used as the testing framework

## Known Challenges

### LLM Integration

- The LLM domain needs to be implemented
- Need to determine the approach for integrating with LLMs
- Need to design the interface between the LLM and the domain model

### UI Implementation

- The UI for the domain modeling process needs to be designed and implemented
- The UI should follow the step-by-step flow described in the project brief
- Need to balance simplicity for domain experts with power for effective modeling

## Evolution of Project Decisions

- The project is in its initial development phase
- Core domain model for the modeling domain has been established
- Next major focus is implementing the LLM domain and user interface

## Tool Usage Patterns

- `pnpm` is used for package management
- `pnpm dev` starts the development server
- `pnpm test:unit` runs unit tests
- `pnpm validate` runs linting and type checking
- `pnpm build` builds the application for production
- `pnpm deploy` deploys to Cloudflare Workers
