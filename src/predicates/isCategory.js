/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const hasAlg = require('../core/hasAlg')
const isSemigroupoid = require('../core/isSemigroupoid')

// isCategory : a -> Boolean
function isCategory(m) {
  return isSemigroupoid(m)
    && (hasAlg('id', m) || hasAlg('id', m.constructor))
}

module.exports = isCategory
