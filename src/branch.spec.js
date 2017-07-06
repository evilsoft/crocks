const test = require('tape')

const isFunction = require('./core/isFunction')
const merge = require('./core/merge')

const branch = require('./branch')

test('branch helper function', t => {
  const extract =
    m => merge((x, y) => [ x, y ], m)

  t.ok(isFunction(branch), 'is a function')

  t.equal(branch(3).type(), 'Pair', 'returns a Pair')

  t.same(extract(branch(undefined)), [ undefined, undefined ], 'undefined returns a Pair of undefined')
  t.same(extract(branch(null)), [ null, null ], 'undefined returns a Pair of null')
  t.same(extract(branch(0)), [ 0, 0 ], '0 returns a Pair of 0')
  t.same(extract(branch(1)), [ 1, 1 ], '1 returns a Pair of 1')
  t.same(extract(branch('')), [ '', '' ], 'empty string returns a Pair of empty strings')
  t.same(extract(branch('string')), [ 'string', 'string' ], '"string" returns a Pair of "string"')
  t.same(extract(branch(false)), [ false, false ], 'false returns a Pair of falses')
  t.same(extract(branch(true)), [ true, true ], 'true returns a Pair of trues')
  t.same(extract(branch([])), [ [], [] ], 'array returns a Pair of arrays')
  t.same(extract(branch({})), [ {}, {} ], 'object returns a Pair of objects')

  t.end()
})
