/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('../core/hasAlg')

// isSetoid : a -> Boolean
function isSetoid(m) {
  return !!m
    && hasAlg('equals', m)
}

module.exports = isSetoid

