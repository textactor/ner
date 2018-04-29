
import { ActorType } from '@textactor/actor-domain';

export type Context = {
    text: string
    lang: string
    country: string
}

export type EResultEntity = {
    id: string
    name: string
    abbr?: string
    wikiDataId?: string
    description?: string
    type?: ActorType
}

export type EResultInput = {
    text: string
    index: number
    abbr?: string
}

export type EResultEntityItem = {
    entity: EResultEntity
    input: EResultInput[]
}

export type EResult = {
    entities: EResultEntityItem[]
}
