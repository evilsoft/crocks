/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isApplicative = require('../predicates/isApplicative')
const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')

const concat = require('./concat')

function runTraverse(f) {
  return function(acc, x) {
    const m = f(x)

    if(!isApplicative(acc) || !isApplicative(m)) {
      throw new TypeError('traverse: Both functions must return an Applicative')
    }

    return m
      .map(v => concat([ v ]))
      .ap(acc)
  }
}

function traverse(af, fn, m) {
  if(!isFunction(af)) {
    throw new TypeError('traverse: Applicative function required for first argument')
  }
  else if(!isFunction(fn)) {
    throw new TypeError('traverse: Applicative returning function required for second argument')
  }
  else if((m && isFunction(m.traverse))) {
    return m.traverse(af, fn)
  }
  else if((isArray(m))) {
    return m.reduce(runTraverse(fn), af([]))
  }
  else {
    throw new TypeError('traverse: Traversable or Array required for third argument')
  }
}

module.exports = curry(traverse)
