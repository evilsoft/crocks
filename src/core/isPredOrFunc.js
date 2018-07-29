/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

import types from './types'
const Pred = types.proxy('Pred')

import isFunction from './isFunction'
import isSameType from './isSameType'

// isPredOrFunc :: ((a -> b) | pred) -> bool
const isPredOrFunc = predOrFunc =>
  isFunction(predOrFunc) || isSameType(Pred, predOrFunc)

export default isPredOrFunc
