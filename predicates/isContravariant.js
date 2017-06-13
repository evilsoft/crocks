/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')

// isContravariant : a -> Boolean
function isContravariant(m) {
  return !!m && _hasAlg('contramap', m)
}

module.exports = isContravariant
