/** @license ISC License (c) copyright 2019 original and current authors */
/** @author RichardForrester */

const isFunction = require('../core/isFunction')
const isNil = require('../core/isNil')

const { Nothing, Just } = require('../core/Maybe')

function init(m) {
  if(!isNil(m)) {
    if(isFunction(m.init)) {
      return m.init()
    }

    if(isFunction(m.slice)) {
      return m.length < 2
        ? Nothing()
        : Just(m.slice(0, -1))
    }
  }

  throw new TypeError('init: Argument must be an Array, String, or List')
}

module.exports = init
