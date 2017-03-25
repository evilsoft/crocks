/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

const curry = require('./curry')

const Result = require('../crocks/Result')

const Err = Result.Err
const Ok = Result.Ok

function tryCatch(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('tryCatch: Function required for first argument')
  }
  return function(x) {
    try { return Ok(fn(x)) }
    catch(e) { return Err(e) }
  }
}

module.exports = curry(tryCatch)
