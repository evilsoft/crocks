/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')

// isSetoid : a -> Boolean
function isSetoid(m) {
  return !!m
    && _hasAlg('equals', m)
}

module.exports = isSetoid

