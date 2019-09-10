/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const Pred = require('../core/types').proxy('Pred')

const curry = require('../core/curry')
const predOrFunc = require('../core/predOrFunc')
const isFunction = require('../core/isFunction')
const isFoldable = require('../core/isFoldable')
const isSameType = require('../core/isSameType')

const { Just, Nothing } = require('.')

const accumulator = fn => (acc, cur) =>
  !acc.found && predOrFunc(fn, cur) ? { found: true, value: cur } : acc

// find :: Foldable f => ((a -> Boolean) | Pred) -> f a -> Maybe a
function find(fn, foldable) {
  if(!isFunction(fn) && !isSameType(Pred, fn)) {
    throw new TypeError('find: First argument must be a Pred or predicate')
  }

  if(!isFoldable(foldable)) {
    throw new TypeError('find: Second argument must be a Foldable')
  }

  const result = foldable.reduce(accumulator(fn), { found: false })

  return result.found ? Just(result.value) : Nothing()
}

module.exports = curry(find)
