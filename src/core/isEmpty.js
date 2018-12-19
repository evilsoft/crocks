/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */
const isObject = require('./isObject')
const isMonoid = require('./isMonoid')
const equals = require('./equals')

function isEmpty(x) {
  if(isMonoid(x)) {
    return equals(x, x.empty())
  }

  if(isObject(x)) {
    return !Object.keys(x).length
  }

  if(x && x.length !== undefined) {
    return !x.length
  }

  return true
}

module.exports = isEmpty
