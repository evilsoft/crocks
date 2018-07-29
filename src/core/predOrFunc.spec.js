import test from 'tape'
import sinon from 'sinon'

import isFunction from './isFunction'
import predOrFunc from './predOrFunc'

test('predOrFunc internal', t => {
  t.ok(isFunction(predOrFunc), 'is a function')

  const f = sinon.spy()
  const P = { runWith: sinon.spy() }

  predOrFunc(f, 'func')
  predOrFunc(P, 'pred')

  t.ok(f.calledWith('func'), 'calls the function, passing the argument')
  t.ok(P.runWith.calledWith('pred'), 'calls the `runWith` function on Pred, passing the argument')

  t.end()
})
