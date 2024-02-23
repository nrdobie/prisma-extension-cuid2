import { expect, test } from "vitest";

import getFieldsFactory from "./get-fields-factory";

test("getFieldsFactory returns a function", () => {
  const getFields = getFieldsFactory([], []);
  expect(getFields).toBeTypeOf("function");
});

test("getFieldsFactory handles includeFields correctly", () => {
  const getFields = getFieldsFactory(["TestModel:field1", "TestModel:field2"], []);
  const fields = getFields("TestModel");
  expect(fields).toEqual(["field1", "field2"]);
});

test("getFieldsFactory handles wildcard in includeFields correctly", () => {
  const getFields = getFieldsFactory(["*:field1", "TestModel:field2"], []);
  const fields = getFields("TestModel");
  expect(fields).toEqual(["field1", "field2"]);
});

test("getFieldsFactory handles excludeFields correctly", () => {
  const getFields = getFieldsFactory(["TestModel:field1", "TestModel:field2"], ["TestModel:field1"]);
  const fields = getFields("TestModel");
  expect(fields).toEqual(["field2"]);
});

test("getFieldsFactory handles wildcard in excludeFields correctly", () => {
  const getFields = getFieldsFactory(["TestModel:field1", "TestModel:field2"], ["TestModel:*"]);
  const fields = getFields("TestModel");
  expect(fields).toEqual([]);
});
