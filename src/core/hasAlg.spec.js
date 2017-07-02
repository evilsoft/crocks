const test = require('tape')
const sinon = require('sinon')

const constant = require('./constant')
const identity = require('./identity')
const isFunction = require('./isFunction')

const hasAlg = require('./hasAlg')

test('hasAlg', t => {
  t.ok(isFunction(hasAlg), 'is a function')

  const inst = { map: identity, nope: false }

  t.equal(hasAlg('map', inst), true, 'returns true when alg is a function on the instance')
  t.equal(hasAlg('contramap', inst), false, 'returns false when alg is not on the instance')
  t.equal(hasAlg('nope', inst), false, 'returns false when alg is not a function on the instance')

  const arg = 'wut'
  const res = 'result'
  const func = sinon.spy(constant(res))
  const rep = { '@@implements': func }

  hasAlg(arg, rep)

  t.ok(func.calledWith(arg), 'calls the reps @@implements function, passing the arg')
  t.equals(!!func.firstCall.returnValue, !!res, 'returns the coerced boolean result of the @@implements function')

  t.end()
})
