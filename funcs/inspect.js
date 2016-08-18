/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction  = require('../internal/isFunction')
const isObject    = require('../internal/isObject')
const isArray     = require('../internal/isArray')

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

  if(isObject(x)) {
    return ' {}'
  }

  if(isArray(x)) {
    return ` [${arrayInspect(x) } ]`
  }

  return ` ${x}`
}

module.exports = inspect
