import { describe, expect, it } from "vitest";
import {
  AggregateFactory,
  CommandFactory,
  EntityFactory,
  EventFactory,
  UbiquitousLanguageFactory,
  UseCaseFactory,
  ValueObjectFactory,
} from "./factories";

describe("EntityFactory", () => {
  it("should create an entity with the given name", () => {
    const entity = EntityFactory.create("User");
    expect(entity.name).toBe("User");
    expect(entity.id).toBeDefined();
    expect(entity.properties).toEqual({});
  });

  it("should create an entity with properties", () => {
    const nameProperty = ValueObjectFactory.create("name", "John Doe");
    const properties = { name: nameProperty };
    const entity = EntityFactory.create("User", properties);
    
    expect(entity.name).toBe("User");
    expect(entity.properties).toEqual(properties);
    expect(entity.properties.name.value).toBe("John Doe");
  });
});

describe("ValueObjectFactory", () => {
  it("should create a value object with the given name", () => {
    const valueObject = ValueObjectFactory.create("Email");
    expect(valueObject.name).toBe("Email");
    expect(valueObject.value).toBeNull();
  });

  it("should create a value object with a value", () => {
    const valueObject = ValueObjectFactory.create("Email", "test@example.com");
    expect(valueObject.name).toBe("Email");
    expect(valueObject.value).toBe("test@example.com");
  });
});

describe("AggregateFactory", () => {
  it("should create an aggregate with the given name and root entity", () => {
    const rootEntity = EntityFactory.create("User");
    const aggregate = AggregateFactory.create("UserAggregate", rootEntity);
    
    expect(aggregate.name).toBe("UserAggregate");
    expect(aggregate.root).toEqual(rootEntity);
    expect(aggregate.entities).toEqual([]);
    expect(aggregate.valueObjects).toEqual([]);
  });

  it("should create an aggregate with entities and value objects", () => {
    const rootEntity = EntityFactory.create("User");
    const addressEntity = EntityFactory.create("Address");
    const nameValue = ValueObjectFactory.create("Name", "John Doe");
    
    const aggregate = AggregateFactory.create(
      "UserAggregate", 
      rootEntity, 
      [addressEntity], 
      [nameValue]
    );
    
    expect(aggregate.name).toBe("UserAggregate");
    expect(aggregate.root).toEqual(rootEntity);
    expect(aggregate.entities).toEqual([addressEntity]);
    expect(aggregate.valueObjects).toEqual([nameValue]);
  });
});

describe("EventFactory", () => {
  it("should create an event with the given name", () => {
    const event = EventFactory.create("UserCreated");
    
    expect(event.name).toBe("UserCreated");
    expect(event.description).toBe("");
    expect(event.relatedEntities).toEqual([]);
    expect(event.relatedValueObjects).toEqual([]);
  });

  it("should create an event with related entities and value objects", () => {
    const userEntity = EntityFactory.create("User");
    const nameValue = ValueObjectFactory.create("Name", "John Doe");
    
    const event = EventFactory.create(
      "UserCreated", 
      "A new user was created", 
      [userEntity], 
      [nameValue]
    );
    
    expect(event.name).toBe("UserCreated");
    expect(event.description).toBe("A new user was created");
    expect(event.relatedEntities).toEqual([userEntity]);
    expect(event.relatedValueObjects).toEqual([nameValue]);
  });
});

describe("CommandFactory", () => {
  it("should create a command with the given name and triggered event", () => {
    const event = EventFactory.create("UserCreated");
    const command = CommandFactory.create("CreateUser", "Creates a new user", event);
    
    expect(command.name).toBe("CreateUser");
    expect(command.description).toBe("Creates a new user");
    expect(command.triggeredEvent).toEqual(event);
  });
});

describe("UbiquitousLanguageFactory", () => {
  it("should create a ubiquitous language term", () => {
    const term = UbiquitousLanguageFactory.create("Aggregate");
    expect(term).toBe("Aggregate");
  });
});

describe("UseCaseFactory", () => {
  it("should create a use case", () => {
    const useCase = UseCaseFactory.create("Register User");
    expect(useCase).toBe("Register User");
  });
}); 