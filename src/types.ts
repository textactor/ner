
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

export type EResultConcept = {
    text: string
    index: number
    abbr?: string
}

export type EResultEntityItem = {
    entity: EResultEntity
    concepts: EResultConcept[]
}

export type EResult = {
    entities: EResultEntityItem[]
}
