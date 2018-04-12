/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from './isFunction.js'

const hasAlg = (alg, m) =>
  isFunction(m[alg]) || isFunction(m['@@implements']) && !!m['@@implements'](alg)

export default hasAlg
