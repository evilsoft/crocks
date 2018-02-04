/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')

function reduceRight(fn, init, m) {
  if(!isFunction(fn)) {
    throw new TypeError('reduceRight: Function required for first argument')
  }
  else if(!(m && isFunction(m.reduceRight))) {
    throw new TypeError('reduceRight: Right Foldable required for third argument')
  }

  return m.reduceRight(fn, init)
}

module.exports = curry(reduceRight)
