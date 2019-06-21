/** @license ISC License (c) copyright 2016 original and current authors */
/** @author RichardForrester */

const cloneIterable = require('../core/cloneIterable')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const isIterable = require('../core/isIterable')
const isString = require('../core/isString')

const { Nothing, Just } = require('../core/Maybe')

function last(m) {
  if (m && isFunction(m.last)) {
    return m.last()
  }

  if (isArray(m) || isString(m)) {
    return !m.length ? Nothing() : Just(m[m.length - 1])
  }

  if (isIterable(m)) {
    const cloned = cloneIterable(m)
    const iterator = cloned[Symbol.iterator]()

    let curr = iterator.next()

    if (curr.done) {
      return Nothing()
    }

    let val
    while (!curr.done) {
      val = curr.value
      curr = iterator.next()
    }

    return Just(val)
  }

  throw new TypeError('last: Argument should be a List, String, or Iterable')
}

module.exports = last
