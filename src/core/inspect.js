/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isArray = require('./isArray')
const isFunction = require('./isFunction')
const isObject = require('./isObject')
const isString = require('./isString')

function arrayInspect(xs) {
  return xs.length
    ? xs.map(inspect).reduce((a, x) => a + ',' + x)
    : xs
}

// inspect : a -> String
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
