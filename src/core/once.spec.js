import test from 'tape'
import sinon from 'sinon'

import isFunction from './isFunction'

const identity = x => x

import once from './once'

test('once core', t => {
  t.ok(isFunction(once), 'is a function')

  const inner = sinon.spy(identity)
  const fn = once(inner)
  const x = 'smiles'

  t.equals(fn(x), x, 'returns first value')
  t.equals(fn('another'), x, 'caches original value')
  t.ok(inner.calledOnce, 'only calls wrapped function once')

  t.end()
})
