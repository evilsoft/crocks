const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const identity = require('./core/identity')
const isFunction = require('./core/isFunction')

const composeB = require('./composeB')

test('composeB (B combinator)', t => {
  const b = bindFunc(composeB)

  t.ok(isFunction(composeB), 'is a function')

  t.throws(b(undefined, identity, 0), TypeError, 'throws when first arg is undefined')
  t.throws(b(null, identity, 0), TypeError, 'throws when first arg is null')
  t.throws(b(0, identity, 0), TypeError, 'throws when first arg is a falsey number')
  t.throws(b(1, identity, 0), TypeError, 'throws when first arg is a truthy number')
  t.throws(b('', identity, 0), TypeError, 'throws when first arg is a falsey string')
  t.throws(b('string', identity, 0), TypeError, 'throws when first arg is a truthy string')
  t.throws(b(false, identity, 0), TypeError, 'throws when first arg is false')
  t.throws(b(true, identity, 0), TypeError, 'throws when first arg is true')
  t.throws(b([], identity, 0), TypeError, 'throws when first arg is an array')
  t.throws(b({}, identity, 0), TypeError, 'throws when first arg is an object')

  t.throws(b(identity, undefined, 0), TypeError, 'throws when second arg is undefined')
  t.throws(b(identity, null, 0), TypeError, 'throws when second arg is null')
  t.throws(b(identity, 0, 0), TypeError, 'throws when second arg is a falsey number')
  t.throws(b(identity, 1, 0), TypeError, 'throws when second arg is a truthy number')
  t.throws(b(identity, '', 0), TypeError, 'throws when second arg is a falsey string')
  t.throws(b(identity, 'string', 0), TypeError, 'throws when second arg is a truthy string')
  t.throws(b(identity, false, 0), TypeError, 'throws when second arg is false')
  t.throws(b(identity, true, 0), TypeError, 'throws when second arg is true')
  t.throws(b(identity, [], 0), TypeError, 'throws when second arg is an array')
  t.throws(b(identity, {}, 0), TypeError, 'throws when second arg is an object')

  t.ok(isFunction(composeB(identity)), 'curries with first function applied')
  t.ok(isFunction(composeB(identity, identity)), 'curries with second function applied')
  t.equals(composeB(identity, identity, 34), 34, 'can apply arg with composition')

  t.end()
})
