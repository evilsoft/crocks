/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

import types from '../core/types.js'
const Pred = types.proxy('Pred')

import curry from '../core/curry.js'
import Maybe from './index.js'
const { Just, Nothing } = Maybe
import predOrFunc from '../core/predOrFunc.js'

import isFunction from '../core/isFunction.js'
import isFoldable from '../core/isFoldable.js'
import isSameType from '../core/isSameType.js'

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
