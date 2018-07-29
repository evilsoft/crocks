import test from 'tape'
import sinon from 'sinon'

const identity = x => x

import compose from './compose'

test('compose core', t => {
  const f = sinon.spy(identity)
  const g = sinon.spy(identity)
  const x = 74

  const result = compose(f, g)(x)

  t.ok(f.calledAfter(g), 'calls second function before the first')
  t.ok(g.calledWith(x), 'third argument passed into second function')
  t.ok(f.calledWith(g.returnValues[0]), 'first function passed result of second function')
  t.equal(result, f.returnValues[0], 'returns the result of the first function')

  t.end()
})
