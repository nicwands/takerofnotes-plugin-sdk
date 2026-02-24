export abstract class BaseNotesAdapter {
    config: any

    constructor(config: any = {}) {
        this.config = config
    }

    abstract init(): Promise<void>
    abstract getAll(): Promise<any[]>
    abstract create(note: any): Promise<void>
    abstract update(note: any): Promise<void>
    abstract delete(id: string): Promise<void>
}
