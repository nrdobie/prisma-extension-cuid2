import { expect, test } from "vitest";

import cuid2Extension, { Cuid2ExtensionOptions } from "./cuid2-extension";
import { ExcludeField, Field, IncludeField } from "./valid-fields";

test("cuid2Extension returns an extension", () => {
  const extension = cuid2Extension();
  expect(extension).toBeTypeOf("function");
});

test("cuid2Extension throws error when fields is not in correct format", () => {
  const options: Cuid2ExtensionOptions = {
    fields: ["invalidFormat"] as unknown as Field[],
  };
  expect(() => cuid2Extension(options)).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "validation": "regex",
        "code": "invalid_string",
        "message": "Invalid",
        "path": [
          "fields",
          0
        ]
      }
    ]]
  `);
});

test("cuid2Extension throws error when using fields and includeFields", () => {
  const options: Cuid2ExtensionOptions = {
    fields: ["Model:Field"] as unknown as Field[],
    includeFields: ["Model:Field"] as unknown as IncludeField[],
  };
  expect(() => cuid2Extension(options)).toThrowErrorMatchingInlineSnapshot(
    `[Error: You cannot provide both \`fields\` and \`includeFields\`/\`excludeFields\` options.]`,
  );
});

test("cuid2Extension throws error when includeFields is not provided", () => {
  const options: Cuid2ExtensionOptions = {
    includeFields: undefined,
  };
  expect(() => cuid2Extension(options)).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "invalid_type",
        "expected": "array",
        "received": "undefined",
        "path": [
          "includeFields"
        ],
        "message": "Required"
      }
    ]]
  `);
});

test("cuid2Extension throws error when includeFields is does not have at least on item", () => {
  const options: Cuid2ExtensionOptions = {
    includeFields: [],
  };
  expect(() => cuid2Extension(options)).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "too_small",
        "minimum": 1,
        "type": "array",
        "inclusive": true,
        "exact": false,
        "message": "Array must contain at least 1 element(s)",
        "path": [
          "includeFields"
        ]
      }
    ]]
  `);
});

test("cuid2Extension throws error when includeFields is not in correct format", () => {
  const options: Cuid2ExtensionOptions = {
    includeFields: ["invalidFormat"] as unknown as IncludeField[],
  };
  expect(() => cuid2Extension(options)).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "validation": "regex",
        "code": "invalid_string",
        "message": "Invalid",
        "path": [
          "includeFields",
          0
        ]
      }
    ]]
  `);
});

test("cuid2Extension throws error when excludeFields is not in correct format", () => {
  const options: Cuid2ExtensionOptions = {
    includeFields: ["Model:Field"] as unknown as IncludeField[],
    excludeFields: ["invalidFormat"] as unknown as ExcludeField[],
  };
  expect(() => cuid2Extension(options)).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "validation": "regex",
        "code": "invalid_string",
        "message": "Invalid",
        "path": [
          "excludeFields",
          0
        ]
      }
    ]]
  `);
});
