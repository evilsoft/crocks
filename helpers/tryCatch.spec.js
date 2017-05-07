const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const either = require('../pointfree/either')

const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const Result = require('../crocks/Result')

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

  t.end()
})
