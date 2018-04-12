/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

import types from './types.js'
const Pred = types.proxy('Pred')

import isFunction from './isFunction.js'
import isSameType from './isSameType.js'

// isPredOrFunc :: ((a -> b) | pred) -> bool
const isPredOrFunc = predOrFunc =>
  isFunction(predOrFunc) || isSameType(Pred, predOrFunc)

export default isPredOrFunc
