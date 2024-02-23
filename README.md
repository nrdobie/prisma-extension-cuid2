# `prisma-extension-cuid2`

Enables using `cuid2` as a default value for id fields in Prisma.

## Limitations

This package does not attempt to modify the Prisma engine to allow for the use of `@default(cuid2())` but instead
utilizes `PrismaClient.$extends` to add some middleware that will update the id fields to CUID2 values before they
are saved to the database.

## Installation

Install the package using your package manager of choice:

```sh
npm install --save prisma-extension-cuid2
# or
yarn add prisma-extension-cuid2
# or
pnpm add prisma-extension-cuid2
```

Define your Prisma schema as usual using `@default(cuid())` for the id fields:

```prisma
model SingleId {
  id String @id @default(cuid())
}

model DualId {
  id1 String @id @default(cuid())
  id2 String @default(cuid())

  @@unique([id2])
}
```

Then when initializing your PrismaClient, extend it with the `cuid2` middleware:

```typescript
import { PrismaClient } from '@prisma/client'
import cuid2Extension from 'prisma-extension-cuid2'

const prisma = new PrismaClient().$extend(cuid2Extension())

export default prisma
```

## Options

### `includeFields` and `excludeFields`

By default, the extension will apply to all fields with the name of `id` in your schema. If you want to customize which
fields the extension applies to, you can use the `includeFields` and `excludeFields` options. Both options take in an
array of `ModelName:FieldName` strings, The `includeFields` supports `*` as a wildcard for model names and
`excludeFields` supports `*` as a wildcard for field names.

```typescript
// Changing the default field name from `id` to `cuid`
cuid2Extension({
  includeFields: ['*:cuid']
})

// Excluing a specific field from the extension
cuid2Extension({
  excludeFields: ['SingleId:id']
})

// Excluding a model from the extension, like a join table
cuid2Extension({
  excludeFields: ['AuthorsToPosts:*']
})
```

### `cuid2Options`

If you want to customize the CUID2 generation, you can pass in options that will be used when initializing the CUID2
generator. The options are passed directly to the `cuid2` package.

```typescript
cuid2Extension({
  cuid2Options: {
    fingerprint: process.env.DEVICE_ID
  }
})
```

[See the CUID2 documentation for more information on the available options.](https://github.com/paralleldrive/cuid2?tab=readme-ov-file#configuration)
