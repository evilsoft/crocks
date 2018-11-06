const test = require('tape')

const compose = require('./compose')

const object = require('./object')

const assign = object.assign
const filter = object.filter
const map = object.map
const set = object.set

const identity = x => x

test('object assign functionality', t => {
  const first = {
    a: 'first', c: 'first', d: undefined, e: null, f: undefined
  }

  const second = {
    a: 'second', b: 'second', e: undefined, f: null, g: undefined
  }

  const result = assign(first, second)
  const keyExists =
    key => Object.keys(result).indexOf(key) !== -1

  const getValue =
    key => result[key]

  t.notOk(keyExists('d'), 'undefined values in first arg not included')
  t.notOk(keyExists('g'), 'undefined values in second arg not included')

  t.equals(getValue('a'), 'first', 'first arg value overwrites values from second arg')
  t.equals(getValue('b'), 'second', 'second arg value included when not on first arg')
  t.equals(getValue('c'), 'first', 'first arg value included when not on second arg')
  t.equals(getValue('e'), null, 'second arg used when value undefined in first arg')
  t.equals(getValue('f'), null, 'first arg used when value undefined in second arg')

  t.end()
})

test('object filter functionality', t => {
  const obj = { a: 'cat', b: 'great', d: 'dog' }
  const fn = x => x.length > 3

  t.same(filter(fn, obj), { b: 'great' }, 'filters as expected when populated')
  t.same(filter(fn, {}), {}, 'filters as expected when empty')
  t.end()
})

test('object map functionality', t => {
  const m = {
    a: undefined, b: null,
    c: 0, d: 1,
    e: '', f: 'string',
    g: false, h: true,
    i: {}, j: []
  }

  t.same(map(identity, m), m, 'allows all values types')

  t.end()
})

test('object map properties (Functor)', t => {
  const m = { a: 23, b: 44, c: 99 }

  const f = x => x + 23
  const g = x => x * 2

  t.same(map(identity, m), m, 'identity')
  t.same(map(compose(f, g), m), map(f, map(g, m)), 'composition')

  t.end()
})

test('object set functionality', t => {
  const data = { a: 'string', b: false }

  t.same(set('c', 10, data), { a: 'string', b: false, c: 10 }, 'adds a new key when it does not exist')
  t.same(set('b', 10, data), { a: 'string', b: 10 }, 'overrides an existing key when it exists')

  t.end()
})
