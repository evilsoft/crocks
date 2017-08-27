const test = require('tape')
const sinon = require('sinon')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const constant = require('../core/constant')
const unit = require('../core/_unit')

const mapReduce = require('./mapReduce')

test('mapReduce errors', t => {
  const m = bindFunc(mapReduce)

  const noMap = /mapReduce: Unary mapping function required for first argument/
  t.throws(m(undefined, unit, {}, []), noMap, 'throws with undefined as map function')
  t.throws(m(null, unit, {}, []), noMap, 'throws with null as map function')
  t.throws(m(0, unit, {}, []), noMap, 'throws with falsey number as map function')
  t.throws(m(1, unit, {}, []), noMap, 'throws with truthy number as map function')
  t.throws(m('', unit, {}, []), noMap, 'throws with falsey string as map function')
  t.throws(m('string', unit, {}, []), noMap, 'throws with truthy string as map function')
  t.throws(m(false, unit, {}, []), noMap, 'throws with false as map function')
  t.throws(m(true, unit, {}, []), noMap, 'throws with true as map function')
  t.throws(m({}, unit, {}, []), noMap, 'throws with object as map function')
  t.throws(m([], unit, {}, []), noMap, 'throws with array as map function')

  const noReduce = /mapReduce: Binary reduction function required for second argument/
  t.throws(m(unit, undefined, {}, []), noReduce, 'throws with undefined as reduce function')
  t.throws(m(unit, null, {}, []), noReduce, 'throws with null as reduce function')
  t.throws(m(unit, 0, {}, []), noReduce, 'throws with falsey number as reduce function')
  t.throws(m(unit, 1, {}, []), noReduce, 'throws with truthy number as reduce function')
  t.throws(m(unit, '', {}, []), noReduce, 'throws with falsey string as reduce function')
  t.throws(m(unit, 'string', {}, []), noReduce, 'throws with truthy string as reduce function')
  t.throws(m(unit, false, {}, []), noReduce, 'throws with false as reduce function')
  t.throws(m(unit, true, {}, []), noReduce, 'throws with true as reduce function')
  t.throws(m(unit, {}, {}, []), noReduce, 'throws with object as reduce function')
  t.throws(m(unit, [], {}, []), noReduce, 'throws with array as reduce function')

  const noFold = /mapReduce: Foldable required for fourth argument/
  t.throws(m(unit, unit, {}, undefined), noFold, 'throws with undefined as data')
  t.throws(m(unit, unit, {}, null), noFold, 'throws with null as data')
  t.throws(m(unit, unit, {}, 0), noFold, 'throws with falsey number as data')
  t.throws(m(unit, unit, {}, 1), noFold, 'throws with truthy number as data')
  t.throws(m(unit, unit, {}, ''), noFold, 'throws with falsey string as data')
  t.throws(m(unit, unit, {}, 'string'), noFold, 'throws with truthy string as data')
  t.throws(m(unit, unit, {}, false), noFold, 'throws with false as data')
  t.throws(m(unit, unit, {}, true), noFold, 'throws with true as data')
  t.throws(m(unit, unit, {}, {}), noFold, 'throws with object as data')

  t.end()
})

test('mapReduce functionality', t => {
  const mapFn = sinon.spy(constant('mapResult'))
  const reduceFn = sinon.spy(constant('reduceResult'))
  const empty = 'empty'
  const data = [ 'data' ]

  const result = mapReduce(mapFn, reduceFn, empty, data)

  const mapCall = mapFn.getCall(0)
  const reduceCall = reduceFn.getCall(0)

  t.ok(mapCall.calledWithExactly(data[0]), 'passes data elements to the mapping function')

  t.ok(
    reduceCall.calledWithExactly(empty, mapCall.returnValue),
    'passes the empty and mapping result to the reduction function'
  )

  t.equal(result, reduceCall.returnValue, 'returns the result of the reduction function')

  t.end()
})
