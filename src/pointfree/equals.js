/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import _equals from '../core/equals'
import curry from '../core/curry'

function equals(x, y) {
  return _equals(x, y)
}

export default curry(equals)
