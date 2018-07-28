
import test from 'ava';
import { EConceptCollection, EConcept } from './concept-collection';

test('empty collection', t => {
    const collection = new EConceptCollection();

    t.truthy(collection.getList());
    t.truthy(collection.getMap());

    t.is(collection.getList().length, 0);
    t.is(collection.getMap().size, 0);
});

test('add', t => {
    const collection = new EConceptCollection();
    const concept = new EConcept('United States', 0, 'en', 'us');

    collection.add(concept);
    t.is(collection.getList().length, 1);
    t.is(collection.getMap().size, 1);

    collection.add(concept);
    t.is(collection.getList().length, 2);
    t.is(collection.getMap().size, 1);
});

test('removeById', t => {
    const collection = new EConceptCollection();
    const concept = new EConcept('United States', 0, 'en', 'us');

    collection.add(concept);
    collection.add(concept);
    t.is(collection.getList().length, 2);
    t.is(collection.getMap().size, 1);

    collection.removeById(concept.id);

    t.is(collection.getList().length, 0);
    t.is(collection.getMap().size, 0);
});

test('remove', t => {
    const collection = new EConceptCollection();
    const concept = new EConcept('United States', 0, 'en', 'us');

    collection.add(concept);
    collection.add(concept);
    t.is(collection.getList().length, 2);
    t.is(collection.getMap().size, 1);

    collection.remove(concept);

    t.is(collection.getList().length, 1);
    t.is(collection.getMap().size, 1);
});
