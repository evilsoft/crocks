/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const Maybe = require('./index')
const safe = require('./safe')

const isNil = require('../core/isNil')
const isFunction = require('../core/isFunction')
const isFoldable = require('../core/isFoldable')

// find :: Foldable f => ((a -> Boolean) | Pred) -> f a -> Maybe a
function find(fn, foldable) {
  if(!isFunction(fn)) {
    throw new TypeError('find: Function required for first argument')
  }

  if(isNil(foldable) && !isFoldable(foldable)) {
    return Maybe.Nothing()
  }

  return foldable
    .map(safe(fn))
    .reduce((acc, cur) => acc.alt(cur), Maybe.zero())
}

module.exports = curry(find)
