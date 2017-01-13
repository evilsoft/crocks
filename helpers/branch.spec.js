const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const branch = require('./branch')

test('branch function', t => {
  t.ok(isFunction(branch), 'is a function')

  t.equal(branch(3).type(), 'Pair', 'returns a Pair')

  t.same(branch(undefined).value(), [ undefined, undefined ], 'undefined returns a Pair of undefined')
  t.same(branch(null).value(), [ null, null ], 'undefined returns a Pair of null')
  t.same(branch(0).value(), [ 0, 0 ], '0 returns a Pair of 0')
  t.same(branch(1).value(), [ 1, 1 ], '1 returns a Pair of 1')
  t.same(branch('').value(), [ '', '' ], 'empty string returns a Pair of empty strings')
  t.same(branch('string').value(), [ 'string', 'string' ], '"string" returns a Pair of "string"')
  t.same(branch(false).value(), [ false, false ], 'false returns a Pair of falses')
  t.same(branch(true).value(), [ true, true ], 'true returns a Pair of trues')
  t.same(branch([]).value(), [ [], [] ], 'array returns a Pair of arrays')
  t.same(branch({}).value(), [ {}, {} ], 'object returns a Pair of objects')

  t.end()
})
