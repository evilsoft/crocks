/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Henrique Limas */

const constant = require('../combinators/constant')
const curry = require('../core/curry')
const either = require('../pointfree/either')
const identity = require('../combinators/identity')
const isArray = require('../predicates/isArray')
const isNil = require('../predicates/isNil')
const propPath = require('../Maybe/propPath')

// propPathOr : a -> [ String | Integer ] -> b -> c
function propPathOr(def, keys, target) {
  if(!isArray(keys)) {
    throw new TypeError('propPathOr: Array of strings or integers required for second argument')
  }

  if(isNil(target)) {
    return def
  }

  return either(constant(def), identity, propPath(keys, target))
}

module.exports = curry(propPathOr)

