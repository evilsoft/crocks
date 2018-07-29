import test from 'tape'

import identity from './identity'
import isFunction from '../core/isFunction'

test('identity (I combinator)', t => {
  const x = 'something'

  t.ok(isFunction(identity), 'is a function')
  t.equal(identity(x), x, 'returns the passed argument')

  t.end()
})
