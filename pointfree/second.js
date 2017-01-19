/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

function second(m) {
  if(!(m && isFunction(m.second))) {
    throw new TypeError('second: Arrow required')
  }

  return m.second()
}

module.exports = second
