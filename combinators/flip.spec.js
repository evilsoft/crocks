const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const flip = require('./flip')

test('flip (C combinator)', t => {
  const f = bindFunc(flip)

  t.ok(isFunction(flip), 'is a function')

  t.throws(f(undefined, 0, 0), TypeError, 'throws when first arg is undefined')
  t.throws(f(null, 0, 0), TypeError, 'throws when first arg is null')
  t.throws(f(0, 0, 0), TypeError, 'throws when first arg is a falsey number')
  t.throws(f(1, 0, 0), TypeError, 'throws when first arg is a truthy number')
  t.throws(f('', 0, 0), TypeError, 'throws when first arg is a falsey string')
  t.throws(f('string', 0, 0), TypeError, 'throws when first arg is a truthy string')
  t.throws(f(false, 0, 0), TypeError, 'throws when first arg is false')
  t.throws(f(true, 0, 0), TypeError, 'throws when first arg is true')
  t.throws(f([], 0, 0), TypeError, 'throws when first arg is an array')
  t.throws(f({}, 0, 0), TypeError, 'throws when first arg is an object')

  const g = sinon.spy((x, y) => x - y)
  const x = 5 - 10

  const result = flip(g, 10, 5)

  t.equal(result, x, 'flips arguments')

  t.end()
})
