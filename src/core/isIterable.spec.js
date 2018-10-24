const test = require('tape')

const isFunction = require('./isFunction')

const identity = x => x

const isIterable = require('./isIterable')

const testIterable = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    this.current = this.from
    return this
  },

  next() {
    if (this.current <= this.to) {
      return { done: false, value: this.current++ }
    }
    return { done: true }

  }
}

test('isIterable core', t => {
  t.ok(isFunction(isIterable))

  t.equal(isIterable(undefined), false, 'returns false for undefined')
  t.equal(isIterable(null), false, 'returns false for null')
  t.equal(isIterable(0), false, 'returns false for falsey number')
  t.equal(isIterable(1), false, 'returns false for truthy number')
  t.equal(isIterable(false), false, 'returns false for false')
  t.equal(isIterable(true), false, 'returns false for true')
  t.equal(isIterable({}), false, 'returns false for an object')
  t.equal(isIterable(identity), false, 'returns false for function')

  t.equal(isIterable([]), true, 'returns false for an array')
  t.equal(isIterable('string'), true, 'returns true for truthy string')
  t.equal(isIterable(testIterable), true, 'returns true for fake iterable string')

  t.end()
})
