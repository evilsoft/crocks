import test from 'tape'

import isFunction from './isFunction'

import _implements from './implements'

test('implements', t => {
  t.ok(isFunction(_implements), 'is a function')

  const f = _implements([ 'bob' ])

  t.equal(f('bob'), true, 'returns true when value is in initial array')
  t.equal(f('joey'), false,'returns false when value is not in initial array')

  t.end()
})
