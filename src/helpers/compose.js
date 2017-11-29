/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../core/isFunction')

const err = 'compose: Functions required'

function applyPipe(f, g) {
  if(!isFunction(g)) {
    throw new TypeError(err)
  }

  return (...args) =>
    g.call(null, f.apply(null, args))
}

// compose : ((y -> z), (x -> y), ..., (a -> b)) -> a -> z
function compose(...args) {
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

  const tail =
    fns.slice(1).concat(x => x)

  return tail.reduce(applyPipe, head)
}

module.exports = compose
