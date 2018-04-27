
import { ActorType } from '@textactor/actor-domain';

export type Context = {
    text: string
    lang: string
    country: string
}

export type ResultEntity = {
    id: string
    name: string
    abbr?: string
    wikiEntityId?: string
    description?: string
    type?: ActorType
}

export type ResultConcept = {
    text: string
    index: number
    abbr?: string
}

export type ResultEntityItem = {
    entity: ResultEntity
    concepts: ResultConcept[]
}

export type Results = {
    entities: {
        [id: string]: ResultEntityItem
    }
}
