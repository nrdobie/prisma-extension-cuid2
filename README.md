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

Then when initializing your PrismaClient, extend it with the `cuid2` middleware and provide the fields you want to
use CUID2 for:

```typescript
import { PrismaClient } from '@prisma/client'
import cuid2Extension from 'prisma-extension-cuid2'

const prisma = new PrismaClient().$extends(cuid2Extension({
  fields: ['SingleId:id', 'DualId:id1', 'DualId:id2']
}))

export default prisma
```

By default if you don't specify the `fields` or `includeFields` options, the extension will use the `*:id` pattern to
apply the extension which can cause issues, see the options section for more information.


## Options

### `fields` _(recommended)_

Specify the fields to apply the extension to. This option takes in an array of `ModelName:FieldName` strings. This is
the recommended way to use the extension, as it provides the most safety and control.

```typescript
cuid2Extension({
  fields: ['SingleId:id', 'DualId:id1', 'DualId:id2']
})
```

### `includeFields` and `excludeFields`

If your schema is large and has a fairly standard format for models, you can use the `includeFields` and `excludeFields`
options instead of specifying each field individually. These options take in an array of `ModelName:FieldName` strings,
with `includeFields` supporting wildcard model names and `excludeFields` supporting wildcard field names.

**DANGER:** Due to how Prisma generates code, this extension does not have a way to know which fields are on any given
model. The extension will attempt to set the include fields on every model that matches regardless of whether the field
exists. This will cause runtime errors if you are not careful.
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
