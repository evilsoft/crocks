const test = require('tape')

const object= require('./object')

const filter = object.filter

test('object filter functionality', t => {
  const obj = { a: 'cat', b: 'great', d: 'dog' }
  const fn = x => x.length > 3

  t.same(filter(fn, obj), { b: 'great' }, 'filters as expected when populated')
  t.same(filter(fn, {}), {}, 'filters as expected when empty')
  t.end()
})
