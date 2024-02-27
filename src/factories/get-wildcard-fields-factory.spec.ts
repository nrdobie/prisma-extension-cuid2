import { expect, test } from "vitest";

import getWildcardFieldsFactory from "./get-wildcard-fields-factory";

test("getWildcardFieldsFactory" + " returns a function", () => {
  const getFields = getWildcardFieldsFactory([], []);
  expect(getFields).toBeTypeOf("function");
});

test("getWildcardFieldsFactory" + " handles includeFields correctly", () => {
  const getFields = getWildcardFieldsFactory(["TestModel:field1", "TestModel:field2"], []);
  const fields = getFields("TestModel");
  expect(fields).toEqual(["field1", "field2"]);
});

test("getWildcardFieldsFactory" + " handles wildcard in includeFields correctly", () => {
  const getFields = getWildcardFieldsFactory(["*:field1", "TestModel:field2"], []);
  const fields = getFields("TestModel");
  expect(fields).toEqual(["field1", "field2"]);
});

test("getWildcardFieldsFactory" + " handles excludeFields correctly", () => {
  const getFields = getWildcardFieldsFactory(["TestModel:field1", "TestModel:field2"], ["TestModel:field1"]);
  const fields = getFields("TestModel");
  expect(fields).toEqual(["field2"]);
});

test("getWildcardFieldsFactory" + " handles wildcard in excludeFields correctly", () => {
  const getFields = getWildcardFieldsFactory(["TestModel:field1", "TestModel:field2"], ["TestModel:*"]);
  const fields = getFields("TestModel");
  expect(fields).toEqual([]);
});
