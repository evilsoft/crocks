/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

const curry = require('./curry')

const Either = require('../crocks/Either')

const Left = Either.Left
const Right = Either.Right

function tryCatch(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('tryCatch: Function required for first argument')
  }
  return function(x) {
    try { return Right(fn(x)) }
    catch(e) { return Left(e) }
  }
}

module.exports = curry(tryCatch)
