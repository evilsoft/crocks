const test = require('tape')
const sinon = require('sinon')

const helpers = require('../test/helpers')

const noop = helpers.noop

const isFunction = require('../predicates/isFunction')
const predOrFunc = require('./predOrFunc')

test('predOrFunc internal', t => {
  t.ok(isFunction(predOrFunc), 'is a function')

  const f = sinon.spy()
  const P = { runWith: sinon.spy() }

  const withFunc = predOrFunc(f)
  const withPred = predOrFunc(P)

  t.ok(isFunction(withFunc), 'passing a function returns a function')
  t.ok(isFunction(withPred), 'passing a Pred returns a function')

  withFunc('func')
  withPred('pred')

  t.ok(f.calledWith('func'), 'calls the function, passing the argument')
  t.ok(P.runWith.calledWith('pred'), 'calls the `runWith` function on Pred, passing the argument')

  t.end()
})
