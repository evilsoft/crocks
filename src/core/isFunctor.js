/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import hasAlg from './hasAlg.js'

// isFunctor : a -> Boolean
function isFunctor(m) {
  return !!m && hasAlg('map', m)
}

export default isFunctor
