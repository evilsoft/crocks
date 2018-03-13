/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const Pred = require('../core/types').proxy('Pred')

const curry = require('../core/curry')
const { Just, Nothing } = require('.')
const predOrFunc = require('../core/predOrFunc')

const isFunction = require('../core/isFunction')
const isFoldable = require('../core/isFoldable')
const isSameType = require('../core/isSameType')

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

module.exports = curry(find)
