const test = require('tape')

const isFunction = require('./core/isFunction')
const isContravariant = require('./isContravariant')

test('isContravariant predicate', t => {
  t.ok(isFunction(isContravariant), 'is a function')
  t.end()
})
