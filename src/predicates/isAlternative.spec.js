const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('../core/isFunction')

const identity = x => x

const isAlternative = require('./isAlternative')

test('isAlternative predicate function', t => {
  const Fake = makeFake([ 'alt', 'ap', 'map', 'of', 'zero' ])
  const fake = Fake()

  t.ok(isFunction(isAlternative))

  t.equal(isAlternative(undefined), false, 'returns false for undefined')
  t.equal(isAlternative(null), false, 'returns false for null')
  t.equal(isAlternative(0), false, 'returns false for falsey number')
  t.equal(isAlternative(1), false, 'returns false for truthy number')
  t.equal(isAlternative(''), false, 'returns false for falsey string')
  t.equal(isAlternative('string'), false, 'returns false for truthy string')
  t.equal(isAlternative(false), false, 'returns false for false')
  t.equal(isAlternative(true), false, 'returns false for true')
  t.equal(isAlternative({}), false, 'returns false for an object')
  t.equal(isAlternative([]), false, 'returns false for an array')
  t.equal(isAlternative(identity), false, 'returns false for function')

  t.equal(isAlternative(Fake), true, 'returns true when Alternative Constructor is passed')
  t.equal(isAlternative(fake), true, 'returns true when Alternative is passed')

  t.end()
})

test('isAlternative fantasy-land', t => {
  const Fake = makeFake([ 'alt', 'ap', 'map', 'of', 'zero' ], true)
  const fake = Fake()

  t.equal(isAlternative(Fake), false, 'returns true when Alternative Constructor is passed')
  t.equal(isAlternative(fake), true, 'returns true when Alternative is passed')

  t.end()
})
