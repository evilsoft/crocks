const test = require('tape')

const Pred = require('./Pred')
const isNumber = require('./isNumber')
const unit = require('./_unit')
const isPredOrFunc = require('./isPredOrFunc')

const isLargeNumber =
  Pred(isNumber)
    .concat(Pred(x => x > 100))

test('isPredOrFunc core', t => {
  t.equal(typeof isPredOrFunc, 'function', 'is a function')

  t.equal(isPredOrFunc(unit), true, 'returns true when passed a function')
  t.equal(isPredOrFunc(isLargeNumber), true, 'returns true when passed an predicate')

  t.equal(isPredOrFunc(undefined), false, 'returns false when passed undefined')
  t.equal(isPredOrFunc(null), false, 'returns false when passed null')
  t.equal(isPredOrFunc(0), false, 'returns false when passed a falsey number')
  t.equal(isPredOrFunc(1), false, 'returns false when passed a truthy number')
  t.equal(isPredOrFunc(''), false, 'returns false when passed a falsey string')
  t.equal(isPredOrFunc('string'), false, 'returns false when passed a truthy string')
  t.equal(isPredOrFunc(false), false, 'returns false when passed false')
  t.equal(isPredOrFunc(true), false, 'returns false when passed true')
  t.equal(isPredOrFunc([]), false, 'returns false when passed an array')
  t.equal(isPredOrFunc({}), false, 'returns false when passed an object')

  t.end()
})
