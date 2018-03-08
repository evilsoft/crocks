/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const Maybe = require('./index')
const predOrFunc = require('../core/predOrFunc')

const isNil = require('../core/isNil')
const isFunction = require('../core/isFunction')
const isFoldable = require('../core/isFoldable')

const accumulator = fn => (acc, cur) =>
  !acc.found && predOrFunc(fn, cur) ? { found: true, value: cur } : acc

// find :: Foldable f => ((a -> Boolean) | Pred) -> f a -> Maybe a
function find(fn, foldable) {
  if(!isFunction(fn)) {
    throw new TypeError('find: Function required for first argument')
  }

  if(isNil(foldable) && !isFoldable(foldable)) {
    return Maybe.Nothing()
  }

  const result = foldable.reduce(accumulator(fn), { found: false, value: undefined })

  return result.found ? Maybe.Just(result.value) : Maybe.Nothing()
}

module.exports = curry(find)
