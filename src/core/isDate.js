/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

// isDate : a -> Boolean
function isDate(x) {
  return Object.prototype.toString.apply(x) === '[object Date]'
    && !isNaN(x.valueOf())
}

module.exports = isDate

