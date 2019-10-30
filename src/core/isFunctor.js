/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')

/** isFunctor :: a -> Boolean */
function isFunctor(m) {
  return !!m && hasAlg('map', m)
}

module.exports = isFunctor
