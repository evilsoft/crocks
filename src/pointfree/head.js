/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isArray from '../core/isArray'
import isFunction from '../core/isFunction'
import isIterable from '../core/isIterable'
import isString from '../core/isString'
import cloneIterable from '../core/cloneIterable'

import Maybe from '../core/Maybe'
const { Nothing, Just } = Maybe

export default function head(m) {
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
