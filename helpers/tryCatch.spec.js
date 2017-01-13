const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const either = require('../pointfree/either')

const constant = require('../combinators/constant')

const tryCatch = require('./tryCatch')

test('tryCatch', t => {
  const f = bindFunc(tryCatch)

  t.ok(isFunction(tryCatch), 'is a function')

  t.throws(f(undefined), 'throws with undefined in first argument')
  t.throws(f(null), 'throws with null in first argument')
  t.throws(f(0), 'throws with falsey number in first argument')
  t.throws(f(1), 'throws with truthy number in first argument')
  t.throws(f(''), 'throws with falsey string in first argument')
  t.throws(f('string'), 'throws with truthy string in first argument')
  t.throws(f(false), 'throws with false in first argument')
  t.throws(f(true), 'throws with true in first argument')
  t.throws(f({}), 'throws with an object in first argument')
  t.throws(f([]), 'throws with an array in first argument')

  t.doesNotThrow(f(noop), 'allows a function in first argument')

  t.end()
})

test('tryCatch functionality', t => {
  const f = x => x
  const g = _ =>  { throw new Error('silly error') }

  const extract =
    either(constant('left'), constant('right'))

  const right = extract(tryCatch(f, null))
  const left = extract(tryCatch(g, null))

  t.equals(right, 'right', 'returns a Right when no error')
  t.equals(left, 'left', 'returns a Left when error')

  t.end()
})
