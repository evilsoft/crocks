/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const array = require('../core/array')
const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isApplicative = require('../core/isApplicative')
const isFunction = require('../core/isFunction')

function sequence(af, m) {
  if(!(isApplicative(af) || isFunction(af))) {
    throw new TypeError(
      'sequence: Applicative TypeRep or Apply returning function required for first argument'
    )
  }

  if(m && isFunction(m.sequence)) {
    return m.sequence(af)
  }

  if(isArray(m)) {
    return array.sequence(af, m)
  }

  throw new TypeError('sequence: Traversable or Array required for second argument')
}

module.exports = curry(sequence)
