const test = require('tape')

const isFunction = require('./isFunction')
const unit = require('./_unit')

const identity = x => x

test('unit core', t => {
  t.ok(isFunction(unit), 'is a function')

  t.equal(unit(), undefined, 'returns undefined when invoked with nothing')
  t.equal(unit(undefined), undefined, 'returns undefined when passed undefined')
  t.equal(unit(null), undefined, 'returns undefined when passed null')
  t.equal(unit(0), undefined, 'returns undefined when passed a falsey number')
  t.equal(unit(1), undefined, 'returns undefined when passed a truthy number')
  t.equal(unit(''), undefined, 'returns undefined when passed a falsey string')
  t.equal(unit('string'), undefined, 'returns undefined when passed a truthy string')
  t.equal(unit(false), undefined, 'returns undefined when passed a false')
  t.equal(unit(true), undefined, 'returns undefined when passed a true')
  t.equal(unit({}), undefined, 'returns undefined when passed an object')
  t.equal(unit([]), undefined, 'returns undefined when passed an array')
  t.equal(unit(identity), undefined, 'returns undefined when passed a function')

  t.end()
})
