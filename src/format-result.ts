
// const debug = require('debug')('textactor:ner');

import { EConceptCollection, EConcept } from "./concept-collection";
import { EResult, EResultEntityItem, EResultEntity, EResultInput } from "./types";

export function formatResult(concepts: EConceptCollection): EResult {
    const result: EResult = { entities: [] };

    for (let concept of concepts.getList()) {
        const name = concept.actor && concept.actor.name || concept.value;
        let entityItem = result.entities.find(item => item.entity.name === name);
        if (!entityItem) {
            entityItem = toResultEntityItem(concept);
            result.entities.push(entityItem);
        }
        entityItem.input.push(toConcept(concept));
    }

    return result;
}

function toResultEntityItem(concept: EConcept): EResultEntityItem {
    return { entity: toResultEntity(concept), input: [] };
}

function toConcept(concept: EConcept): EResultInput {
    const erc: EResultInput = {
        text: concept.value,
        index: concept.index,
    };

    return erc;
}

function toResultEntity(concept: EConcept): EResultEntity {
    const entity: EResultEntity = {
        name: concept.actor && concept.actor.name || concept.value,
    };

    if (concept.actor) {
        const actor = concept.actor;
        entity.id = actor.id;
        if (actor.type) {
            entity.type = actor.type;
        }

        if (actor.wikiPageTitle) {
            entity.wikiPageTitle = actor.wikiPageTitle;
        }

        if (actor.description) {
            entity.description = actor.description;
        }

        if (actor.wikiDataId) {
            entity.wikiDataId = actor.wikiDataId;
        }

        if (actor.commonName) {
            entity.commonName = actor.commonName;
        }
        if (actor.englishName) {
            entity.englishName = actor.englishName;
        }
        if (actor.abbr) {
            entity.abbr = actor.abbr;
        }
    } else {
        if (concept.type) {
            entity.type = concept.type;
        }
    }

    return entity;
}
