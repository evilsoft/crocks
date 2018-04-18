/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from '../core/isFunction.js'
import isNil from '../core/isNil.js'

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

export default tail
