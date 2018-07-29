import test from 'tape'
import { bindFunc } from '../test/helpers'

import Tuple from '.'

import { fromArray } from '../core/List'
import isArray from '../core/isArray'
import isFunction from '../core/isFunction'

const identity = x => x

import tupleToArray from './tupleToArray'

test('tupleToArray transform', t => {
  const f = bindFunc(tupleToArray)

  t.ok(isFunction(tupleToArray), 'is a function')

  t.throws(f(undefined), TypeError, 'throws if arg is undefined')
  t.throws(f(null), TypeError, 'throws if arg is null')
  t.throws(f(0), TypeError, 'throws if arg is a falsey number')
  t.throws(f(1), TypeError, 'throws if arg is a truthy number')
  t.throws(f(''), TypeError, 'throws if arg is a falsey string')
  t.throws(f('string'), TypeError, 'throws if arg is a truthy string')
  t.throws(f(false), TypeError, 'throws if arg is false')
  t.throws(f(true), TypeError, 'throws if arg is true')
  t.throws(f({}), TypeError, 'throws if arg is an object')
  t.throws(f(fromArray([ 1,2,3 ])), TypeError, 'throws if arg is a different crock')

  t.end()
})

test('tupleToArray with 3-Tuple', t => {
  const data = [ 24, { triple: 'tuple' }, '56' ]
  const Triple = Tuple(3)
  const triple = Triple(...data)

  const a = tupleToArray(triple)

  t.ok(isArray(a), 'returns an Array from Tuple')
  t.same(a, data, 'preserves the structure of underlying data')

  t.end()
})

test('tupleToArray with 4-Tuple', t => {
  const data = [ 24, { triple: 'tuple' }, '56', [ 1 ] ]
  const Tuple4 = Tuple(4)
  const tuple = Tuple4(...data)

  const a = tupleToArray(tuple)

  t.ok(isArray(a), 'returns an Array from Tuple')
  t.same(a, data, 'preserves the structure of underlying data')

  t.end()
})

test('tupleToArray with 5-Tuple', t => {
  const data = [ 25, { triple: 'tuple' }, '56', [ 1 ], 80 ]
  const Tuple5 = Tuple(5)
  const tuple = Tuple5(...data)

  const a = tupleToArray(tuple)

  t.ok(isArray(a), 'returns an Array from Tuple')
  t.same(a, data, 'preserves the structure of underlying data')

  t.end()
})

test('tupleToArray with 6-Tuple', t => {
  const data = [ 25, { triple: 'tuple' }, '66', [ 1 ], 80, 2 ]
  const Tuple6 = Tuple(6)
  const tuple = Tuple6(...data)

  const a = tupleToArray(tuple)

  t.ok(isArray(a), 'returns an Array from Tuple')
  t.same(a, data, 'preserves the structure of underlying data')

  t.end()
})

test('tupleToArray with 7-Tuple', t => {
  const data = [ 25, { triple: 'tuple' }, '77', [ 1 ], 80, 2, 3 ]
  const Tuple7 = Tuple(7)
  const tuple = Tuple7(...data)

  const a = tupleToArray(tuple)

  t.ok(isArray(a), 'returns an Array from Tuple')
  t.same(a, data, 'preserves the structure of underlying data')

  t.end()
})

test('tupleToArray with Tuple returning function', t => {
  const f = bindFunc(tupleToArray(identity))

  t.throws(f(undefined), TypeError, 'throws if function returns undefined')
  t.throws(f(null), TypeError, 'throws if function returns null')
  t.throws(f(0), TypeError, 'throws if function returns a falsey number')
  t.throws(f(1), TypeError, 'throws if function returns a truthy number')
  t.throws(f(''), TypeError, 'throws if function returns a falsey string')
  t.throws(f('string'), TypeError, 'throws if function returns a truthy string')
  t.throws(f(false), TypeError, 'throws if function returns false')
  t.throws(f(true), TypeError, 'throws if function returns true')
  t.throws(f({}), TypeError, 'throws if function returns an object')
  t.throws(f([]), TypeError, 'throws if function returns an array')

  const data = [ 24, { triple: 'tuple' }, '56' ]
  const Triple = Tuple(3)
  const triple = Triple(...data)

  const m = tupleToArray(identity, triple)

  t.ok(isArray(m), 'returns an Array from a function returning a Tuple')
  t.same(m, data, 'preserves the structure of underlying data')

  t.end()
})
