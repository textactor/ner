import { parse } from "concepts-parser";
import { Context } from "./types";
import { EConceptCollection, EConcept } from "./conceptCollection";

export function getConcepts(context: Context): EConceptCollection {
    const lang = context.lang;
    const country = context.country;
    const concepts = parse(context).map(concept => EConcept.create(concept, lang, country));

    const collection = new EConceptCollection();

    if (concepts.length === 0) {
        return collection;
    }

    for (let concept of concepts) {
        collection.add(concept);
        const childs = concept.split(lang).map(concept => EConcept.create(concept, lang, country));
        if (childs.length) {
            concept.setChilds(childs);
            collection.add(childs);
        }
    }

    return collection;
}
