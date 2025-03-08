import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	AggregateFactory,
	CommandFactory,
	EntityFactory,
	EventFactory,
	UbiquitousLanguageFactory,
	UseCaseFactory,
	ValueObjectFactory,
} from "./factories";
import {
	AggregateRepository,
	CommandRepository,
	EntityRepository,
	EventRepository,
	UbiquitousLanguageRepository,
	UseCaseRepository,
	ValueObjectRepository,
} from "./repositories";

// // Mock localforage
// vi.mock("localforage", () => {
//   const stores = new Map<string, Map<string, any>>();

//   return {
//     default: {
//       createInstance: ({ name }: { name: string }) => {
//         if (!stores.has(name)) {
//           stores.set(name, new Map<string, any>());
//         }

//         const store = stores.get(name)!;

//         return {
//           setItem: vi.fn((key: string, value: any) => {
//             store.set(key, value);
//             return Promise.resolve(value);
//           }),
//           getItem: vi.fn((key: string) => {
//             return Promise.resolve(store.get(key) || null);
//           }),
//           removeItem: vi.fn((key: string) => {
//             store.delete(key);
//             return Promise.resolve();
//           }),
//           clear: vi.fn(() => {
//             store.clear();
//             return Promise.resolve();
//           }),
//           iterate: vi.fn((callback: (value: any, key: string) => void) => {
//             store.forEach((value, key) => {
//               callback(value, key);
//             });
//             return Promise.resolve();
//           }),
//         };
//       },
//     },
//   };
// });

// Clear all mocks between tests
beforeEach(() => {
	vi.clearAllMocks();
});

describe("EntityRepository", () => {
	beforeEach(async () => {
		await EntityRepository.clear();
	});

	it("should save and retrieve an entity", async () => {
		const entity = EntityFactory.create("User");
		await EntityRepository.save(entity);

		const retrieved = await EntityRepository.get(entity.id);
		expect(retrieved).toEqual(entity);
	});

	it("should list all entities", async () => {
		const entity1 = EntityFactory.create("User");
		const entity2 = EntityFactory.create("Product");

		await EntityRepository.save(entity1);
		await EntityRepository.save(entity2);

		const entities = await EntityRepository.list();
		expect(entities).toHaveLength(2);
		expect(entities).toEqual(expect.arrayContaining([entity1, entity2]));
	});

	it("should delete an entity", async () => {
		const entity = EntityFactory.create("User");
		await EntityRepository.save(entity);

		await EntityRepository.delete(entity.id);
		const retrieved = await EntityRepository.get(entity.id);

		expect(retrieved).toBeNull();
	});

	it("should clear all entities", async () => {
		const entity1 = EntityFactory.create("User");
		const entity2 = EntityFactory.create("Product");

		await EntityRepository.save(entity1);
		await EntityRepository.save(entity2);

		await EntityRepository.clear();
		const entities = await EntityRepository.list();

		expect(entities).toHaveLength(0);
	});
});

describe("ValueObjectRepository", () => {
	beforeEach(async () => {
		await ValueObjectRepository.clear();
	});

	it("should save and retrieve a value object", async () => {
		const valueObject = ValueObjectFactory.create("Email", "test@example.com");
		await ValueObjectRepository.save(valueObject);

		const retrieved = await ValueObjectRepository.get(valueObject.name);
		expect(retrieved).toEqual(valueObject);
	});

	it("should list all value objects", async () => {
		const valueObject1 = ValueObjectFactory.create("Email", "test@example.com");
		const valueObject2 = ValueObjectFactory.create("Name", "John Doe");

		await ValueObjectRepository.save(valueObject1);
		await ValueObjectRepository.save(valueObject2);

		const valueObjects = await ValueObjectRepository.list();
		expect(valueObjects).toHaveLength(2);
		expect(valueObjects).toEqual(expect.arrayContaining([valueObject1, valueObject2]));
	});

	it("should delete a value object", async () => {
		const valueObject = ValueObjectFactory.create("Email", "test@example.com");
		await ValueObjectRepository.save(valueObject);

		await ValueObjectRepository.delete(valueObject.name);
		const retrieved = await ValueObjectRepository.get(valueObject.name);
	});

	it("should clear all value objects", async () => {
		const valueObject1 = ValueObjectFactory.create("Email", "test@example.com");
		const valueObject2 = ValueObjectFactory.create("Name", "John Doe");

		await ValueObjectRepository.save(valueObject1);
		await ValueObjectRepository.save(valueObject2);

		await ValueObjectRepository.clear();
		const valueObjects = await ValueObjectRepository.list();

		expect(valueObjects).toHaveLength(0);
	});
});

describe("AggregateRepository", () => {
	beforeEach(async () => {
		await AggregateRepository.clear();
	});

	it("should save and retrieve an aggregate", async () => {
		const rootEntity = EntityFactory.create("User");
		const aggregate = AggregateFactory.create("UserAggregate", rootEntity);

		await AggregateRepository.save(aggregate);
		const retrieved = await AggregateRepository.get(aggregate.name);

		expect(retrieved).toEqual(aggregate);
	});

	it("should list all aggregates", async () => {
		const aggregate1 = AggregateFactory.create("UserAggregate", EntityFactory.create("User"));
		const aggregate2 = AggregateFactory.create("ProductAggregate", EntityFactory.create("Product"));

		await AggregateRepository.save(aggregate1);
		await AggregateRepository.save(aggregate2);

		const aggregates = await AggregateRepository.list();
		expect(aggregates).toHaveLength(2);
		expect(aggregates).toEqual(expect.arrayContaining([aggregate1, aggregate2]));
	});

	it("should delete an aggregate", async () => {
		const aggregate = AggregateFactory.create("UserAggregate", EntityFactory.create("User"));
		await AggregateRepository.save(aggregate);

		await AggregateRepository.delete(aggregate.name);
		const retrieved = await AggregateRepository.get(aggregate.name);

		expect(retrieved).toBeNull();
	});

	it("should clear all aggregates", async () => {
		const aggregate1 = AggregateFactory.create("UserAggregate", EntityFactory.create("User"));
		const aggregate2 = AggregateFactory.create("ProductAggregate", EntityFactory.create("Product"));

		await AggregateRepository.save(aggregate1);
		await AggregateRepository.save(aggregate2);

		await AggregateRepository.clear();
		const aggregates = await AggregateRepository.list();

		expect(aggregates).toHaveLength(0);
	});
});

describe("EventRepository", () => {
	beforeEach(async () => {
		await EventRepository.clear();
	});

	it("should save and retrieve an event", async () => {
		const event = EventFactory.create("UserCreated", "A user was created");
		await EventRepository.save(event);

		const retrieved = await EventRepository.get(event.name);
		expect(retrieved).toEqual(event);
	});
});

describe("CommandRepository", () => {
	beforeEach(async () => {
		await CommandRepository.clear();
	});

	it("should save and retrieve a command", async () => {
		const event = EventFactory.create("UserCreated");
		const command = CommandFactory.create("CreateUser", "Creates a new user", event);

		await CommandRepository.save(command);
		const retrieved = await CommandRepository.get(command.name);

		expect(retrieved).toEqual(command);
	});

	it("should list all commands", async () => {
		const event = EventFactory.create("UserCreated");
		const command1 = CommandFactory.create("CreateUser", "Creates a new user", event);
		const command2 = CommandFactory.create("UpdateUser", "Updates a user's information", event);

		await CommandRepository.save(command1);
		await CommandRepository.save(command2);

		const commands = await CommandRepository.list();
		expect(commands).toHaveLength(2);
		expect(commands).toEqual(expect.arrayContaining([command1, command2]));
	});

	it("should clear all commands", async () => {
		const command1 = CommandFactory.create(
			"CreateUser",
			"Creates a new user",
			EventFactory.create("UserCreated"),
		);
		const command2 = CommandFactory.create(
			"UpdateUser",
			"Updates a user's information",
			EventFactory.create("UserUpdated"),
		);

		await CommandRepository.save(command1);
		await CommandRepository.save(command2);

		await CommandRepository.clear();
		const commands = await CommandRepository.list();

		expect(commands).toHaveLength(0);
	});
});

describe("UbiquitousLanguageRepository", () => {
	beforeEach(async () => {
		await UbiquitousLanguageRepository.clear();
	});

	it("should save and retrieve a term with its definition", async () => {
		const term = UbiquitousLanguageFactory.create("Aggregate");
		const definition = "A cluster of domain objects that can be treated as a single unit";

		await UbiquitousLanguageRepository.save(term, definition);
		const retrieved = await UbiquitousLanguageRepository.get(term);

		expect(retrieved).toBe(definition);
	});

	it("should list all terms with their definitions", async () => {
		const term1 = UbiquitousLanguageFactory.create("Aggregate");
		const definition1 = "A cluster of domain objects that can be treated as a single unit";

		const term2 = UbiquitousLanguageFactory.create("Entity");
		const definition2 = "An object defined by its identity rather than its attributes";

		await UbiquitousLanguageRepository.save(term1, definition1);
		await UbiquitousLanguageRepository.save(term2, definition2);

		const terms = await UbiquitousLanguageRepository.list();

		expect(terms).toHaveLength(2);
		expect(terms).toContain(term1);
		expect(terms).toContain(term2);
	});

	it("should delete a term", async () => {
		const term = UbiquitousLanguageFactory.create("Aggregate");
		await UbiquitousLanguageRepository.save(
			term,
			"A cluster of domain objects that can be treated as a single unit",
		);

		await UbiquitousLanguageRepository.delete(term);
		const retrieved = await UbiquitousLanguageRepository.get(term);

		expect(retrieved).toBeNull();
	});

	it("should clear all terms", async () => {
		const term1 = UbiquitousLanguageFactory.create("Aggregate");
		const term2 = UbiquitousLanguageFactory.create("Entity");

		await UbiquitousLanguageRepository.save(
			term1,
			"A cluster of domain objects that can be treated as a single unit",
		);
		await UbiquitousLanguageRepository.save(
			term2,
			"An object defined by its identity rather than its attributes",
		);

		await UbiquitousLanguageRepository.clear();
		const terms = await UbiquitousLanguageRepository.list();

		expect(terms).toHaveLength(0);
	});
});

describe("UseCaseRepository", () => {
	beforeEach(async () => {
		await UseCaseRepository.clear();
	});

	it("should save and retrieve a use case with its description", async () => {
		const useCase = UseCaseFactory.create("Register User");
		const description = "A new user registers in the system";

		await UseCaseRepository.save(useCase, description);
		const retrieved = await UseCaseRepository.get(useCase);

		expect(retrieved).toBe(description);
	});

	it("should list all use cases as branded strings", async () => {
		const useCase1 = UseCaseFactory.create("Register User");
		const description1 = "A new user registers in the system";

		const useCase2 = UseCaseFactory.create("Login User");
		const description2 = "A user logs in to the system";

		await UseCaseRepository.save(useCase1, description1);
		await UseCaseRepository.save(useCase2, description2);

		const useCases = await UseCaseRepository.list();
		expect(useCases).toHaveLength(2);
		expect(useCases).toContain(useCase1);
		expect(useCases).toContain(useCase2);
	});

	it("should clear all use cases", async () => {
		const useCase1 = UseCaseFactory.create("Register User");
		const useCase2 = UseCaseFactory.create("Login User");

		await UseCaseRepository.save(useCase1, "A new user registers in the system");
		await UseCaseRepository.save(useCase2, "A user logs in to the system");

		await UseCaseRepository.clear();
		const useCases = await UseCaseRepository.list();

		expect(useCases).toHaveLength(0);
	});
});
