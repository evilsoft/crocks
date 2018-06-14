/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const compose = require('../core/compose')
const curry = require('../core/curry')
const fl = require('../core/flNames')
const isFunction = require('../core/isFunction')
const isProfunctor = require('../core/isProfunctor')

function promap(l, r, m) {
  if(!(isFunction(l) && isFunction(r))) {
    throw new TypeError(
      'promap: Functions required for first two arguments'
    )
  }

  if(isFunction(m)) {
    return compose(compose(r, m), l)
  }

  if(isProfunctor(m)) {
    return (m[fl.promap] || m.promap).call(m, l, r)
  }

  throw new TypeError(
    'promap: Function or Profunctor required for third argument'
  )
}

module.exports = curry(promap)
