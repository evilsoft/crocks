const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const identity = require('./core/identity')
const isFunction = require('./core/isFunction')

const isSetoid = require('./isSetoid')

test('isSetoid predicate function', t => {
  const Fake = makeFake([ 'equals' ])
  const fake = Fake()

  t.ok(isFunction(isSetoid))

  t.equal(isSetoid(undefined), false, 'returns false for undefined')
  t.equal(isSetoid(null), false, 'returns false for null')
  t.equal(isSetoid(''), false, 'returns false for falsey string')
  t.equal(isSetoid('string'), false, 'returns false for truthy string')
  t.equal(isSetoid(0), false, 'returns false for falsey number')
  t.equal(isSetoid(1), false, 'returns false for truthy number')
  t.equal(isSetoid(false), false, 'returns false for false')
  t.equal(isSetoid(true), false, 'returns false for true')
  t.equal(isSetoid([]), false, 'returns false for an array')
  t.equal(isSetoid({}), false, 'returns false for an object')
  t.equal(isSetoid(identity), false, 'returns false for function')

  t.equal(isSetoid(Fake), true, 'returns true when a Setoid Constructor is passed')
  t.equal(isSetoid(fake), true, 'returns true when a Setoid is passed')

  t.end()
})
