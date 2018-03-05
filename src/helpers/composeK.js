/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isChain = require('../core/isChain')
const isFunction = require('../core/isFunction')

const err = 'composeK: Chain returning functions of the same type required'

// composeK : Chain m => ((y -> m z), (x -> m y), ..., (a -> m b)) -> a -> m z
function composeK(...args) {
  if(!arguments.length) {
    throw new TypeError(err)
  }

  const fns =
    args.slice().reverse()

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
  }, x => x)

  return function() {
    return tail(head.apply(null, arguments))
  }
}

module.exports = composeK
