const test = require('tape')
const sinon = require('sinon')

const isFunction = require('./isFunction')
const apOrFunc = require('./apOrFunc')

const MockCrock = require('../test/MockCrock')

const oldFn = MockCrock.of

test('apOrFunc internal', t => {
  t.ok(isFunction(apOrFunc), 'is a function')

  const f = sinon.spy()
  MockCrock.of = sinon.spy()

  const fn = apOrFunc(f)
  const rep = apOrFunc(MockCrock)

  t.ok(isFunction(fn), 'calling with a function returns a function')
  t.ok(isFunction(rep), 'calling with a TypeRep returns a function')

  fn('func')
  rep('typerep')

  t.ok(f.calledWith('func'), 'calls the function, passing the argument')
  t.ok(MockCrock.of.calledWith('typerep'), 'calls `of` on the TypeRep, passing the argument')

  // reset mock
  MockCrock.of = oldFn

  t.end()
})
