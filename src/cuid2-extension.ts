import { init } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import { produce } from "immer";

import getFieldsFactory from "@/get-fields-factory";

const FIELD_REGEX = /^([^:]+):([^:]+)$/;
const OPERATIONS = ["create", "createMany", "upsert"];

type Cuid2InitOptions = Parameters<typeof init>[0];

export type Cuid2ExtensionOptions = {
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
  includeFields?: string[];

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
  excludeFields?: string[];

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

const DEFAULT_OPTIONS: Cuid2ExtensionOptions = {
  includeFields: ["*:id"],
};

export default function cuid2Extension(options?: Cuid2ExtensionOptions) {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (!mergedOptions.includeFields) {
    throw new Error("You must provide the `includeFields` option.");
  }

  if (mergedOptions.includeFields.length === 0) {
    throw new Error("You must provide at least one field in the `includeFields` option.");
  }

  if (mergedOptions.includeFields.some((applyToField) => !FIELD_REGEX.test(applyToField))) {
    throw new Error("The `includeFields` option must be in the format of `ModelName:FieldName`.");
  }

  if (mergedOptions.excludeFields && mergedOptions.excludeFields.some((skipField) => !FIELD_REGEX.test(skipField))) {
    throw new Error("The `excludeFields` option must be in the format of `ModelName:FieldName`.");
  }

  const createId = init(mergedOptions.cuid2Options);

  const getFields = getFieldsFactory(mergedOptions.includeFields, mergedOptions.excludeFields);

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
