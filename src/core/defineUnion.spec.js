const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('./isFunction')
const isObject = require('./isObject')

const defineUnion = require('./defineUnion')

test('defineUnion internal function', t => {
  const u = bindFunc(defineUnion)

  t.ok(isFunction(defineUnion), 'is a function')

  t.throws(u(undefined), TypeError, 'throws if arg is undefined')
  t.throws(u(null), TypeError, 'throws if arg is null')
  t.throws(u(0), TypeError, 'throws if arg is a falsey number')
  t.throws(u(1), TypeError, 'throws if arg is a truthy number')
  t.throws(u(''), TypeError, 'throws if arg is falsey string')
  t.throws(u('string'), TypeError, 'throws if arg is truthy string')
  t.throws(u(false), TypeError, 'throws if arg is false')
  t.throws(u(true), TypeError, 'throws if arg is true')
  t.throws(u([]), TypeError, 'throws if arg is an array')
  t.throws(u({}), TypeError, 'throws if arg is an empty object')

  t.throws(u({ good: [ 'a' ], bad: undefined }), TypeError, 'throws if definition object has an undefined value')
  t.throws(u({ good: [ 'a' ], bad: null }), TypeError, 'throws if definition object has a null value')
  t.throws(u({ good: [ 'a' ], bad: 0 }), TypeError, 'throws if definition object has a falsey number value')
  t.throws(u({ good: [ 'a' ], bad: 1 }), TypeError, 'throws if definition object has a truthy number value')
  t.throws(u({ good: [ 'a' ], bad: '' }), TypeError, 'throws if definition object has a falsey string value')
  t.throws(u({ good: [ 'a' ], bad: 'string' }), TypeError, 'throws if definition object has a truthy string value')
  t.throws(u({ good: [ 'a' ], bad: false }), TypeError, 'throws if definition object has a false value')
  t.throws(u({ good: [ 'a' ], bad: true }), TypeError, 'throws if definition object has a true value')
  t.throws(u({ good: [ 'a' ], bad: {} }), TypeError, 'throws if definition object has an object value')

  t.throws(u({ good: [ 'a' ], bad: [ 'a', undefined ] }), TypeError, 'throws if definition list contains an undefined')
  t.throws(u({ good: [ 'a' ], bad: [ 'a', null ] }), TypeError, 'throws if definition list contains a null')
  t.throws(u({ good: [ 'a' ], bad: [ 'a', 0 ] }), TypeError, 'throws if definition list contains a falsey number')
  t.throws(u({ good: [ 'a' ], bad: [ 'a', 1 ] }), TypeError, 'throws if definition list contains a truthy number')
  t.throws(u({ good: [ 'a' ], bad: [ 'a', '' ] }), TypeError, 'throws if definition list contains a falsey string')
  t.throws(u({ good: [ 'a' ], bad: [ 'a',  false ] }), TypeError, 'throws if definition list contains a false')
  t.throws(u({ good: [ 'a' ], bad: [ 'a',  true ] }), TypeError, 'throws if definition list contains a true')
  t.throws(u({ good: [ 'a' ], bad: [ 'a',  {} ] }), TypeError, 'throws if definition list contains an object')
  t.throws(u({ good: [ 'a' ], bad: [ 'a',  [] ] }), TypeError, 'throws if definition list contains an array')

  t.doesNotThrow(u({ Some: [ 'a' ] }), 'allows definitions of string lists')

  t.end()
})

test('defineUnion resulting type', t => {
  const u = defineUnion({ None: [], One: [ 'a' ] })

  t.ok(isObject(u), 'returns an object')

  t.ok(isFunction(u.caseOf), 'provides a caseOf function')
  t.ok(isFunction(u.None), 'provides a `None` constructor')
  t.ok(isFunction(u.One), 'provides a `One` constructor')

  t.end()
})
