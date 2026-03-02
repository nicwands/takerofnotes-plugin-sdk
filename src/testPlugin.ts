import { SUPPORTED_API_VERSION, validatePlugin } from './validatePlugin'

export interface TestNote {
    id: string
    data: string
}

export const createTestNote = (
    id: string = 'test-note-1',
    data?: string,
): TestNote => ({
    id,
    data: data || 'test-data',
})

export interface TestPluginOptions {
    plugin: {
        name: string
        apiVersion: string
    }
    adapter: {
        init(): Promise<void>
        getAll(): Promise<any[]>
        create(note: any): Promise<void>
        update(note: any): Promise<void>
        delete(id: string): Promise<void>
    }
    config?: any
}

export const runPluginTests = ({ plugin, adapter }: TestPluginOptions) => {
    return {
        validatePlugin: (it: any, equal: (a: any, b: any) => void) => {
            it('should be a valid plugin', () => {
                try {
                    validatePlugin(plugin)
                } catch (e) {
                    throw new Error('Plugin validation failed')
                }
            })
            it('should have correct apiVersion', () => {
                equal(plugin.apiVersion, SUPPORTED_API_VERSION)
            })
        },

        init: (it: any) => {
            it('should initialize without errors', async () => {
                await adapter.init()
            })
        },

        getAll: (it: any) => {
            it('should return an array', async () => {
                const notes = await adapter.getAll()
                if (!Array.isArray(notes)) {
                    throw new Error('getAll should return an array')
                }
            })
        },

        create: (it: any) => {
            it('should create a note without errors', async () => {
                const note = createTestNote()
                await adapter.create(note)
            })

            it('created note should be retrievable via getAll()', async () => {
                const note = createTestNote('test-create-note')
                await adapter.create(note)
                const notes = await adapter.getAll()
                const found = notes.find((n: any) => n.id === note.id)
                if (!found) {
                    throw new Error('Created note not found')
                }
            })
        },

        update: (it: any) => {
            it('should update a note without errors', async () => {
                const note = createTestNote('test-update-note')
                await adapter.create(note)
                const updatedNote = { ...note, data: 'Updated data' }
                await adapter.update(updatedNote)
            })

            it('updated note should reflect changes', async () => {
                const note = createTestNote('test-update-note-2')
                await adapter.create(note)
                const updatedNote = { ...note, data: 'Updated data v2' }
                await adapter.update(updatedNote)
                const notes = await adapter.getAll()
                const found = notes.find((n: any) => n.id === note.id)
                if (found?.data !== 'Updated data v2') {
                    throw new Error('Updated note data does not match')
                }
            })
        },

        delete: (it: any) => {
            it('should delete a note without errors', async () => {
                const note = createTestNote('test-delete-note')
                await adapter.create(note)
                await adapter.delete(note.id)
            })

            it('deleted note should not be in getAll() results', async () => {
                const note = createTestNote('test-delete-note-2')
                await adapter.create(note)
                await adapter.delete(note.id)
                const notes = await adapter.getAll()
                const found = notes.find((n: any) => n.id === note.id)
                if (found) {
                    throw new Error('Deleted note still exists')
                }
            })
        },

        crudCycle: (it: any) => {
            it('should complete full create -> read -> update -> delete cycle', async () => {
                const note = createTestNote('test-crud-cycle')
                await adapter.create(note)

                let notes = await adapter.getAll()
                if (!notes.find((n: any) => n.id === note.id)) {
                    throw new Error('Created note not found')
                }

                const updatedNote = { ...note, data: 'CRUD update' }
                await adapter.update(updatedNote)
                notes = await adapter.getAll()
                if (
                    notes.find((n: any) => n.id === note.id)?.data !==
                    'CRUD update'
                ) {
                    throw new Error('Updated note data does not match')
                }

                await adapter.delete(note.id)
                notes = await adapter.getAll()
                if (notes.find((n: any) => n.id === note.id)) {
                    throw new Error('Deleted note still exists')
                }
            })
        },
    }
}
