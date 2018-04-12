/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isArray from '../core/isArray.js'
import isFunction from '../core/isFunction.js'
import isString from '../core/isString.js'

const { Nothing, Just } = require('../core/Maybe')

function head(m) {
  if(m && isFunction(m.head)) {
    return m.head()
  }

  if(isArray(m) || isString(m)) {
    return !m.length
      ? Nothing()
      : Just(m[0])
  }

  throw new TypeError('head: Array, String or List required')
}

export default head
