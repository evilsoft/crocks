/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../core/isFunction')
const curry = require('./curry')

const err = 'pipe: Functions required'

function applyPipe(f, g) {
  if(!isFunction(g)) {
    throw new TypeError(err)
  }

  return function(...args) {
    return g.call(null, f.apply(null, args))
  }
}

// pipe : ((a -> b), (b -> c), ..., (y -> z)) -> a -> z
function pipe(...fns) {
  if(!arguments.length) {
    throw new TypeError(err)
  }

  const head =
    fns[0]

  if(!isFunction(head)) {
    throw new TypeError(err)
  }

  const tail =
    fns.slice(1).concat(x => x)

  return curry(tail.reduce(applyPipe, head))
}

module.exports = pipe
