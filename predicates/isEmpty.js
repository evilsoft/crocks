/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */
const isObject = require('./isObject')

function isEmpty(x) {
  if(isObject(x)) {
    return !Object.keys(x).length
  }
  else if(x && x.length !== undefined) {
    return !x.length
  }
  else {
    return true
  }
}

module.exports = isEmpty
