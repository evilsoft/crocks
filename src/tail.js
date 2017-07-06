/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./core/isFunction')

const M = require('./core/Maybe')

function tail(m) {
  if(isFunction(m.tail)) {
    return m.tail()
  }
  else if(isFunction(m.slice)) {
    return m.length < 2
      ? M.Nothing()
      : M.Just(m.slice(1))
  }

  throw new TypeError('tail: Array, String or List required')
}

module.exports = tail
