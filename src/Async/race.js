/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isSameType = require('../core/isSameType')

const Async = require('../core/types').proxy('Async')

function race(m, a) {
  if(!(isSameType(m, a) && isSameType(Async, m))) {
    throw new TypeError('race: Both arguments must be Asyncs')
  }

  return a.race(m)
}

module.exports =
  curry(race)
