/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')

function branch(m) {
  if(!(m && isFunction(m.branch))) {
    throw new TypeError('branch: Arrow required')
  }

  return m.branch()
}

module.exports = branch
