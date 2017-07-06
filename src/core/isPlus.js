/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isAlt = require('./isAlt')

// isPlus : a -> Boolean
function isPlus(m) {
  return isAlt(m)
    && hasAlg('zero', m)
}

module.exports = isPlus
