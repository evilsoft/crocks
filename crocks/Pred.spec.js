const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')
const isObject = require('../internal/isObject')
const noop = helpers.noop

const Pred = require('./Pred')

test('Pred', t => {
  const p = bindFunc(Pred)

  t.ok(isFunction(Pred), 'is a function')

  t.ok(isFunction(Pred.type), 'provides a type function')

  t.ok(isObject(Pred(noop)), 'returns an object')

  t.throws(Pred, TypeError, 'throws with nothing')
  t.throws(p(undefined), TypeError, 'throws with undefined')
  t.throws(p(null), TypeError, 'throws with undefined')
  t.throws(p(0), TypeError, 'throws with falsey number')
  t.throws(p(1), TypeError, 'throws with truthy number')
  t.throws(p(''), TypeError, 'throws with falsey string')
  t.throws(p('string'), TypeError, 'throws with truthy string')
  t.throws(p(false), TypeError, 'throws with false')
  t.throws(p(true), TypeError, 'throws with true')
  t.throws(p({}), TypeError, 'throws with an object')
  t.throws(p([]), TypeError, 'throws with an array')

  t.end()
})
