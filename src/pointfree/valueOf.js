/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isNil = require('../core/isNil')

function valueOf(m) {
  if(isNil(m)) {
    return m
  }

  return m.valueOf()
}

module.exports = valueOf
