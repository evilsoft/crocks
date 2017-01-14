/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isApplicative = require('../predicates/isApplicative')
const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')

const concat = require('./concat')

function runSequence(acc, x) {
  if(!isApplicative(x)) {
    throw new TypeError('sequence: Must wrap Applicatives')
  }

  return x
    .map(v => concat([ v ]))
    .ap(acc)
}

function sequence(af, m) {
  if(!isFunction(af)) {
    throw new TypeError('sequence: Applicative function required for first argument')
  }
  else if((m && isFunction(m.sequence))) {
    return m.sequence(af)
  }
  else if((isArray(m))) {
    return m.reduce(runSequence, af([]))
  }
  else {
    throw new TypeError('sequence: Traversable or Array required for second argument')
  }
}

module.exports = curry(sequence)
