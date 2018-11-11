/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Henrique Limas (HenriqueLimas) */

const isArray = require('../core/isArray')
const isIterable = require('../core/isIterable')
const isObject = require('../core/isObject')

const err = 'cloneIterable: Iterable required'

function cloneIterable(source) {
  if (!isIterable(source)) {
    throw new TypeError(err)
  }

  if (isArray(source)) {
    return [].concat(source)
  }

  if (!isObject(source)) {
    return source
  }

  let copy = Object.create(Object.getPrototypeOf(source))
  Object.assign(copy, source)

  const symbols = Object.getOwnPropertySymbols(source)
  symbols.forEach(symbol => {
    copy[symbol] = source[symbol]
  })

  return copy
}

module.exports = cloneIterable
