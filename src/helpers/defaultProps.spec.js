const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const defaultProps = require('./defaultProps')

test('defaultProps', t => {
  const fn = bindFunc(defaultProps)

  const err = /defaultProps: Objects required for both arguments/
  t.throws(fn(undefined, {}), err, 'throws when first arg is undefined')
  t.throws(fn(null, {}), err, 'throws when first arg is null')
  t.throws(fn(0, {}), err, 'throws when first arg is a falsey number')
  t.throws(fn(1, {}), err, 'throws when first arg is a truthy number')
  t.throws(fn('', {}), err, 'throws when first arg is a falsey string')
  t.throws(fn('string', {}), err, 'throws when first arg is a truthy string')
  t.throws(fn(false, {}), err, 'throws when first arg is false')
  t.throws(fn(true, {}), err, 'throws when first arg is true')
  t.throws(fn(unit, {}), err, 'throws when first arg is a function')
  t.throws(fn([], {}), err, 'throws when first arg is an array')

  t.throws(fn({}, undefined), err, 'throws when second arg is undefined')
  t.throws(fn({}, null), err, 'throws when second arg is null')
  t.throws(fn({}, 0), err, 'throws when second arg is a falsey number')
  t.throws(fn({}, 1), err, 'throws when second arg is a truthy number')
  t.throws(fn({}, ''), err, 'throws when second arg is a falsey string')
  t.throws(fn({}, 'string'), err, 'throws when second arg is a truthy string')
  t.throws(fn({}, false), err, 'throws when second arg is false')
  t.throws(fn({}, true), err, 'throws when second arg is true')
  t.throws(fn({}, unit), err, 'throws when second arg is a function')
  t.throws(fn({}, []), err, 'throws when second arg is an array')

  const defs = {
    a: 'def', c: 'def', d: undefined, e: null, f: undefined
  }

  const data = {
    a: 'set', b: 'set', e: undefined, f: null, g: undefined
  }

  const result = defaultProps(defs, data)
  const keyExists =
    key => Object.keys(result).indexOf(key) !== -1

  const getValue =
    key => result[key]

  t.notOk(keyExists('d'), 'undefined values in defaults not included')
  t.notOk(keyExists('g'), 'undefined values in data not included')

  t.equals(getValue('a'), 'set', 'data value overwrites values from defaults')
  t.equals(getValue('b'), 'set', 'data value included when not on defalts')
  t.equals(getValue('c'), 'def', 'default value included when not on data')
  t.equals(getValue('e'), null, 'data value used when value undefined in defaults')
  t.equals(getValue('f'), null, 'data value used when value undefined in defaults')

  t.end()
})
