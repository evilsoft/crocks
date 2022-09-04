/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */
const isObject = require('./isObject')
const isMonoid = require('./isMonoid')
const equals = require('./equals')
const fl = require('./flNames')

/** isEmpty :: a -> Boolean */
function isEmpty(x) {
  if(isMonoid(x)) {
    const empty = x.constructor[fl['empty']] || x.constructor['empty'] || x['empty']

    return equals(x, empty())
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
