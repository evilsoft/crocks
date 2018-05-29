/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const isFunction = require('../core/isFunction')

function mapAll(...parts) {
  parts.forEach(fn => {
    if (!isFunction(fn)) {
      throw new TypeError('mapAll: All arguments must be Functions')
    }
  })

  return m => {
    if(!(m && isFunction(m.mapAll))) {
      throw new TypeError('mapAll: Tuple required')
    }
    return m.mapAll(...parts)
  }
}

module.exports = mapAll
