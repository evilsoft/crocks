const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('./../core/isFunction')
const unit = require('./../core/_unit')

const Tuple = require('./index')

test('Tuple', t => {
  const f = bindFunc(Tuple)

  const noNum = /Tuple: Tuple size should be a number greater than 1/
  t.ok(isFunction(Tuple), 'is a function')

  t.throws(f(undefined), noNum, 'throws with undefined as first arg')
  t.throws(f(null), noNum, 'throws with null as first arg')
  t.throws(f(''), noNum, 'throws with falsey string as first arg')
  t.throws(f('string'), noNum, 'throws with truthy string as first arg')
  t.throws(f(false), noNum, 'throws with false as first arg')
  t.throws(f(true), noNum, 'throws with true as first arg')
  t.throws(f({}), noNum, 'throws with object as first arg')
  t.throws(f([]), noNum, 'throws with array as first arg')
  t.throws(f(unit), noNum, 'throws with function as first arg')
  t.throws(f(-1), noNum, 'throws with a number less than 1')
  t.throws(f(111), noNum, 'throws with a number greater than 10')

  t.ok(isFunction(Tuple(2)), 'returns a function for a valid size')
  t.end()
})
