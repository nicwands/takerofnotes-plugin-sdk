export interface ConfigField {
    key: string
    label: string
    type: 'text' | 'password' | 'directory' | 'number' | 'boolean'
    default: string
    required?: boolean
}

export interface NotesPlugin {
    id: string
    name: string
    description: string
    version: string
    apiVersion: string
    configSchema: ConfigField[]
    createAdapter(config: any): any
}

export type { BaseNotesAdapter } from './BaseNotesAdapter'
