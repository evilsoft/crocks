/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

function maybe(m) {
  if(!(m && isFunction(m.maybe))) {
    throw new TypeError('maybe: Maybe required')
  }

  return m.maybe()
}

module.exports = maybe
