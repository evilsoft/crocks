const test = require('tape')
const helpers = require('../test/helpers')
const isFunction  = require('../core/isFunction')

const bindFunc = helpers.bindFunc

const cloneIterable = require('./cloneIterable')

test('cloneIterable parameters', t => {
  const c = bindFunc(cloneIterable)

  t.ok(isFunction(cloneIterable), 'cloneIterable is a function')

  const err = /cloneIterable: Iterable required/
  t.throws(cloneIterable, err, 'throws Error when nothing passed')

  t.throws(c(undefined), err, 'throws when undefined passed')
  t.throws(c(null), err, 'throws when null passed')
  t.throws(c(0), err, 'throws when falsy number passed')
  t.throws(c(1), err, 'throws when truthy number passed')
  t.throws(c(false), err, 'throws when false passed')
  t.throws(c(true), err, 'throws when true passed')
  t.throws(c({}), err, 'throws when not Iterable object is passed')

  t.end()
})

test('cloneIterable arrays', t => {
  const empty = []
  const one = [ 1 ]
  const two = [ 2, 3 ]

  t.deepEqual(cloneIterable(empty), empty, 'returns a clone on empty array')
  t.notEqual(cloneIterable(empty), empty, 'returns not the same reference on empty array')
  t.deepEqual(cloneIterable(one), one, 'returns a clone on one element array')
  t.notEqual(cloneIterable(one), one, 'returns not the same reference on one element array')
  t.deepEqual(cloneIterable(two), two, 'returns a clone on one element array')
  t.notEqual(cloneIterable(two), two, 'returns not the same reference on two elements array')

  t.end()
})

test('cloneIterable string', t => {
  const empty = ''
  const one = 'a'
  const two = 'bc'

  t.equal(cloneIterable(empty), empty, 'returns a copy of the empty string')
  t.equal(cloneIterable(one), one, 'returns a copy of the one char string')
  t.equal(cloneIterable(two), two, 'returns a copy of the two char string')

  t.end()
})

test('cloneIterable shapes', t => {
  function First() { this.x = 42 }
  First.prototype.value = function() {
    return this.x
  }

  First.prototype[Symbol.iterator] = function() {
    return {
      next: () => {
        return {
          value: this.x,
          done: true
        }
      }
    }
  }

  const first = new First()

  t.deepEqual(cloneIterable(first), first, 'maintains same structure')
  t.notEqual(cloneIterable(first), first, 'returns a clone with the same structure')
  t.end()
})

test('cloneIterable symbols', t => {
  const firstSymbol = Symbol('first')
  const secondSymbol = Symbol('second')

  const first = {
    [Symbol.iterator]: () => {
      return {
        next: () => {
          return {
            done: true
          }
        }
      }
    },
    [firstSymbol]: 42,
    [secondSymbol]: () => {
      return 42
    }
  }

  t.deepEqual(cloneIterable(first), first, 'clone symbols properties')
  t.end()
})
