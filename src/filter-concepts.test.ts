
import { identifyPartialConcepts, filterConcepts } from './filter-concepts';
import test from 'ava';
import { EConceptCollection, EConcept } from './concept-collection';
import { Concept } from 'concepts-parser';
import { ActorType } from '@textactor/actor-domain';

test('identifyPartialConcepts: ABBR', t => {

    const collection = new EConceptCollection();
    const lang = 'en';
    const country = 'us';
    const concepts = [
        EConcept.create(new Concept({ value: 'Long Concept', index: 1, lang }), 'en', 'us'),
        EConcept.create(new Concept({ value: 'ABBR', index: 100, lang }), 'en', 'us')
    ];
    concepts[0].abbr = 'ABBR';

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name', lang, country, wikiDataId: '', wikiCountLinks: 1 });

    t.is(collection.getList().length, 2);

    identifyPartialConcepts(collection);

    t.is(collection.getList().length, 2);
    let item = collection.getList()[0];
    item.actor && t.is(item.actor.name, 'Name');
    item = collection.getList()[1];
    item.actor && t.is(item.actor.name, 'Name');
});

test('identifyPartialConcepts', t => {

    const collection = new EConceptCollection();
    const lang = 'en';
    const country = 'us';
    const concepts = [
        EConcept.create(new Concept({ value: 'Long Concept', index: 1, lang }), 'en', 'us'),
        EConcept.create(new Concept({ value: 'Concept', index: 100, lang }), 'en', 'us')
    ];

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name', lang, country, wikiDataId: '', wikiCountLinks: 1 });

    t.is(collection.getList().length, 2);

    identifyPartialConcepts(collection);

    t.is(collection.getList().length, 2);
    let item = collection.getList()[0];
    item.actor && t.is(item.actor.name, 'Name');
    t.is(collection.getList()[1].actor, undefined);
});

test('not identifyPartialConcepts', t => {

    const collection = new EConceptCollection();
    const lang = 'en';
    const country = 'us';
    const concepts = [
        EConcept.create(new Concept({ value: 'Long Concept', index: 1, lang }), 'en', 'us'),
        EConcept.create(new Concept({ value: 'Concept1', index: 100, lang }), 'en', 'us')
    ];

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name', lang, country, wikiDataId: '', wikiCountLinks: 1 });

    t.is(collection.getList().length, 2);
    t.is(collection.getList()[1].actor, undefined);

    identifyPartialConcepts(collection);

    t.is(collection.getList().length, 2);
    const item = collection.getList()[0];
    item.actor && t.is(item.actor.name, 'Name');
    t.is(collection.getList()[1].actor, undefined);
});

test('filter child concept', t => {

    const collection = new EConceptCollection();
    const lang = 'ro';
    const country = 'md';
    const concepts = [
        EConcept.create(new Concept({ value: 'Republica Moldova', index: 1, lang }), 'ro', 'md'),
        EConcept.create(new Concept({ value: 'Moldova', index: 100, lang }), 'ro', 'md')
    ];
    concepts[0].setChilds([concepts[1]]);

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name', lang, country, wikiDataId: '', wikiCountLinks: 1 });
    collection.setActor(concepts[1].id, { id: 'id', name: 'Name', lang, country, wikiDataId: '', wikiCountLinks: 1 });

    t.is(collection.getList().length, 2);

    filterConcepts(collection);

    t.is(collection.getList().length, 1);
    const item = collection.getList()[0];
    item.actor && t.is(item.actor.name, 'Name');
});

test('filter child concept by type', t => {

    const collection = new EConceptCollection();
    const lang = 'ro';
    const concepts = [
        EConcept.create(new Concept({ value: 'Republica Moldova', index: 1, lang }), 'ro', 'md'),
        EConcept.create(new Concept({ value: 'Moldova', index: 100, lang }), 'ro', 'md')
    ];
    concepts[0].setChilds([concepts[1]]);

    collection.add(concepts);
    concepts[0].type = ActorType.PERSON;

    t.is(collection.getList().length, 2);

    filterConcepts(collection);

    t.is(collection.getList().length, 1);
    t.is(collection.getList()[0].type, ActorType.PERSON);
});

test('identify/filter partial concepts by type', t => {

    const collection = new EConceptCollection();
    const lang = 'ro';
    const concepts = [
        EConcept.create(new Concept({ value: 'Charlotte', index: 0, lang }), 'ro', 'md'),
        EConcept.create(new Concept({ value: 'Charlotte Mounbatten-Windsor', index: 50, lang }), 'ro', 'md'),
        EConcept.create(new Concept({ value: 'Charlotte', index: 100, lang }), 'ro', 'md'),
    ];

    collection.add(concepts);
    concepts[1].type = ActorType.PERSON;

    t.is(collection.getList().length, 3);

    filterConcepts(collection);

    t.is(collection.getList().length, 1);
    t.is(collection.getList()[0].type, ActorType.PERSON);
});
