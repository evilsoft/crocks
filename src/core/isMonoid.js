/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')
const isSemigroup = require('./isSemigroup')

/** isMonoid :: a -> Boolean */
function isMonoid(m) {
  return isSemigroup(m)
    && (hasAlg('empty', m) || hasAlg('empty', m.constructor))
}

module.exports = isMonoid
