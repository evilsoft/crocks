const test = require('tape')

const isFunction = require('../predicates/isFunction')

const _implements = require('./implements')

test('implements', t => {
  t.ok(isFunction(_implements), 'is a function')

  const f = _implements([ 'bob' ])

  t.equal(f('bob'), true, 'returns true when value is in initial array')
  t.equal(f('joey'), false,'returns false when value is not in initial array')

  t.end()
})
