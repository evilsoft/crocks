const test = require('tape')
const sinon = require('sinon')
const helpers = require('../../test/helpers')
const bindFunc = helpers.bindFunc

const identity = require('../core/identity')
const isFunction = require('../core/isFunction')

const applyTo = require('./applyTo')

test('applyTo (A Combinator)', t => {
  const a =
    bindFunc(applyTo)

  const fn =
    sinon.spy(identity)

  t.ok(isFunction(applyTo), 'is a function')

  t.throws(a(undefined, 0), TypeError, 'throws when first arg is undefined')
  t.throws(a(null, 0), TypeError, 'throws when first arg is null')
  t.throws(a(0, 0), TypeError, 'throws when first arg is a falsey number')
  t.throws(a(1, 0), TypeError, 'throws when first arg is a truthy number')
  t.throws(a('', 0), TypeError, 'throws when first arg is a falsey string')
  t.throws(a('string', 0), TypeError, 'throws when first arg is a truthy string')
  t.throws(a(false, 0), TypeError, 'throws when first arg is false')
  t.throws(a(true, 0), TypeError, 'throws when first arg is true')
  t.throws(a([], 0), TypeError, 'throws when first arg is an array')
  t.throws(a({}, 0), TypeError, 'throws when first arg is an object')

  t.doesNotThrow(a(identity, 0), 'does not throw when first arg is a function')

  const x = 45
  const result  = applyTo(fn)(x)

  t.ok(fn.calledWith(x), 'passed function is called with the passed data')
  t.equal(result, fn.returnValues[0], 'returns the result of applying the data to the function')

  t.end()
})
