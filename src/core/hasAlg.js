/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

const hasAlg = (alg, m) =>
  isFunction(m[alg]) || (isFunction(m['@@implements']) && !!m['@@implements'](alg))

module.exports = hasAlg
