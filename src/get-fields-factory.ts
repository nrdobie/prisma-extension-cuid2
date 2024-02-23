/**
 * Function that returns the fields on a model to apply the CUID2 extension
 */
export type GetFieldsFunction = (operationModel: string) => string[];

/**
 * Returns a function that returns the fields to apply to a model
 *
 * @param includeFields
 * @param excludeFields
 */
export default function getFieldsFactory(includeFields: string[], excludeFields: string[] = []): GetFieldsFunction {
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
