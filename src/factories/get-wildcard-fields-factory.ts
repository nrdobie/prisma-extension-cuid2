import { type GetFieldsFunction } from "./get-fields-function";

/**
 * Returns a function that returns the fields to apply to a model
 *
 * @param includeFields
 * @param excludeFields
 */
export default function getWildcardFieldsFactory(
  includeFields: string[],
  excludeFields: string[] = [],
): GetFieldsFunction {
  return (operationModel: string) => {
    const includeFieldsForModel = includeFields
      .filter((includeField) => {
        const [model] = includeField.split(":");
        return model === "*" || model === operationModel;
      })
      .map((includeField) => {
        const [, field] = includeField.split(":");
        return field;
      });

    const excludeFieldsForModel = excludeFields
      .filter((excludeField) => {
        const [model] = excludeField.split(":");
        return model === operationModel;
      })
      .map((excludeField) => {
        const [, field] = excludeField.split(":");
        return field;
      });

    if (excludeFieldsForModel.includes("*")) {
      return [];
    }

    return includeFieldsForModel.filter((includeField) => !excludeFieldsForModel.includes(includeField));
  };
}
