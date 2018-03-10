/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const Pred = require('./types').proxy('Pred')
const isFunction = require('./isFunction')
const isSameType = require('./isSameType')

// isPredOrFunc :: (func | pred) -> bool
const isPredOrFunc = predOrFunc =>
  !!predOrFunc && (isFunction(predOrFunc) || isSameType(Pred, predOrFunc))

module.exports = isPredOrFunc
