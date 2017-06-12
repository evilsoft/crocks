/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isPlus = require('./isPlus')
const isApplicative = require('./isApplicative')

// isAlternative : a -> Boolean
function isAlternative(m) {
  return isPlus(m)
    && isApplicative(m)
}

module.exports = isAlternative
