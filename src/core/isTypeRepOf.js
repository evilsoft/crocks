/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('./isFunction')

const isTypeRepOf = (x, y) =>
  isFunction(y)
    && (x === y || x.name === y.name)

module.exports = isTypeRepOf
