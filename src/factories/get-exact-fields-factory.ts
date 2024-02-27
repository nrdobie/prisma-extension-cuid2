import { type GetFieldsFunction } from "./get-fields-function";

/**
 * Returns a function that returns the fields to apply to a model
 *
 * @param fields
 */
export default function getExactFieldsFactory(fields: string[]): GetFieldsFunction {
  return (operationModel: string) => {
    return fields
      .filter((field) => {
        const [model] = field.split(":");
        return model === operationModel;
      })
      .map((fieldPair) => {
        const [, field] = fieldPair.split(":");
        return field;
      });
  };
}
