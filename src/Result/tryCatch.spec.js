const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Result = require('.')
const isFunction = require('../core/isFunction')
const equals = require('../core/equals')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const either =
  (f, g) => m => m.either(f, g)

const tryCatch = require('./tryCatch')

test('tryCatch', t => {
  const f = bindFunc(tryCatch)

  t.ok(isFunction(tryCatch), 'is a function')

  const err = /tryCatch: Function required for first argument/
  t.throws(f(undefined), err, 'throws with undefined in first argument')
  t.throws(f(null), err, 'throws with null in first argument')
  t.throws(f(0), err, 'throws with falsey number in first argument')
  t.throws(f(1), err, 'throws with truthy number in first argument')
  t.throws(f(''), err, 'throws with falsey string in first argument')
  t.throws(f('string'), err, 'throws with truthy string in first argument')
  t.throws(f(false), err, 'throws with false in first argument')
  t.throws(f(true), err, 'throws with true in first argument')
  t.throws(f({}), err, 'throws with an object in first argument')
  t.throws(f([]), err, 'throws with an array in first argument')

  t.doesNotThrow(f(unit), 'allows a function in first argument')

  t.end()
})

test('tryCatch functionality', t => {
  const msg = 'silly error'

  const f = x => x
  const g = () =>  { throw new Error(msg) }
  const extract =
    either(identity, constant('Ok'))

  const ok = tryCatch(f, null)
  const err = tryCatch(g, null)

  t.ok(isSameType(Result, ok), 'Non-error returns a Result')
  t.ok(isSameType(Result, err), 'Error returns a Result')

  const good = extract(ok)
  const bad = extract(err)

  t.equals(good, 'Ok', 'returns an Ok when no error')
  t.equals(bad.message, msg, 'returns an Err with error on error')

  const x = (a, b, c) => ({ a, b, c })

  const noncurried = tryCatch(x, 1,2,3).either(identity, identity)
  const curried = tryCatch(x, 1)(2)(3).either(identity, identity)

  t.equals(equals(noncurried, { a: 1, b: 2, c: 3 }), true, 'preserves the arity of the passed function')
  t.equals(equals(curried, { a: 1, b: 2, c: 3 }), true, 'returned function is curried')

  t.end()
})
