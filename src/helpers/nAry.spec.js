const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const nAry = require('./nAry')

test('nAry helper function', t => {
  const f = bindFunc(nAry)

  const noNum = /nAry: Number required for first argument/
  t.throws(f(undefined, unit), noNum, 'throws with undefined as first arg')
  t.throws(f(null, unit), noNum, 'throws with null as first arg')
  t.throws(f('', unit), noNum, 'throws with falsey string as first arg')
  t.throws(f('string', unit), noNum, 'throws with truthy string as first arg')
  t.throws(f(false, unit), noNum, 'throws with false as first arg')
  t.throws(f(true, unit), noNum, 'throws with true as first arg')
  t.throws(f({}, unit), noNum, 'throws with object as first arg')
  t.throws(f([], unit), noNum, 'throws with array as first arg')
  t.throws(f(unit, unit), noNum, 'throws with function as first arg')

  const noFunc = /nAry: Function required for second argument/
  t.throws(f(0, undefined), noFunc, 'throws with undefined as second arg')
  t.throws(f(0, null), noFunc, 'throws with null as second arg')
  t.throws(f(0, 0), noFunc, 'throws with falsey number as second arg')
  t.throws(f(0, 1), noFunc, 'throws with truthy number as second arg')
  t.throws(f(0, ''), noFunc, 'throws with falsey string as second arg')
  t.throws(f(0, 'string'), noFunc, 'throws with truthy string as second arg')
  t.throws(f(0, false), noFunc, 'throws with false as second arg')
  t.throws(f(0, true), noFunc, 'throws with true as second arg')
  t.throws(f(0, {}), noFunc, 'throws with object as second arg')
  t.throws(f(0, []), noFunc, 'throws with array as second arg')

  t.ok(isFunction(nAry(0, unit)), 'returns a function')

  const fn = (x, y, z) => ({ x: x, y: y, z: z })

  const none = nAry(0, fn)
  const unary = nAry(1, fn)
  const binary = nAry(2, fn)
  const trinary = nAry(3, fn)

  t.same(none(1, 2, 3), { x: undefined, y: undefined, z: undefined }, 'nAry of zero passes none of the arguments')
  t.same(unary(1, 2, 3), { x: 1, y: undefined, z: undefined }, 'nAry of one passes one of the arguments')
  t.same(binary(1)(2, 3), { x: 1, y: 2, z: undefined }, 'nAry of two passes two of the arguments')
  t.same(trinary(1)(2)(3, 4, 5), { x: 1, y: 2, z: 3 }, 'nAry of three passes three of the arguments')

  t.end()
})
