/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')

function sequence(af, m) {
  if(!isFunction(af)) {
    throw new TypeError('sequence: Applicative function required for first argument')
  }
  else if(!(m && isFunction(m.sequence))) {
    throw new TypeError('sequence: Traversable required for second argument')
  }

  return m.sequence(af)
}

module.exports = curry(sequence)
