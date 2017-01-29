/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const prop = require('./prop')

const isInteger = require('../predicates/isInteger')
const isString = require('../predicates/isString')
const isArray = require('../predicates/isArray')

const Maybe = require('../crocks/Maybe')

// propPath : [ String | Number ] -> a -> Maybe b
function propPath(keys, target) {
  if(!isArray(keys)) {
    throw new TypeError('propPath: Array of strings or integers required for first argument')
  }

  return keys.reduce((maybe, key) => {
    if(!(isString(key) || isInteger(key))) {
      throw new TypeError('propPath: Array of strings or integers required for first argument')
    }
    return maybe.chain(prop(key))
  }, Maybe.of(target))
}

module.exports = curry(propPath)
