/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const isIterable = require('../core/isIterable')
const isString = require('../core/isString')
const cloneIterable = require('../core/cloneIterable')

const { Nothing, Just } = require('../core/Maybe')

function head(m) {
  if(m && isFunction(m.head)) {
    return m.head()
  }

  if(isArray(m) || isString(m)) {
    return !m.length ? Nothing() : Just(m[0])
  }

  if(isIterable(m)) {
    const cloned = cloneIterable(m)
    const iterator = cloned[Symbol.iterator]()
    const head = iterator.next()

    return head.done ? Nothing() : Just(head.value)
  }

  throw new TypeError('head: List or iterable required')
}

module.exports = head
