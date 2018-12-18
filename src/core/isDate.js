/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const hasAlg = require('./hasAlg')

// isDate : a -> Boolean
function isDate(x) {
  return hasAlg('valueOf', x) && x instanceof Date && !isNaN(x.valueOf())
}

module.exports = isDate

