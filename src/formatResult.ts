
const debug = require('debug')('textactor:ner');

import { EConceptCollection, EConcept } from "./conceptCollection";
import { EResult, EResultEntityItem, EResultEntity, EResultConcept } from "./types";
import { Actor } from "@textactor/actor-domain";

export function formatResult(concepts: EConceptCollection): EResult {
    const result: EResult = { entities: [] };

    for (let concept of concepts.getList()) {
        if (!concept.actor) {
            debug(`no actor for concept: ${concept.value}`);
            continue;
        }
        debug(`concept has actor: ${concept.value}`);
        let entityItem = result.entities.find(item => item.entity.id === concept.actor.id);
        if (!entityItem) {
            entityItem = toResultEntityItem(concept.actor);
            result.entities.push(entityItem);
        }
        entityItem.concepts.push(toConcept(concept));
    }

    return result;
}

function toResultEntityItem(actor: Actor): EResultEntityItem {
    return { entity: toResultEntity(actor), concepts: [] };
}

function toConcept(concept: EConcept): EResultConcept {
    const erc: EResultConcept = {
        text: concept.value,
        index: concept.index,
    };

    return erc;
}

function toResultEntity(actor: Actor): EResultEntity {
    const entity: EResultEntity = {
        id: actor.id,
        name: actor.name,
    };

    if (actor.type) {
        entity.type = actor.type;
    }

    if (actor.description) {
        entity.description = actor.description;
    }

    if (actor.wikiDataId) {
        entity.wikiDataId = actor.wikiDataId;
    }

    return entity;
}
