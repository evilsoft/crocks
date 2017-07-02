/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const argsArray = require('./core/argsArray')
const identity = require('./core/identity')
const isChain = require('./core/isChain')
const isFunction = require('./core/isFunction')

const err = 'pipeK: Chain returning functions of the same type required'

function pipeK(head) {
  if(!(arguments.length && isFunction(head))) {
    throw new TypeError(err)
  }

  if(arguments.length === 1) {
    return head
  }

  const fns =
    argsArray(arguments)

  const tail = fns.slice(1).reduce((comp, fn) => {
    if(!isFunction(fn)) {
      throw new TypeError(err)
    }

    return function(m) {
      if(!isChain(m)) {
        throw new TypeError(err)
      }
      return comp(m).chain(fn)
    }
  }, identity)

  return function() {
    return tail(head.apply(null, arguments))
  }
}

module.exports = pipeK
