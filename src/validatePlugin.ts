import { z } from 'zod'

export const SUPPORTED_API_VERSION = '0.1.0'

const ConfigFieldSchema = z.object({
    key: z.string(),
    label: z.string(),
    type: z.enum(['text', 'password', 'directory', 'number', 'boolean']),
    default: z.string(),
    required: z.boolean().optional(),
})

const PluginSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    version: z.string(),
    apiVersion: z.string(),
    configSchema: z.array(ConfigFieldSchema),
    createAdapter: z.function(),
})

export const validatePlugin = (plugin: unknown) => {
    const parsed = PluginSchema.parse(plugin)

    if (parsed.apiVersion !== SUPPORTED_API_VERSION) {
        throw new Error(
            `Plugin API mismatch. Expected ${SUPPORTED_API_VERSION}`,
        )
    }

    return parsed
}
