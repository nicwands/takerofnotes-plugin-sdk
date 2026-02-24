# @takerofnotes/plugin-sdk

Official plugin SDK for Taker of Notes.

This package provides the public contract for building storage adapters and third-party plugins for Taker of Notes.

It includes:

-   `BaseNotesAdapter` (abstract adapter class)
-   `definePlugin()` helper
-   Runtime plugin validation
-   Strong TypeScript types
-   API version enforcement

# Installation

```bash
npm install @takerofnotes/plugin-sdk
```

# Quick Start

All plugins must:

1. Extend BaseNotesAdapter
2. Export a plugin definition using definePlugin()
3. Declare a compatible apiVersion

# Minimal Example

```typescript
import { BaseNotesAdapter, definePlugin } from '@nicwands/notes-plugin-sdk'

class MyAdapter extends BaseNotesAdapter {
    async init() {}

    async getAll() {
        return []
    }

    async create(note) {}

    async update(note) {}

    async delete(id) {}
}

export default definePlugin({
    id: 'my-adapter',
    name: 'My Adapter',
    description: 'Example storage adapter',
    version: '1.0.0',
    apiVersion: '1.0.0',
    configSchema: [],
    createAdapter(config) {
        return new MyAdapter(config)
    },
})
```

# Plugin Structure

A plugin exports a single default object created via `definePlugin()`.

```typescript
definePlugin({
  id: string
  name: string
  description: string
  version: string
  apiVersion: string
  configSchema: ConfigField[]
  createAdapter(config): BaseNotesAdapter
})
```

# BaseNotesAdapter

All storage adapters must extend:

```typescript
abstract class BaseNotesAdapter {
    constructor(config?: any)

    init(): Promise<void>
    getAll(): Promise<any[]>
    create(note: any): Promise<void>
    update(note: any): Promise<void>
    delete(id: string): Promise<void>
}
```

The adapter is responsible only for persistence.

It should:

-   Store notes
-   Retrieve notes
-   Update notes
-   Delete notes

It should NOT:

-   Perform indexing
-   Cache data
-   Apply business logic

That is handled by Taker of Notes core.

# Config Schema

`configSchema` defines UI configuration fields shown in the app.

```typescript
type ConfigField = {
    key: string
    label: string
    type: 'text' | 'password' | 'directory' | 'number' | 'boolean'
    default: 'text' | 'password' | 'directory' | 'number' | 'boolean'
    required?: boolean
}
```

Example:

```typescript
configSchema: [
    { key: 'endpoint', label: 'S3 Endpoint', type: 'text', required: true },
    { key: 'accessKey', label: 'Access Key', type: 'password', required: true },
    { key: 'secretKey', label: 'Secret Key', type: 'password', required: true },
]
```

Taker of Notes will automatically generate the configuration UI based on this schema.

# Publishing a Plugin

Recommended naming convention:

`notes-plugin-<adapter-name>`

Example:

```
notes-plugin-s3
notes-plugin-sqlite
notes-plugin-dropbox
```

In your plugin's package.json:

```json
{
    "name": "takerofnotes-plugin-s3",
    "version": "1.0.0",
    "type": "module",
    "peerDependencies": {
        "@nicwands/notes-plugin-sdk": "^0.1.0"
    }
}
```

Use peerDependencies to ensure compatibility with the host app.

# Security Considerations

Plugins execute in the Notes main process.

You should:

-   Avoid executing untrusted code
-   Protect credentials securely
-   Avoid leaking sensitive configuration

If building a remote storage adapter (S3, Supabase, etc.), never log secrets.

License
MIT
