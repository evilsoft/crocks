/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isApplicative from '../core/isApplicative'
import isPlus from '../core/isPlus'

// isAlternative : a -> Boolean
export default function isAlternative(m) {
  return isPlus(m)
    && isApplicative(m)
}
