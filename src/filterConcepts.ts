import { EConceptCollection } from "./conceptCollection";
import { NameHelper } from "@textactor/domain";

export function filterConcepts(concepts: EConceptCollection): EConceptCollection {
    for (let concept of concepts.getList()) {
        if (!concept.actor) {
            concepts.removeById(concept.id);
            continue;
        }
        if (NameHelper.isAbbr(concept.value)) {
            const abbrConcept = concepts.getByAbbr(concept.value);
            if (abbrConcept) {
                concepts.removeById(concept.id);
                continue;
            }
        }

        if (concept.parentId) {
            const parentConcepts = concepts.getById(concept.parentId);
            if (parentConcepts.length) {
                if (parentConcepts[0].actor) {
                    concepts.removeById(concept.id);
                    continue;
                } else {
                    concepts.removeById(concept.parentId);
                }
            }
        }
    }

    return concepts;
}
