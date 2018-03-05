/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../core/isFunction')
const isNil = require('../core/isNil')

const { Nothing, Just } = require('../core/Maybe')

function tail(m) {
  if(!isNil(m)) {
    if(isFunction(m.tail)) {
      return m.tail()
    }

    if(isFunction(m.slice)) {
      return m.length < 2
        ? Nothing()
        : Just(m.slice(1))
    }
  }

  throw new TypeError('tail: Array, String or List required')
}

module.exports = tail
