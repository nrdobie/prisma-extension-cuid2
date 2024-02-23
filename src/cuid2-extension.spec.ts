import { expect, test } from "vitest";

import cuid2Extension, { Cuid2ExtensionOptions } from "./cuid2-extension";

test("cuid2Extension returns an extension", () => {
  const extension = cuid2Extension();
  expect(extension).toBeTypeOf("function");
});

test("cuid2Extension throws error when includeFields is not provided", () => {
  const options: Cuid2ExtensionOptions = {
    includeFields: undefined,
  };
  expect(() => cuid2Extension(options)).toThrow("You must provide the `includeFields` option.");
});

test("cuid2Extension throws error when includeFields is does not have at least on item", () => {
  const options: Cuid2ExtensionOptions = {
    includeFields: [],
  };
  expect(() => cuid2Extension(options)).toThrow("You must provide at least one field in the `includeFields` option.");
});

test("cuid2Extension throws error when includeFields is not in correct format", () => {
  const options: Cuid2ExtensionOptions = {
    includeFields: ["invalidFormat"],
  };
  expect(() => cuid2Extension(options)).toThrow(
    "The `includeFields` option must be in the format of `ModelName:FieldName`.",
  );
});

test("cuid2Extension throws error when excludeFields is not in correct format", () => {
  const options: Cuid2ExtensionOptions = {
    includeFields: ["Model:Field"],
    excludeFields: ["invalidFormat"],
  };
  expect(() => cuid2Extension(options)).toThrow(
    "The `excludeFields` option must be in the format of `ModelName:FieldName`.",
  );
});
