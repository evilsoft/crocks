const test = require('tape')
const sinon = require('sinon')

const isFunction = require('./isFunction')
const predOrFunc = require('./predOrFunc')

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
