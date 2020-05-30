/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApplicative = require('../core/isApplicative')
const isPlus = require('../core/isPlus')

/** isAlternative :: a -> Boolean */
function isAlternative(m) {
  return isPlus(m)
    && isApplicative(m)
}

module.exports = isAlternative
