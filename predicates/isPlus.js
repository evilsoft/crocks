/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isAlt = require('./isAlt')

// isPlus : a -> Boolean
function isPlus(m) {
  return isAlt(m)
    && _hasAlg('zero', m)
}

module.exports = isPlus
