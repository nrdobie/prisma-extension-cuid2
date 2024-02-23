import { PrismaClient } from "@prisma/client";
import { afterEach, beforeEach, expect, test } from "vitest";

import cuid2Extension from "./cuid2-extension";

const UUID_REGEX = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;

let prismaClient: PrismaClient;

beforeEach(() => {
  prismaClient = new PrismaClient();
});

afterEach(async () => {
  const deleteSingleId = prismaClient.singleId.deleteMany();
  const deleteDualId = prismaClient.dualId.deleteMany();

  await prismaClient.$transaction([deleteSingleId, deleteDualId]);

  await prismaClient.$disconnect();
});

test("when cuid2Extension is not provided the fields should default to UUID", async () => {
  const singleId = await prismaClient.singleId.create({
    data: {
      value: "test",
    },
  });

  expect(singleId.id).toBeTypeOf("string");
  expect(singleId.id).toMatch(UUID_REGEX);
});

test("cuid2Extension sets the CUID2 value on the specified fields", async () => {
  const cuid2 = cuid2Extension({
    includeFields: ["*:id"],
  });

  const modifiedPrismaClient = prismaClient.$extends(cuid2);

  const singleId = await modifiedPrismaClient.singleId.create({
    data: {
      value: "test",
    },
  });

  expect(singleId.id).toBeTypeOf("string");
  expect(singleId.id).not.toMatch(UUID_REGEX);
});

test("cuid2Extension does not set the CUID2 value on fields not specified", async () => {
  const cuid2 = cuid2Extension({
    includeFields: ["*:id"],
  });

  const modifiedPrismaClient = prismaClient.$extends(cuid2);

  const dualId = await modifiedPrismaClient.dualId.create({
    data: {
      value: "test",
    },
  });

  expect(dualId.id).toBeTypeOf("string");
  expect(dualId.id).not.toMatch(UUID_REGEX);

  expect(dualId.id2).toBeTypeOf("string");
  expect(dualId.id2).toMatch(UUID_REGEX);
});

test("cuid2Extension does not set the CUID2 value on fields specified in excludeFields", async () => {
  const cuid2 = cuid2Extension({
    includeFields: ["*:id"],
    excludeFields: ["DualId:id"],
  });

  const modifiedPrismaClient = prismaClient.$extends(cuid2);

  const singleId = await modifiedPrismaClient.singleId.create({
    data: {
      value: "test",
    },
  });

  expect(singleId.id).toBeTypeOf("string");
  expect(singleId.id).not.toMatch(UUID_REGEX);

  const dualId = await modifiedPrismaClient.dualId.create({
    data: {
      value: "test",
    },
  });

  expect(dualId.id).toBeTypeOf("string");
  expect(dualId.id).toMatch(UUID_REGEX);
});

test("cuid2Extension does not set the CUID2 value on fields specified in excludeFields with wildcard", async () => {
  const cuid2 = cuid2Extension({
    includeFields: ["*:id", "*:id2"],
    excludeFields: ["DualId:*"],
  });

  const modifiedPrismaClient = prismaClient.$extends(cuid2);

  const dualId = await modifiedPrismaClient.dualId.create({
    data: {
      value: "test",
    },
  });

  expect(dualId.id).toBeTypeOf("string");
  expect(dualId.id).toMatch(UUID_REGEX);
  expect(dualId.id2).toBeTypeOf("string");
  expect(dualId.id2).toMatch(UUID_REGEX);
});

test("cuid2Extension should work with upsert", async () => {
  const cuid2 = cuid2Extension({
    includeFields: ["*:id"],
  });

  const modifiedPrismaClient = prismaClient.$extends(cuid2);

  const singleId = await modifiedPrismaClient.singleId.upsert({
    where: { id: "id" },
    create: {
      value: "test",
    },
    update: {
      value: "test new",
    },
  });

  expect(singleId.id).toBeTypeOf("string");
  expect(singleId.id).not.toMatch(UUID_REGEX);

  expect(singleId.value).toBe("test");
});

test("cuid2Extension should work with upsert when updating", async () => {
  const cuid2 = cuid2Extension({
    includeFields: ["*:id"],
  });

  const singleId = await prismaClient.singleId.create({
    data: {
      value: "test",
    },
  });

  const id = singleId.id;

  const modifiedPrismaClient = prismaClient.$extends(cuid2);

  const updatedSingleId = await modifiedPrismaClient.singleId.upsert({
    where: { id },
    create: {
      value: "test",
    },
    update: {
      value: "test new",
    },
  });

  expect(updatedSingleId.id).toBeTypeOf("string");
  expect(updatedSingleId.id).toMatch(id);

  expect(updatedSingleId.value).toBe("test new");
});

test("cuid2Extension should not interfere with other methods", async () => {
  const cuid2 = cuid2Extension();

  const modifiedPrismaClient = prismaClient.$extends(cuid2);

  const singleIds = await modifiedPrismaClient.singleId.findMany();

  expect(Array.isArray(singleIds)).toBe(true);
});
