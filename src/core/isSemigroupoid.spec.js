const test = require('tape')
const helpers = require('../../test/helpers')

const makeFake = helpers.makeFake

const identity = require('./identity')
const isFunction = require('./isFunction')

const isSemigroupoid = require('./isSemigroupoid')

test('isSemigroupoid predicate function', t => {
  const Fake = makeFake([ 'compose' ])
  const fake = Fake()

  t.ok(isFunction(isSemigroupoid))

  t.equal(isSemigroupoid(undefined), false, 'returns false for undefined')
  t.equal(isSemigroupoid(null), false, 'returns false for null')
  t.equal(isSemigroupoid(0), false, 'returns false for falsey number')
  t.equal(isSemigroupoid(1), false, 'returns false for truthy number')
  t.equal(isSemigroupoid(''), false, 'returns false for falsey string')
  t.equal(isSemigroupoid('string'), false, 'returns false for truthy string')
  t.equal(isSemigroupoid(false), false, 'returns false for false')
  t.equal(isSemigroupoid(true), false, 'returns false for true')
  t.equal(isSemigroupoid([]), false, 'returns false for an array')
  t.equal(isSemigroupoid({}), false, 'returns false for an object')
  t.equal(isSemigroupoid(identity), false, 'returns false for function')

  t.equal(isSemigroupoid(Fake), true, 'returns true when a Semigroupoid Constructor is passed')
  t.equal(isSemigroupoid(fake), true, 'returns true when a Semigroupoid is passed')

  t.end()
})
