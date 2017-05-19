/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */
const argsArray = require('../internal/argsArray')
const identity = require('../combinators/identity')
const isChain = require('../predicates/isChain')
const isFunction = require('../predicates/isFunction')

const err = 'composeK: Chain returning functions of the same type required'

function composeK() {
  if(!(arguments.length)) {
    throw new TypeError(err)
  }

  const fns =
    argsArray(arguments).slice().reverse()

  const head =
    fns[0]

  if(!isFunction(head)) {
    throw new TypeError(err)
  }

  if(fns.length === 1) {
    return head
  }

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

module.exports = composeK
