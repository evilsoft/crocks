import test from 'tape'
import sinon from 'sinon'

import isFunction from './isFunction'
import fl from './flNames'

const constant = x => () => x
const identity = x => x

import hasAlg from './hasAlg'

test('hasAlg', t => {
  t.ok(isFunction(hasAlg), 'is a function')

  const inst = { map: identity, nope: false }

  t.equal(hasAlg('map', inst), true, 'returns true when alg is a function on the instance')
  t.equal(hasAlg('contramap', inst), false, 'returns false when alg is not on the instance')
  t.equal(hasAlg('nope', inst), false, 'returns false when alg is not a function on the instance')

  t.end()
})

test('hasAlg fantasy-land', t => {
  const keys = Object.keys(fl)

  t.plan(keys.length * 2)

  keys.forEach(k => {
    const inst = { [fl[k]]: identity }
    const noFunc = { [fl[k]]: true }

    t.ok(hasAlg(k, inst, `returns true for ${k}, when ${fl[k]} is a function`))
    t.notOk(hasAlg(k, noFunc, `returns false for ${k}, when ${fl[k]} is not a function`))
  })
})

test('hasAlg @@implements', t => {
  const arg = 'wut'
  const res = 'result'
  const func = sinon.spy(constant(res))
  const rep = { '@@implements': func }

  hasAlg(arg, rep)

  t.ok(func.calledWith(arg), 'calls the reps @@implements function, passing the arg')
  t.equals(!!func.firstCall.returnValue, !!res, 'returns the coerced boolean result of the @@implements function')

  t.end()
})
