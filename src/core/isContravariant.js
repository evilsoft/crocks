/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('./hasAlg')

// isContravariant : a -> Boolean
function isContravariant(m) {
  return !!m && hasAlg('contramap', m)
}

module.exports = isContravariant
