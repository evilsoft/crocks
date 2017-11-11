const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const fn =
  x => `from ${x}`

const mapProps = require('./mapProps')

test('mapProps errors', t => {
  const m = bindFunc(mapProps)

  const noObjs = /mapProps: Objects required for both arguments/
  t.throws(m(undefined, {}), noObjs, 'throws with undefined as first')
  t.throws(m(null, {}), noObjs, 'throws with null as first')
  t.throws(m(0, {}), noObjs, 'throws with falsey number as first')
  t.throws(m(1, {}), noObjs, 'throws with truthy number as first')
  t.throws(m('', {}), noObjs, 'throws with falsey string as first')
  t.throws(m('string', {}), noObjs, 'throws with truthy string as first')
  t.throws(m(false, {}), noObjs, 'throws with false as first')
  t.throws(m(true, {}), noObjs, 'throws with true as first')
  t.throws(m([], {}), noObjs, 'throws with array as first')

  t.throws(m({}, undefined), noObjs, 'throws with undefined as second')
  t.throws(m({}, null), noObjs, 'throws with null as second')
  t.throws(m({}, 0), noObjs, 'throws with falsey number as second')
  t.throws(m({}, 1), noObjs, 'throws with truthy number as second')
  t.throws(m({}, ''), noObjs, 'throws with falsey string as second')
  t.throws(m({}, 'string'), noObjs, 'throws with truthy string as second')
  t.throws(m({}, false), noObjs, 'throws with false as second')
  t.throws(m({}, true), noObjs, 'throws with true as second')
  t.throws(m({}, []), noObjs, 'throws with array as second')


  const noFunc = /mapProps: Object of functions required for first argument/
  t.throws(m({ a: '33' }, { a: 'apples' }), noFunc, 'throws when first argument does not contain a function')

  t.end()
})

test('mapProps functionality single level', t => {
  const fns = { a: fn, b: fn }

  const result =
    mapProps(fns, { a: 'a', c: 'c' })

  t.equals(result.a, 'from a', 'applys `a` function to a')
  t.equals(result.b, undefined, 'does map props that do not exist in data')
  t.equals(result.c, 'c', 'keeps props that do not have a map key')

  t.end()
})

test('mapProps functionality nested', t => {
  const fns = {
    a: fn,
    nested: { b: fn, c: fn },
    missing: { d: fn },
    noObj: { e: fn }
  }

  const obj = {
    a: 'a',
    nested: { b: 'nested-b' },
    noObj: 'noObj'
  }

  const result =
    mapProps(fns, obj)

  t.equals(result.a, 'from a', 'applys un nested functions as expected')
  t.equals(result.nested.b, 'from nested-b', 'applys nested functions')
  t.equals(result.nested.c, undefined, 'does map props that do not exist in data')
  t.equals(result.missing, undefined,  'keeps props that do not have a map key')
  t.equals(result.noObj, 'noObj',  'keeps props that do not have a map key')

  t.end()
})
