/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isFunction = require('../internal/isFunction')
const composeB = require('../combinators/composeB')

function promap(l, r, m) {
  if(!isFunction(l) || !isFunction(r)) {
    throw new TypeError('promap: Functions required for first two arguments')
  }
  else if(isFunction(m)){
    return composeB(composeB(r, m), l)
  }
  else if(m && isFunction(m.promap)) {
    return m.promap(l, r)
  }
  else {
    throw new TypeError('promap: Function or Profunctor required for third argument')
  }
}

module.exports = curry(promap)
