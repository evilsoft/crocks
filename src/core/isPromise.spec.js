const test = require('tape')

const isFunction = require('./isFunction')
const unit = require('./_unit')

const isPromise = require('./isPromise')

test('isPromise core', t => {
  t.ok(isFunction(isPromise), 'is a function')

  t.equal(isPromise(unit), false, 'returns false when passed a function')
  t.equal(isPromise(undefined), false, 'returns false when passed undefined')
  t.equal(isPromise(null), false, 'returns false when passed null')
  t.equal(isPromise(0), false, 'returns false when passed a falsey number')
  t.equal(isPromise(1), false, 'returns false when passed a truthy number')
  t.equal(isPromise(''), false, 'returns false when passed a falsey string')
  t.equal(isPromise('string'), false, 'returns false when passed a truthy string')
  t.equal(isPromise(false), false, 'returns false when passed false')
  t.equal(isPromise(true), false, 'returns false when passed true')
  t.equal(isPromise([]), false, 'returns false when passed an array')
  t.equal(isPromise({}), false, 'returns false when passed an object')

  const rejected = Promise.reject(0)
  rejected.catch(() => 'Handle promise rejection, avoid error.')

  t.equal(isPromise(Promise.resolve(0)), true, 'returns true when passed a resolved promise')
  t.equal(isPromise(rejected), true, 'returns true when passed a rejected promise')

  t.end()
})
