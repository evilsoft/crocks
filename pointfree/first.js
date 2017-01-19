/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

function first(m) {
  if(!(m && isFunction(m.first))) {
    throw new TypeError('first: Arrow required')
  }

  return m.first()
}

module.exports = first
