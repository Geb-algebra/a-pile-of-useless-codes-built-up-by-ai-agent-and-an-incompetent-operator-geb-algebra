import type { BrandedString } from "~/utils/types";
import type {
  Aggregate,
  Command,
  Entity,
  Event,
  UbiquitousLanguage,
  UseCase,
  ValueObject
} from "./models";

export class EntityFactory {
  static create(
    name: string,
    properties: Record<string, ValueObject> = {}
  ): Entity {
    return {
      id: crypto.randomUUID() as BrandedString<"EntityId">,
      name: name as BrandedString<"EntityName">,
      properties,
    };
  }
}

export class ValueObjectFactory {
  static create(
    name: string,
    value: string | null = null
  ): ValueObject {
    return {
      name: name as BrandedString<"ValueObjectName">,
      value,
    };
  }
}

export class AggregateFactory {
  static create(
    name: string,
    root: Entity,
    entities: Entity[] = [],
    valueObjects: ValueObject[] = []
  ): Aggregate {
    return {
      name: name as BrandedString<"AggregateName">,
      root,
      entities,
      valueObjects,
    };
  }
}

export class EventFactory {
  static create(
    name: string,
    description: string = "",
    relatedEntities: Entity[] = [],
    relatedValueObjects: ValueObject[] = []
  ): Event {
    return {
      name: name as BrandedString<"EventName">,
      description,
      relatedEntities,
      relatedValueObjects,
    };
  }
}

export class CommandFactory {
  static create(
    name: string,
    description: string = "",
    triggeredEvent: Event
  ): Command {
    return {
      name: name as BrandedString<"CommandName">,
      description,
      triggeredEvent,
    };
  }
}

export class UbiquitousLanguageFactory {
  static create(term: string): UbiquitousLanguage {
    return term as unknown as UbiquitousLanguage;
  }
}

export class UseCaseFactory {
  static create(name: string): UseCase {
    return name as unknown as UseCase;
  }
} 