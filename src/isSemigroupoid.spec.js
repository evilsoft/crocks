const test = require('tape')

const isFunction = require('./core/isFunction')
const isSemigroupoid = require('./isSemigroupoid')

test('isSemigroupoid predicate', t => {
  t.ok(isFunction(isSemigroupoid), 'is a function')
  t.end()
})
