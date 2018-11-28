const test = require('tape')

const cloneIterable = require('./cloneIterable')

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

test('cloneIterable Array', t => {
  const testArray = [ 1, 2, 3 ]
  const cloned = cloneIterable(testArray)
  const iterator = cloned[Symbol.iterator]()

  t.deepEqual(cloned, testArray)
  t.equal(iterator.next().value, 1)

  t.end()
})
