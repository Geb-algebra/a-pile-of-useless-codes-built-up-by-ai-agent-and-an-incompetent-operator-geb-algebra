# Project Intelligence Notes

This file captures important patterns, preferences, and project intelligence for the Domain Modeler project.

## Project Patterns

### Domain-Driven Design Implementation

- Each domain has its own directory under `app/domain/`
- Domain objects are defined as TypeScript types in `models.ts`
- Factory classes create domain objects with proper validation in `factories.ts`
- Repository classes handle data persistence in `repositories.ts`
- Services contain business logic in `services.ts`
- All business logic is implemented as pure functions that don't mutate arguments

### Type Safety

- The project uses branded types for domain-specific string identifiers
- Example: `BrandedString<"EntityId">` ensures type safety for entity IDs
- These are defined in `app/utils/types.ts`

### Data Persistence

- The project uses `localforage` for client-side storage
- Each domain object type has its own storage instance
- Repositories abstract the storage implementation

### LLM Integration

- The project uses a client-side BYOK (Bring Your Own Key) strategy for LLM integration
- Users provide their own API keys for LLM providers
- The LLM domain abstracts the interaction with different LLM providers
- Anthropic is the primary provider, with placeholders for OpenAI, Google, and Mistral
- The LLM domain provides models, factories, repositories, and services for LLM integration
- The modeling services use the LLM domain to implement domain modeling functionality

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
- Tests for LLM services mock the fetch API to avoid actual API calls

## Known Challenges

### UI Implementation

- The UI for the domain modeling process needs to be designed and implemented
- The UI should follow the step-by-step flow described in the project brief
- Need to balance simplicity for domain experts with power for effective modeling

### LLM Provider Dependencies

- The application depends on external LLM providers
- Need to handle API rate limits, errors, and fallbacks
- Need to ensure consistent responses across different providers
- Need to handle the cost of API calls for users

### Export Functionality

- The export functionality needs to be refined
- Need to implement the diagram generation functionality
- Need to design a clear and useful format for the exported model

## Evolution of Project Decisions

- The project has progressed from the initial development phase to implementing the LLM domain
- The LLM domain has been implemented with a client-side BYOK strategy
- The modeling services have been updated to use the LLM domain
- The next focus is on developing the user interface for the domain modeling process

## Tool Usage Patterns

- `pnpm` is used for package management
- `pnpm dev` starts the development server
- `pnpm test:unit` runs unit tests
- `pnpm validate` runs linting and type checking
- `pnpm build` builds the application for production
- `pnpm deploy` deploys to Cloudflare Workers
