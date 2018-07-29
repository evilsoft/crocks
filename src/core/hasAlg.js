/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from './isFunction'
import fl from './flNames'

const check = (alg, m) =>
  isFunction(m[fl[alg]]) || isFunction(m[alg])

const checkImpl = (alg, m) =>
  isFunction(m['@@implements']) && !!m['@@implements'](alg)

const hasAlg = (alg, m) =>
  !!m && (check(alg, m) || checkImpl(alg, m))

export default hasAlg
