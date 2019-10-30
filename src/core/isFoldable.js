/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')

/** isFoldable :: a -> Boolean */
function isFoldable(m) {
  return !!m
    && hasAlg('reduce', m)
}

module.exports = isFoldable
