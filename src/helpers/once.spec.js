const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const once = require('./once')

test('once helper', t => {
  const f = bindFunc(once)

  t.ok(isFunction(once), 'is a function')

  t.throws(f(undefined), 'throws with undefined')
  t.throws(f(null), 'throws with null')
  t.throws(f(0), 'throws with falsey number')
  t.throws(f(1), 'throws with truthy number')
  t.throws(f(''), 'throws with falsey string')
  t.throws(f('string'), 'throws with truthy string')
  t.throws(f(false), 'throws with false')
  t.throws(f(true), 'throws with true')
  t.throws(f({}), 'throws with an object')
  t.throws(f([]), 'throws with an array')

  t.doesNotThrow(f(unit), 'allows a function')

  t.end()
})
