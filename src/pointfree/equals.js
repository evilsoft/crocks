/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _equals = require('../core/equals')
const curry = require('../core/curry')

function equals(x, y) {
  return _equals(x, y)
}

module.exports =
  curry(equals)
