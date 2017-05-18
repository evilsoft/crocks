/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const argsArray = require('../internal/argsArray')

const identity = require('../combinators/identity')
const isFunction = require('../predicates/isFunction')
const isPromise = require('../predicates/isPromise')

const err = 'composeP: Promise returning functions required'

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

function composeP() {
  if(!arguments.length) {
    throw new TypeError(err)
  }

  const fns =
    argsArray(arguments).reverse()

  const head =
    fns[0]

  if(!isFunction(head)) {
    throw new TypeError(err)
  }

  const tail =
    fns.slice(1).concat(identity)

  return tail.reduce(applyPipe, head)
}

module.exports = composeP
