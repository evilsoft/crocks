/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const argsArray = require('../internal/argsArray')
const identity = require('../combinators/identity')
const isFunction = require('../predicates/isFunction')

function applyPipe(f, g) {
  return function() {
    return g.call(null, f.apply(null, argsArray(arguments)))
  }
}

// pipe : ((a -> b), (b -> c), ..., (y -> z)) -> a -> z
function pipe() {
  if(!arguments.length) {
    throw new TypeError('pipe: At least one function required')
  }

  const fns =
    argsArray(arguments)

  if(fns.filter(x => !isFunction(x)).length) {
    throw new TypeError('pipe: Only accepts functions')
  }

  const head =
    fns[0]

  const tail =
    fns.slice(1).concat(identity)

  return tail.reduce(applyPipe, head)
}

module.exports = pipe
