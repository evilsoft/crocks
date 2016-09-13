/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

function isApplicative(m) {
  return !!m
    && isFunction(m.map)
    && isFunction(m.ap)
    && isFunction(m.of)
}

module.exports = isApplicative
