/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const Pred = require('./types').proxy('Pred')

const isFunction = require('./isFunction')
const isSameType = require('./isSameType')

/** isPredOrFunc :: ((a -> b) | pred) -> bool */
const isPredOrFunc = predOrFunc =>
  isFunction(predOrFunc) || isSameType(Pred, predOrFunc)

module.exports = isPredOrFunc
