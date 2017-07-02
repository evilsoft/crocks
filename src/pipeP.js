/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const argsArray = require('./core/argsArray')
const identity = require('./core/identity')
const isFunction = require('./core/isFunction')
const isPromise = require('./core/isPromise')

const err = 'pipeP: Promise returning functions required'

function applyPipe(f, g) {
  if(!isFunction(g)) {
    throw new TypeError(err)
  }

  return function() {
    const p = f.apply(null, arguments)

    if(!isPromise(p)) {
      throw new TypeError(err)
    }

    return p.then(g)
  }
}

// pipeP : Promise p => ((a -> p b), (b -> p c), ..., (y -> p z)) -> a -> p z
function pipeP() {
  if(!arguments.length) {
    throw new TypeError(err)
  }

  const fns =
    argsArray(arguments)

  const head =
    fns[0]

  if(!isFunction(head)) {
    throw new TypeError(err)
  }

  const tail =
    fns.slice(1).concat(identity)

  return tail.reduce(applyPipe, head)
}

module.exports = pipeP
