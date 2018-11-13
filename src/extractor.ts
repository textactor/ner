
const debug = require('debug')('textactor:ner');

import { ActorRepository, Actor, ActorNameRepository } from "@textactor/actor-domain";
import { uniq } from '@textactor/domain';
import { Context, EResult } from "./types";
import { getConcepts } from "./get-concepts";
import { filterConcepts } from "./filter-concepts";
import { formatResult } from "./format-result";
import { EConceptCollection } from "./concept-collection";

export class Extractor {
    constructor(private actorRep: ActorRepository, private nameRep: ActorNameRepository) { }

    async extract(context: Context): Promise<EResult> {
        const concepts = getConcepts(context);

        if (concepts.getList().length === 0) {
            debug(`no concepts!`);
            return { entities: [] };
        }

        await this.getActors(concepts);

        filterConcepts(concepts);

        const result = formatResult(concepts);

        return result;
    }

    async getActors(concepts: EConceptCollection): Promise<Actor[]> {
        let nameIds = uniq(concepts.getList().map(concept => concept.id));

        if (nameIds.length === 0) {
            debug(`No concept names found`);
            return [];
        }

        if (nameIds.length > 100) {
            debug(`more then 100 concept names: ${nameIds.length}`);
            nameIds = nameIds.slice(0, 100);
        }

        const actorNames = await this.nameRep.getByIds(nameIds);

        if (actorNames.length === 0) {
            debug(`No actor names found`);
            return [];
        }

        let actorIds = uniq(actorNames.map(item => item.actorId));

        if (actorIds.length > 100) {
            debug(`more then 100 actor ids: ${actorIds.length}`);
            actorIds = actorIds.slice(0, 100);
        }

        const actors = await this.actorRep.getByIds(actorIds);

        if (actors.length === 0) {
            debug(`No actors found`);
            return [];
        }

        const actorsMap: Map<string, Actor> = new Map();
        actors.forEach(actor => actorsMap.set(actor.id, actor));

        for (let actorName of actorNames) {
            const actor = actorsMap.get(actorName.actorId);
            if (actor) {
                concepts.setActor(actorName.id, actor);
            }
        }

        return actors;
    }
}
