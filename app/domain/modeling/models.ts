import type { BrandedString } from "~/utils/types";

export type UbiquitousLanguage = {
  name: BrandedString<"UbiquitousLanguageName">;
  description: string;
};

export type UseCase = BrandedString<"UseCase">

export type Entity = {
  id: BrandedString<"EntityId">;
  name: BrandedString<"EntityName">;
  properties: Record<string, ValueObject>;
};

export type ValueObject = {
  name: BrandedString<"ValueObjectName">;
  value: string | null;
};

export type Aggregate = {
  name: BrandedString<"AggregateName">;
  root: Entity;
  entities: Entity[];
  valueObjects: ValueObject[];
};

export type Event = {
  name: BrandedString<"EventName">;
  description: string;
  relatedEntities: Entity[];
  relatedValueObjects: ValueObject[];
};

export type Command = {
  name: BrandedString<"CommandName">;
  description: string;
  triggeredEvent: Event;
};

