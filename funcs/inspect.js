/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isArray = require('../internal/isArray')
const isObject = require('../internal/isObject')
const isString = require('../internal/isString')
const isFunction = require('../internal/isFunction')

function arrayInspect(xs) {
  return xs.length
    ? xs.map(inspect).reduce((a, x) => a + ',' + x)
    : xs
}

function inspect(x) {
  if(x && isFunction(x.inspect)) {
    return ` ${x.inspect()}`
  }

  if(isFunction(x)) {
    return ' Function'
  }

  if(isArray(x)) {
    return ` [${arrayInspect(x) } ]`
  }

  if(isObject(x)) {
    return ' {}'
  }

  if(isString(x)) {
    return ` "${x}"`
  }

  return ` ${x}`
}

module.exports = inspect
