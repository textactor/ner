
const debug = require('debug')('textactor:ner');

import { IActorReadRepository, Actor, IActorNameReadRepository } from "@textactor/actor-domain";
import { uniq } from '@textactor/domain';
import { Context, EResult } from "./types";
import { getConcepts } from "./getConcepts";
import { filterConcepts } from "./filterConcepts";
import { formatResult } from "./formatResult";
import { EConceptCollection } from "./conceptCollection";

export class Extractor {
    constructor(private actorRep: IActorReadRepository, private nameRep: IActorNameReadRepository) { }

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
        const nameIds = uniq(concepts.getList().map(concept => concept.id));

        const actorNames = await this.nameRep.getByIds(nameIds);

        if (actorNames.length === 0) {
            debug(`No actor names found`);
            return [];
        }

        const actorIds = uniq(actorNames.map(item => item.actorId));

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
