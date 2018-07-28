
const debug = require('debug')('textactor:ner');

import { Actor, ActorHelper, ActorType } from "@textactor/actor-domain";
import { Concept } from "concepts-parser";
import { NameHelper } from "@textactor/domain";

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
            const mapList = this.map.get(concept.id);
            if (mapList) {
                mapList.push(concept);
            } else {
                this.map.set(concept.id, [concept]);
            }
        }
    }

    removeById(id: string) {
        const concepts = this.map.get(id);
        if (!concepts || !concepts.length) {
            return;
        }
        this.map.delete(id);
        for (let concept of concepts) {
            const len = this.list.length;
            this.list.splice(this.list.indexOf(concept), 1);
            debug(`deleted concept: ${concept.value}, ${len}>${this.list.length}`);
        }
    }

    remove(concept: EConcept) {
        const concepts = this.map.get(concept.id) || [];
        if (!concepts.length) {
            return;
        }
        let index = concepts.indexOf(concept);
        if (index < 0) {
            throw new Error(`not found concept=${concept.id} in map list`);
        }
        concepts.splice(index, 1);
        if (!concepts.length) {
            this.map.delete(concept.id);
        }
        index = this.list.indexOf(concept);
        if (index < 0) {
            throw new Error(`not found concept=${concept.id} in list`);
        }
        this.list.splice(index, 1);
        debug(`deleted concept: ${concept.value}`);
    }

    setActor(id: string, actor: Actor) {
        const mapList = this.map.get(id);
        if (!mapList) {
            throw new Error(`Not found items with id=${id}`);
        }
        mapList.forEach(item => item.actor = actor);
    }

    findByAbbr(abbr: string): EConcept | undefined {
        for (let concept of this.list) {
            if (concept.abbr === abbr) {
                return concept;
            }
        }
    }

    getById(id: string) {
        return this.map.get(id);
    }
}

export class EConcept {
    id: string
    childIds: string[] = []
    parentId?: string
    actor?: Actor
    isAbbr: boolean
    countWords: number

    constructor(public value: string, public index: number, lang: string, country: string, public abbr?: string, public type?: ActorType) {
        this.countWords = NameHelper.countWords(value);
        this.isAbbr = NameHelper.isAbbr(value);
        this.id = EConcept.createId(value, lang, country);
    }

    setChilds(childs: EConcept[]) {
        debug(`set concept childs: ${this.value}`)
        for (let child of childs) {
            child.parentId = this.id;
            this.childIds.push(child.id);
            debug(`set concept(${child.value}) parent id: ${this.id}`);
        }
    }

    split(lang: string, country: string) {
        if (this.countWords === 1) {
            return [];
        }
        return (new Concept({ value: this.value, index: this.index, lang }))
            .split()
            .map(item => EConcept.create(item, lang, country));
    }

    static create(concept: Concept, lang: string, country: string) {
        return new EConcept(concept.value, concept.index, lang, country, concept.abbr, toActorType(concept.type));
    }

    static createId(value: string, lang: string, country: string) {
        return ActorHelper.createNameId(value, lang, country);
    }
}

function toActorType(conceptType: string): ActorType | undefined {
    switch (conceptType) {
        case 'PERSON': return ActorType.PERSON;
    }
}
