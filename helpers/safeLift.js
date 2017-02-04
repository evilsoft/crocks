/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const composeB = require('../combinators/composeB')
const curry = require('./curry')
const map = require('../pointfree/map')
const safe = require('./safe')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Pred = require('../crocks/Pred')

// safeLift : ((a -> Boolean) | Pred) -> (a -> b) -> a -> Maybe b
function safeLift(pred, fn) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('safeLift: Pred or predicate function required for first argument')
  }
  else if(!isFunction(fn)) {
    throw new TypeError('safeLift: Function required for second argument')
  }

  return composeB(map(fn), safe(pred))
}

module.exports = curry(safeLift)
