import { IActorReadRepository, ActorHelper, Actor, IActorNameReadRepository } from "@textactor/actor-domain";
import { Context, Results, ResultEntityItem } from "./types";
import { parse } from 'concepts-parser';
import { uniq } from '@textactor/domain';

export class Extractor {
    constructor(private actorRep: IActorReadRepository, private nameRep: IActorNameReadRepository) { }

    async extract(context: Context): Promise<Results> {
        const concepts = parse(context);

        const results: Results = { entities: {} };

        if (concepts.length === 0) {
            return Promise.resolve(results);
        }

        const names = uniq(concepts.map(concept => concept.value));

        const actors = await this.getActors(names, context);

        for (let actor of actors) {
            results.entities[actor.id] = results.entities[actor.id] || createResultItem(actor);
        }

        return results;
    }

    private async getActors(names: string[], context: Context): Promise<Actor[]> {
        const nameIds = uniq(names.map(name => ActorHelper.createNameId(name, context.lang, context.country)));

        const actorNames = await this.nameRep.getByIds(nameIds);
        const ids = uniq(actorNames.map(item => item.actorId));

        return await this.actorRep.getByIds(ids);
    }
}

function createResultItem(actor: Actor): ResultEntityItem {
    const item: ResultEntityItem = {
        entity: { id: actor.id, name: actor.name, wikiEntityId: actor.wikiDataId, type: actor.type, description: actor.description },
        concepts: [],
    };

    return item;
}
