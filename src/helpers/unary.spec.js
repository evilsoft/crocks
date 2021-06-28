const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const unary = require('./unary')

test('unary helper', t => {
  const f = bindFunc(unary)

  const err = /unary: Argument must be a Function/
  t.throws(f(undefined), err, 'throws with undefined')
  t.throws(f(null), err, 'throws with null')
  t.throws(f(0), err, 'throws with falsey number')
  t.throws(f(1), err, 'throws with truthy number')
  t.throws(f(''), err, 'throws with falsey string')
  t.throws(f('string'), err, 'throws with truthy string')
  t.throws(f(false), err, 'throws with false')
  t.throws(f(true), err, 'throws with true')
  t.throws(f({}), err, 'throws with object')
  t.throws(f([]), err, 'throws with array')
  const fn = unary((x, y, z) => ({ x: x, y: y, z: z }))

  t.same(fn(1, 2, 3), { x: 1, y: undefined, z: undefined }, 'only applies first argument to function')

  t.end()
})
