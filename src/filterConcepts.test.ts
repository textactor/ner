
import { identifyPartialConcepts, filterConcepts } from './filterConcepts';
import test from 'ava';
import { EConceptCollection, EConcept } from './conceptCollection';
import { Concept } from 'concepts-parser';
import { ActorType } from '@textactor/actor-domain';

test('identifyPartialConcepts: ABBR', t => {

    const collection = new EConceptCollection();
    const lang = 'en';
    const concepts = [EConcept.create(new Concept({ value: 'Long Concept', index: 1, lang }), 'en', 'us'), EConcept.create(new Concept({ value: 'ABBR', index: 100, lang }), 'en', 'us')];
    concepts[0].abbr = 'ABBR';

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name' });

    t.is(collection.getList().length, 2);

    identifyPartialConcepts(collection);

    t.is(collection.getList().length, 2);
    t.is(collection.getList()[0].actor.name, 'Name');
    t.is(collection.getList()[1].actor.name, 'Name');
});

test('identifyPartialConcepts', t => {

    const collection = new EConceptCollection();
    const lang = 'en';
    const concepts = [EConcept.create(new Concept({ value: 'Long Concept', index: 1, lang }), 'en', 'us'), EConcept.create(new Concept({ value: 'Concept', index: 100, lang }), 'en', 'us')];

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name' });

    t.is(collection.getList().length, 2);

    identifyPartialConcepts(collection);

    t.is(collection.getList().length, 2);
    t.is(collection.getList()[0].actor.name, 'Name');
    t.is(collection.getList()[1].actor.name, 'Name');
});

test('not identifyPartialConcepts', t => {

    const collection = new EConceptCollection();
    const lang = 'en';
    const concepts = [EConcept.create(new Concept({ value: 'Long Concept', index: 1, lang }), 'en', 'us'), EConcept.create(new Concept({ value: 'Concept1', index: 100, lang }), 'en', 'us')];

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name' });

    t.is(collection.getList().length, 2);
    t.is(collection.getList()[1].actor, undefined);

    identifyPartialConcepts(collection);

    t.is(collection.getList().length, 2);
    t.is(collection.getList()[0].actor.name, 'Name');
    t.is(collection.getList()[1].actor, undefined);
});

test('filter child concept', t => {

    const collection = new EConceptCollection();
    const lang = 'ro';
    const concepts = [EConcept.create(new Concept({ value: 'Republica Moldova', index: 1, lang }), 'ro', 'md'), EConcept.create(new Concept({ value: 'Moldova', index: 100, lang }), 'ro', 'md')];
    concepts[0].setChilds([concepts[1]]);

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name' });
    collection.setActor(concepts[1].id, { id: 'id', name: 'Name' });

    t.is(collection.getList().length, 2);

    filterConcepts(collection);

    t.is(collection.getList().length, 1);
    t.is(collection.getList()[0].actor.name, 'Name');
});

test('filter child concept by type', t => {

    const collection = new EConceptCollection();
    const lang = 'ro';
    const concepts = [EConcept.create(new Concept({ value: 'Republica Moldova', index: 1, lang }), 'ro', 'md'), EConcept.create(new Concept({ value: 'Moldova', index: 100, lang }), 'ro', 'md')];
    concepts[0].setChilds([concepts[1]]);

    collection.add(concepts);
    concepts[0].type = ActorType.PERSON;

    t.is(collection.getList().length, 2);

    filterConcepts(collection);

    t.is(collection.getList().length, 1);
    t.is(collection.getList()[0].type, 'PERSON');
});
