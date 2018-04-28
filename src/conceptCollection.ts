import { Actor, ActorHelper } from "@textactor/actor-domain";
import { Concept } from "concepts-parser";

export class EConceptCollection {
    protected list: EConcept[] = []
    protected map: Map<string, EConcept[]> = new Map()

    getList() {
        return this.list;
    }

    getMap() {
        return this.map;
    }

    add(concepts: EConcept | EConcept[]) {
        concepts = Array.isArray(concepts) ? concepts : [concepts];

        for (let concept of concepts) {
            this.list.push(concept);
            if (this.map.has(concept.id)) {
                this.map.get(concept.id).push(concept);
            } else {
                this.map.set(concept.id, [concept]);
            }
        }
    }

    removeById(id: string) {
        const concepts = this.map.get(id);
        if (!concepts || concepts.length === 0) {
            return;
        }
        for (let concept of concepts) {
            this.list.splice(this.list.indexOf(concept), 1);
        }
    }

    setActor(id: string, actor: Actor) {
        this.map.get(id).forEach(item => item.actor = actor);
    }

    getByAbbr(abbr: string): EConcept {
        for (let concept of this.list) {
            if (concept.abbr === abbr) {
                return concept;
            }
        }
    }

    getById(id: string) {
        return this.map.get(id) || [];
    }
}

export class EConcept extends Concept {
    id: string
    childIds: string[] = []
    parentId?: string
    actor?: Actor

    setChilds(childs: EConcept[]) {
        for (let child of childs) {
            child.parentId = this.id;
            this.childIds.push(child.id);
        }
    }

    static create(concept: Concept, lang: string, country: string) {
        const ec = new EConcept(concept);
        ec.id = EConcept.createId(concept, lang, country);

        return ec;
    }

    static createId(concept: Concept, lang: string, country: string) {
        return ActorHelper.createNameId(concept.value, lang, country);
    }
}
