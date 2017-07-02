const test = require('tape')
const helpers = require('../../test/helpers')

const makeFake = helpers.makeFake

const identity = require('./identity')
const isFunction = require('./isFunction')

const isContravariant = require('./isContravariant')

test('isContravariant predicate function', t => {
  const Fake = makeFake([ 'contramap' ])
  const fake = Fake()

  t.ok(isFunction(isContravariant))

  t.equal(isContravariant(undefined), false, 'returns false for undefined')
  t.equal(isContravariant(null), false, 'returns false for null')
  t.equal(isContravariant(0), false, 'returns false for falsey number')
  t.equal(isContravariant(1), false, 'returns false for truthy number')
  t.equal(isContravariant(''), false, 'returns false for falsey string')
  t.equal(isContravariant('string'), false, 'returns false for truthy string')
  t.equal(isContravariant(false), false, 'returns false for false')
  t.equal(isContravariant(true), false, 'returns false for true')
  t.equal(isContravariant({}), false, 'returns false for an object')
  t.equal(isContravariant(identity), false, 'returns false for function')

  t.equal(isContravariant(Fake), true, 'returns true when a Contravariant Functor Constructor is passed')
  t.equal(isContravariant(fake), true, 'returns true when a Contravariant Functor is passed')

  t.end()
})
