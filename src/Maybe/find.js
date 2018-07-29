/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

import { proxy } from '../core/types'

import curry from '../core/curry'
import { Just, Nothing } from '.'

import predOrFunc from '../core/predOrFunc'

import isFunction from '../core/isFunction'
import isFoldable from '../core/isFoldable'
import isSameType from '../core/isSameType'

const Pred = proxy('Pred')

const accumulator = fn => (acc, cur) =>
  !acc.found && predOrFunc(fn, cur) ? { found: true, value: cur } : acc

// find :: Foldable f => ((a -> Boolean) | Pred) -> f a -> Maybe a
function find(fn, foldable) {
  if(!isFunction(fn) && !isSameType(Pred, fn)) {
    throw new TypeError('find: Pred or a predicate function is required for first argument')
  }

  if(!isFoldable(foldable)) {
    throw new TypeError('find: Foldable required for second argument')
  }

  const result = foldable.reduce(accumulator(fn), { found: false })

  return result.found ? Just(result.value) : Nothing()
}

export default curry(find)
