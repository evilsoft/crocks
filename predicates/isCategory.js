/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _hasAlg = require('../internal/hasAlg')
const isSemigroupoid = require('./isSemigroupoid')

// isCategory : a -> Boolean
function isCategory(m) {
  return isSemigroupoid(m)
    && _hasAlg('id', m)
}

module.exports = isCategory
