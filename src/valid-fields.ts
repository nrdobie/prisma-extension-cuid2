import { type Prisma } from "@prisma/client";

/**
 * The generated location in Prisma that contains the models and fields.
 */
type TypeMapModels = Prisma.TypeMap["model"];

/**
 * Extracts the model names from the Prisma type map.
 */
type ModelNames = keyof TypeMapModels;

/**
 * Uses the Prisma type map to extract the field names for a given model.
 */
type FieldNames<T extends ModelNames> = T extends string ? keyof TypeMapModels[T]["fields"] : never;

/**
 * Convert a model into a string union of the field names.
 *
 * @example
 *   type UserFields = FieldStrings<"User">;
 *      // => "User:id" | "User:email" | "User:createdAt"
 */
type FieldStrings<TModelName extends ModelNames, TFieldNames extends string = FieldNames<TModelName>> = {
  [K in TFieldNames]: K extends string ? `${TModelName}:${K}` : never;
}[TFieldNames];

/**
 * Create a string union of all the field names for all the models.
 */
type FieldStringsForModels = {
  [K in ModelNames]: FieldStrings<K>;
}[ModelNames];

type FieldStringsOnAllModels = {
  [K in ModelNames]: FieldStrings<K, FieldNames<ModelNames>>;
}[ModelNames];

/**
 * Create a string union for all the models with a wildcard.
 */
type WildcardModels = {
  [K in ModelNames]: `${K}:*`;
}[ModelNames];

/**
 * Create a string union for all the fields with a wildcard.
 */
type WildcardFields<TModelName extends ModelNames, TFieldNames extends string = FieldNames<TModelName>> = {
  [K in TFieldNames]: K extends string ? `*:${K}` : never;
}[TFieldNames];

/**
 * Create a string union for all the fields with a wildcard for all the models.
 */
type WildcardFieldStringsForModels = {
  [K in ModelNames]: WildcardFields<K>;
}[ModelNames];

export type IncludeField = FieldStringsForModels | WildcardFieldStringsForModels;
export type ExcludeField = FieldStringsForModels | FieldStringsOnAllModels | WildcardModels;

export type Field = FieldStringsForModels;
