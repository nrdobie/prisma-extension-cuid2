import { init } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import { produce } from "immer";

import getExactFieldsFactory from "./factories/get-exact-fields-factory";
import { type GetFieldsFunction } from "./factories/get-fields-function";
import getWildcardFieldsFactory from "./factories/get-wildcard-fields-factory";
import { type ExcludeField, type Field, type IncludeField } from "./valid-fields";
import { exactValidator, wildcardValidator } from "./validators";

const OPERATIONS = ["create", "createMany", "upsert"];

type Cuid2InitOptions = Parameters<typeof init>[0];

export type Cuid2ExtensionOptionsBase = {
  /**
   * This allows you to customize the CUID2 generation.
   *
   * A useful option is to set the `fingerprint` to a unique value for your application.
   *
   * @example
   *   const cuid2 = cuid2Extension({
   *     cuid2Options: {
   *       fingerprint: process.env.DEVICE_ID
   *     }
   *   })
   *
   * @see https://github.com/paralleldrive/cuid2?tab=readme-ov-file#configuration
   */
  cuid2Options?: Cuid2InitOptions;
};

type Cuid2ExtensionOptionsWildcard = {
  /**
   * The fields to automatically set the CUID2 value on.
   *
   * Provide the fields in the format of `ModelName:FieldName`. You can use `*` to match all models.
   *
   * @example ["User:userId", "Post:postId"]
   * @example ["*:id", "Post:secondId"]
   *
   * @default ["*:id"]
   */
  includeFields?: IncludeField[];

  /**
   * The fields to exclude from being automatically set the CUID2 value on.
   *
   * This is useful if you have a small number of fields that you want to exclude from being automatically set.
   * You can use `*` to exclude all fields on a model.
   *
   * Provide the fields in the format of `ModelName:FieldName`.
   *
   * @example ["User:id"]
   * @example ["Post:*"]
   */
  excludeFields?: ExcludeField[];
};

type Cuid2ExtensionOptionsExact = {
  /**
   * Requires the exact fields to include for the CUID2 extension.
   *
   * This is the recommended way to use the extension as it provides a clear understanding of which fields are being
   * affected and supports type safety.
   */
  fields: Field[];
};

export type Cuid2ExtensionOptions = Cuid2ExtensionOptionsBase &
  (Cuid2ExtensionOptionsWildcard | Cuid2ExtensionOptionsExact);

export default function cuid2Extension(options?: Cuid2ExtensionOptions) {
  if (options && "fields" in options && ("includeFields" in options || "excludeFields" in options)) {
    throw new Error("You cannot provide both `fields` and `includeFields`/`excludeFields` options.");
  }

  let getFields: GetFieldsFunction;
  if (options === undefined) {
    getFields = getWildcardFieldsFactory(["*:id"]);
  } else if ("fields" in options) {
    const validatedOptions = exactValidator.parse(options);
    getFields = getExactFieldsFactory(validatedOptions.fields);
  } else {
    const validatedOptions = wildcardValidator.parse(options);
    getFields = getWildcardFieldsFactory(validatedOptions.includeFields, validatedOptions.excludeFields);
  }

  const createId = init(options?.cuid2Options);

  return Prisma.defineExtension({
    name: "cuid2",

    query: {
      $allModels: {
        $allOperations({ model, operation, query, args }) {
          if (!OPERATIONS.includes(operation)) {
            return query(args);
          }

          // Get the fields to apply the CUID2 extension
          const fields = getFields(model);

          const argsWithNewId = produce(args, (draft) => {
            // @ts-expect-error `create` is the correct field for upsert
            const data = operation === "upsert" ? draft.create : draft.data;

            fields.forEach((field) => {
              /* v8 ignore next 6 - Create Many not supported by SQLite*/
              if (Array.isArray(data)) {
                data.forEach((item) => {
                  if (!item[field]) {
                    item[field] = createId();
                  }
                });
              } else {
                if (!data[field]) {
                  data[field] = createId();
                }
              }
            });
          });

          return query(argsWithNewId);
        },
      },
    },
  });
}
