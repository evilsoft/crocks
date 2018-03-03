/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const isString = require('../core/isString')

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

module.exports = head
