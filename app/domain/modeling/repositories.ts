import localforage from "localforage";
import type { BrandedString } from "~/utils/types";
import type {
	Aggregate,
	Command,
	Entity,
	Event,
	UbiquitousLanguage,
	UseCase,
	ValueObject,
} from "./models";

// Initialize separate storages for each domain model
const entityStore = localforage.createInstance({ name: "entities" });
const valueObjectStore = localforage.createInstance({ name: "valueObjects" });
const aggregateStore = localforage.createInstance({ name: "aggregates" });
const eventStore = localforage.createInstance({ name: "events" });
const commandStore = localforage.createInstance({ name: "commands" });
const ubiquitousLanguageStore = localforage.createInstance({ name: "ubiquitousLanguage" });
const useCaseStore = localforage.createInstance({ name: "useCases" });

export class EntityRepository {
	static async save(entity: Entity): Promise<void> {
		await entityStore.setItem(entity.id, entity);
	}

	static async get(id: BrandedString<"EntityId">): Promise<Entity | null> {
		return entityStore.getItem(id);
	}

	static async list(): Promise<Entity[]> {
		const entities: Entity[] = [];
		await entityStore.iterate((value: Entity) => {
			entities.push(value);
		});
		return entities;
	}

	static async delete(id: BrandedString<"EntityId">): Promise<void> {
		await entityStore.removeItem(id);
	}

	static async clear(): Promise<void> {
		await entityStore.clear();
	}
}

export class ValueObjectRepository {
	// Value objects are stored with their name as key
	static async save(valueObject: ValueObject): Promise<void> {
		await valueObjectStore.setItem(valueObject.name, valueObject);
	}

	static async get(name: BrandedString<"ValueObjectName">): Promise<ValueObject | null> {
		return valueObjectStore.getItem(name);
	}

	static async list(): Promise<ValueObject[]> {
		const valueObjects: ValueObject[] = [];
		await valueObjectStore.iterate((value: ValueObject) => {
			valueObjects.push(value);
		});
		return valueObjects;
	}

	static async delete(name: BrandedString<"ValueObjectName">): Promise<void> {
		await valueObjectStore.removeItem(name);
	}

	static async clear(): Promise<void> {
		await valueObjectStore.clear();
	}
}

export class AggregateRepository {
	static async save(aggregate: Aggregate): Promise<void> {
		await aggregateStore.setItem(aggregate.name, aggregate);
	}

	static async get(name: BrandedString<"AggregateName">): Promise<Aggregate | null> {
		return aggregateStore.getItem(name);
	}

	static async list(): Promise<Aggregate[]> {
		const aggregates: Aggregate[] = [];
		await aggregateStore.iterate((value: Aggregate) => {
			aggregates.push(value);
		});
		return aggregates;
	}

	static async delete(name: BrandedString<"AggregateName">): Promise<void> {
		await aggregateStore.removeItem(name);
	}

	static async clear(): Promise<void> {
		await aggregateStore.clear();
	}
}

export class EventRepository {
	static async save(event: Event): Promise<void> {
		await eventStore.setItem(event.name, event);
	}

	static async get(name: BrandedString<"EventName">): Promise<Event | null> {
		return eventStore.getItem(name);
	}

	static async list(): Promise<Event[]> {
		const events: Event[] = [];
		await eventStore.iterate((value: Event) => {
			events.push(value);
		});
		return events;
	}

	static async delete(name: BrandedString<"EventName">): Promise<void> {
		await eventStore.removeItem(name);
	}

	static async clear(): Promise<void> {
		await eventStore.clear();
	}
}

export class CommandRepository {
	static async save(command: Command): Promise<void> {
		await commandStore.setItem(command.name, command);
	}

	static async get(name: BrandedString<"CommandName">): Promise<Command | null> {
		return commandStore.getItem(name);
	}

	static async list(): Promise<Command[]> {
		const commands: Command[] = [];
		await commandStore.iterate((value: Command) => {
			commands.push(value);
		});
		return commands;
	}

	static async delete(name: BrandedString<"CommandName">): Promise<void> {
		await commandStore.removeItem(name);
	}

	static async clear(): Promise<void> {
		await commandStore.clear();
	}
}

export class UbiquitousLanguageRepository {
	static async save(term: UbiquitousLanguage, definition: string): Promise<void> {
		await ubiquitousLanguageStore.setItem(String(term), definition);
	}

	static async get(term: UbiquitousLanguage): Promise<string | null> {
		return ubiquitousLanguageStore.getItem(String(term));
	}

	static async list(): Promise<UbiquitousLanguage[]> {
		const terms: UbiquitousLanguage[] = [];
		await ubiquitousLanguageStore.iterate((value: string, key: string) => {
			terms.push(key as unknown as UbiquitousLanguage);
		});
		return terms;
	}

	static async delete(term: UbiquitousLanguage): Promise<void> {
		await ubiquitousLanguageStore.removeItem(String(term));
	}

	static async clear(): Promise<void> {
		await ubiquitousLanguageStore.clear();
	}
}

export class UseCaseRepository {
	static async save(useCase: UseCase, description: string): Promise<void> {
		await useCaseStore.setItem(String(useCase), description);
	}

	static async get(useCase: UseCase): Promise<string | null> {
		return useCaseStore.getItem(String(useCase));
	}

	static async list(): Promise<UseCase[]> {
		const useCases: UseCase[] = [];
		await useCaseStore.iterate((value: string, key: string) => {
			useCases.push(key as unknown as UseCase);
		});
		return useCases;
	}

	static async delete(useCase: UseCase): Promise<void> {
		await useCaseStore.removeItem(String(useCase));
	}

	static async clear(): Promise<void> {
		await useCaseStore.clear();
	}
}
