const test = require('tape')

const Last = require('../test/LastMonoid')
const isFunction = require('./isFunction')

const mconcatMap = require('./mconcatMap')

test('mconcatMap core', t => {
  t.ok(isFunction(mconcatMap), 'is a function')

  const addOne = x => x + 1
  const nothing = mconcatMap(Last, addOne, [])
  const something = mconcatMap(Last, addOne, [ 1, 2, 3 ])

  t.equal(nothing.value(), Last.empty().value(), 'returns the empty value when passed an empty array')
  t.equal(something.value(), 4, 'returns the last value by lifting and calling concat on each after running through map function')

  t.end()
})
