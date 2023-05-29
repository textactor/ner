const debug = require("debug")("textactor:ner");

import { parse } from "concepts-parser";
import { Context } from "./types";
import { EConceptCollection, EConcept } from "./concept-collection";

export function getConcepts(context: Context): EConceptCollection {
  const lang = context.lang;
  const country = context.country;
  const concepts = parse(context).map((concept) =>
    EConcept.create(concept, lang, country)
  );

  const collection = new EConceptCollection();

  if (concepts.length === 0) {
    return collection;
  }

  for (let concept of concepts) {
    debug(`Found concept: ${concept.value}`);
    collection.add(concept);
    if (concept.countWords < 2) {
      continue;
    }
    const childs = concept.split(lang, country);
    if (childs.length) {
      concept.setChilds(childs);
      collection.add(childs);
    }
  }

  return collection;
}
