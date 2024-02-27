import { z } from "zod";

const cuid2OptionsValidator = z
  .object({
    random: z.function().optional(),
    counter: z.function().optional(),
    fingerprint: z.string().optional(),
    length: z.number().optional(),
  })
  .optional();

export const wildcardValidator = z.object({
  includeFields: z.array(z.string().regex(/^(?:[A-Za-z][A-Za-z0-9]*|\*):[A-Za-z][A-Za-z0-9_]*$/)).min(1),
  excludeFields: z.array(z.string().regex(/^[A-Za-z][A-Za-z0-9]*:(?:[A-Za-z][A-Za-z0-9_]*|\*)$/)).optional(),
  cuid2Options: cuid2OptionsValidator,
});

export const exactValidator = z.object({
  fields: z.array(z.string().regex(/^[A-Za-z][A-Za-z0-9]*:[A-Za-z][A-Za-z0-9_]*$/)).min(1),
  cuid2Options: cuid2OptionsValidator,
});
