/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const argsArray = require('./core/argsArray')
const identity = require('./core/identity')
const isFunction = require('./core/isFunction')

const err = 'compose: Functions required'

function applyPipe(f, g) {
  if(!isFunction(g)) {
    throw new TypeError(err)
  }

  return function() {
    return g.call(null, f.apply(null, argsArray(arguments)))
  }
}

// compose : ((y -> z), (x -> y), ..., (a -> b)) -> a -> z
function compose() {
  if(!arguments.length) {
    throw new TypeError(err)
  }

  const fns =
    argsArray(arguments).slice().reverse()

  const head =
    fns[0]

  if(!isFunction(head)) {
    throw new TypeError(err)
  }

  const tail =
    fns.slice(1).concat(identity)

  return tail.reduce(applyPipe, head)
}

module.exports = compose
