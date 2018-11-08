/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../core/isFunction')
const isIterable = require('../core/isIterable')

const { Nothing, Just } = require('../core/Maybe')

function head(m) {
  if(m && isFunction(m.head)) {
    return m.head()
  }

  if(isIterable(m)) {
    const iterator = m[Symbol.iterator]()
    const head = iterator.next()

    return head.done ? Nothing() : Just(head.value)
  }

  throw new TypeError('head: Array, String or List required')
}

module.exports = head
