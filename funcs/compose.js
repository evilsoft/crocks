/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction  = require('../internal/isFunction')
const argsArray   = require('../internal/argsArray')

const pipe = require('./pipe')

// compose :: ...fns -> fn
function compose() {
  if(!arguments.length) {
    throw new TypeError('compose: At least one function required')
  }

  const fns = argsArray(arguments)

  if(fns.filter(x => !isFunction(x)).length) {
    throw new TypeError('compose: Only accepts functions')
  }

  return pipe.apply(null, fns.slice().reverse())
}

module.exports = compose
