
import test from 'ava';
import { getConcepts } from './get-concepts';

test('empty context text', t => {
    const collection = getConcepts({ lang: 'ro', country: 'ro', text: '' });
    t.is(collection.getList().length, 0);
})

test('no concepts in text', t => {
    const collection = getConcepts({ lang: 'ro', country: 'ro', text: 'simple lower case text' });
    t.is(collection.getList().length, 0);
})

test('no child concepts', t => {
    const collection = getConcepts({ lang: 'ro', country: 'ro', text: 'URSS nu mai exista. Romania, Rusia, SUA exista.' });
    const list = collection.getList();

    t.is(list.length, 4);

    t.is(list[0].value, 'URSS');
    t.is(list[1].value, 'Romania');
    t.is(list[2].value, 'Rusia');
    t.is(list[3].value, 'SUA');

    for (const concept of list) {
        t.falsy(concept.parentId);
    }
})

test('concepts with children', t => {
    const collection = getConcepts({ lang: 'ro', country: 'ro', text: 'Statele Unite ale Americii este si Statele Unite' });
    const list = collection.getList();
    t.is(list.length, 6);

    t.is(list[0].value, 'Statele Unite ale Americii');
    t.falsy(list[0].parentId);
    t.is(list[1].value, 'Statele Unite');
    t.is(list[1].parentId, list[0].id);
    t.is(list[2].value, 'Americii');
    t.is(list[2].parentId, list[0].id);
    t.is(list[3].value, 'Statele Unite');
    t.falsy(list[3].parentId);
    t.is(list[4].value, 'Statele');
    t.is(list[4].parentId, list[3].id);
    t.is(list[5].value, 'Unite');
    t.is(list[5].parentId, list[3].id);
})

test('Москва', t => {

    const collection = getConcepts({
        text: 'Власти Москва согласовали три митинга против пенсионной реформы',
        lang: 'ru',
        country: 'ru'
    });

    t.is(collection.getList().length, 1);
    t.is(collection.getList()[0].value, 'Москва');
})
