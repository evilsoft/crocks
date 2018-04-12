/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isApplicative from '../core/isApplicative.js'
import isPlus from '../core/isPlus.js'

// isAlternative : a -> Boolean
function isAlternative(m) {
  return isPlus(m)
    && isApplicative(m)
}

export default isAlternative
