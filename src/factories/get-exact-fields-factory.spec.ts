import { expect, test } from "vitest";

import getExactFieldsFactory from "./get-exact-fields-factory";

test("getExactFieldsFactory returns a function", () => {
  const getFields = getExactFieldsFactory([]);
  expect(getFields).toBeTypeOf("function");
});

test("getExactFieldsFactory handles fields correctly", () => {
  const getFields = getExactFieldsFactory(["TestModel:field1", "TestModel:field2"]);
  const fields = getFields("TestModel");
  expect(fields).toEqual(["field1", "field2"]);
});

test("getExactFieldsFactory ignores fields for other models", () => {
  const getFields = getExactFieldsFactory(["TestModel:field1", "OtherModel:field2"]);
  const fields = getFields("TestModel");
  expect(fields).toEqual(["field1"]);
});
