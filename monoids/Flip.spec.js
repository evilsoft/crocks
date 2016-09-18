const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const Last = require('../test/LastMonoid')
const Flip = require('./Flip')

test('Flip', t => {
  const f = bindFunc(Flip)

  t.ok(isFunction(Flip), 'is a function')

  t.throws(f(), TypeError, 'throws when passed nothing')
  t.throws(f(undefined), TypeError, 'throws with undefined')
  t.throws(f(null), TypeError, 'throws with null')
  t.throws(f(0), TypeError, 'throws with falsey number')
  t.throws(f(1), TypeError, 'throws with truthy number')
  t.throws(f(''), TypeError, 'throws with falsey string')
  t.throws(f('string'), TypeError, 'throws with truthy string')
  t.throws(f(false), TypeError, 'throws with false')
  t.throws(f(true), TypeError, 'throws with true')
  t.throws(f({}), TypeError, 'throws with an object')
  t.throws(f([]), TypeError, 'throws with an array')

  t.end()
})

test('Flip result', t => {
  const m = Flip(Last)

  t.ok(isFunction(m), 'is a function')

  t.ok(isFunction(m.empty), 'provides an empty function')
  t.ok(isFunction(m.type), 'provides a type function')

  t.end()
})
