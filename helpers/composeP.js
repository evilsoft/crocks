/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const argsArray = require('../internal/argsArray')

const isEmpty = require('../predicates/isEmpty')
const isFunction = require('../predicates/isFunction')
const isPromise = require('../predicates/isPromise')

function applyCompose(f, g) {
  return function() {
    p = f.apply(null, arguments)

    if(!isPromise(p)) {
      throw new TypeError('composeP: Only accepts Promise returning functions')
    }

    return p.then(g)
  }
}

function composeP() {
  if(!arguments.length) {
    throw new TypeError('composeP: At least one Promise returning function required')
  }

  const fns =
    argsArray(arguments).reverse()

  if(fns.filter(x => !isFunction(x)).length) {
    throw new TypeError('composeP: Only accepts Promise returning functions')
  }

  const head =
    fns.shift()

  if(isEmpty(fns)) {
    return function() {
      const m = head.apply(null, arguments)

      if(!isPromise(m)) {
        throw new TypeError('composeP: Only accepts Promise returning functions')
      }
      return m
    }
  }

  return fns.reduce(applyCompose, head)
}

module.exports = composeP
