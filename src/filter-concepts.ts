
const debug = require('debug')('textactor:ner');

import { EConceptCollection, EConcept } from "./concept-collection";
import { ActorType } from "@textactor/actor-domain";

export function filterConcepts(collection: EConceptCollection): EConceptCollection {
    identifyPartialConcepts(collection);

    const deleteIds: string[] = [];
    const deleteConcepts: EConcept[] = [];

    for (let concept of collection.getList()) {
        if (!concept.actor && !concept.type) {
            // collection.removeById(concept.id);
            deleteIds.push(concept.id);
            continue;
        }

        if (concept.parentId) {
            debug(`concept with parentId=${concept.value}`)
            const parentConcepts = collection.getById(concept.parentId);
            if (parentConcepts && parentConcepts.length) {
                if (parentConcepts[0].actor || parentConcepts[0].type) {
                    debug(`removing child concept: ${concept.value}`);
                    // collection.removeById(concept.id);
                    deleteConcepts.push(concept);
                    // deleteIds.push(concept.id);
                    continue;
                } else {
                    debug(`removing parent concept: ${parentConcepts[0].value}`);
                    // collection.removeById(concept.parentId);
                    deleteIds.push(concept.parentId);
                }
            }
        } else {
            debug(`concept with out parentId=${concept.value}`)
        }
    }

    for (let id of deleteIds) {
        collection.removeById(id);
    }
    for (let concept of deleteConcepts) {
        collection.remove(concept);
    }

    return collection;
}

export function identifyPartialConcepts(collection: EConceptCollection) {
    const concepts = collection.getList().sort((a, b) => b.countWords - a.countWords);
    // debug(`ordered concepts first: ${concepts[0].value}, last: ${concepts[concepts.length - 1].value}`);
    for (let i = 0; i < concepts.length; i++) {
        const concept = concepts[i];
        if (concept.countWords < 2 || concept.isAbbr) {
            continue;
        }
        if (!concept.actor && !concept.type) {
            continue;
        }

        for (let j = i; j < concepts.length; j++) {
            const childConcept = concepts[j];
            if (childConcept.countWords >= concept.countWords) {
                continue;
            }
            let found = false;
            if (childConcept.isAbbr) {
                if (concept.abbr && concept.abbr === childConcept.value) {
                    debug(`found abbr child concept: ${childConcept.value}`);
                    found = true;
                }
            } else if (!childConcept.parentId) {
                if (concept.actor && concept.actor.type === ActorType.PERSON
                    || concept.type === ActorType.PERSON) {
                    const reg = new RegExp('\\b' + childConcept.value + '\\b');
                    if (reg.test(concept.value)) {
                        debug(`found partial child concept: ${childConcept.value}`);
                        found = true;
                    }
                }
            }
            if (found) {
                if (concept.actor) {
                    childConcept.actor = concept.actor;
                } else {
                    delete childConcept.actor;
                    delete childConcept.type;
                }
            }
        }
    }
}
