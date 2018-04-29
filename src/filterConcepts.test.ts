
import { identifyPartialConcepts, filterConcepts } from './filterConcepts';
import test from 'ava';
import { EConceptCollection, EConcept } from './conceptCollection';
import { Concept } from 'concepts-parser';

test('identifyPartialConcepts: ABBR', t => {

    const collection = new EConceptCollection();
    const concepts = [EConcept.create(new Concept({ value: 'Long Concept', index: 1 }), 'en', 'us'), EConcept.create(new Concept({ value: 'ABBR', index: 100 }), 'en', 'us')];
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
    const concepts = [EConcept.create(new Concept({ value: 'Long Concept', index: 1 }), 'en', 'us'), EConcept.create(new Concept({ value: 'Concept', index: 100 }), 'en', 'us')];

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
    const concepts = [EConcept.create(new Concept({ value: 'Long Concept', index: 1 }), 'en', 'us'), EConcept.create(new Concept({ value: 'Concept1', index: 100 }), 'en', 'us')];

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
    const concepts = [EConcept.create(new Concept({ value: 'Republica Moldova', index: 1 }), 'ro', 'md'), EConcept.create(new Concept({ value: 'Moldova', index: 100 }), 'ro', 'md')];
    concepts[0].setChilds([concepts[1]]);

    collection.add(concepts);
    collection.setActor(concepts[0].id, { id: 'id', name: 'Name' });
    collection.setActor(concepts[1].id, { id: 'id', name: 'Name' });

    t.is(collection.getList().length, 2);

    filterConcepts(collection);

    t.is(collection.getList().length, 1);
    t.is(collection.getList()[0].actor.name, 'Name');
});
