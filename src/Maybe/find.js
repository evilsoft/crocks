/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const { Nothing, resultToMaybe } = require('../core/Maybe')
const isNil = require('../core/isNil')
const isFunction = require('../core/isFunction')
const filter = require('../pointfree/filter')
const tryCatch = require('../Result/tryCatch')
const compose = require('../core/compose')

// find :: Foldable f => ((a -> Boolean) | Pred) -> f a -> Maybe a
function find(fn, foldable) {
  if(!isFunction(fn)) {
    throw new TypeError('find: Function required for first argument')
  }

  if(isNil(foldable)) {
    return Nothing()
  }

  const tryCatchAsMaybe = compose(resultToMaybe, tryCatch)

  return tryCatchAsMaybe(() => filter(fn, foldable))()
}

module.exports = curry(find)
