const test = require('tape')

const isFunction = require('../core/isFunction')
const laws = require('../test/laws.js')

const Unit = require('.')
const equals = require('../core/equals')

test('Unit crock', t => {
  t.ok(isFunction(Unit), 'is a function')
  t.end()
})

test('Unit applyTo properties (Apply)', t => {
  const apply = laws['fl/apply'](Unit)

  t.ok(apply.composition(equals, Unit.of(x => x * 3), Unit.of(x => x + 4), Unit.of(5)), 'composition')

  t.end()
})

test('Unit applyTo properties (Applicative)', t => {
  const applicative = laws['fl/applicative'](Unit)

  t.ok(applicative.identity(equals, 5), 'identity')
  t.ok(applicative.homomorphism(equals, x => x * 3, 18), 'homomorphism')
  t.ok(applicative.interchange(equals, Unit.of(x => x +10), 23), 'interchange')

  t.end()
})
