import { validatePlugin } from './validatePlugin'
import type { NotesPlugin } from './types'

export const definePlugin = (plugin: NotesPlugin): NotesPlugin => {
    return validatePlugin(plugin)
}
