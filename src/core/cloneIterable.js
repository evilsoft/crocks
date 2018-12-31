/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Henrique Limas (HenriqueLimas) */

function cloneIterable(source) {
  let copy = Object.create(Object.getPrototypeOf(source))
  Object.assign(copy, source)

  const symbols = Object.getOwnPropertySymbols(source)
  symbols.forEach(symbol => {
    copy[symbol] = source[symbol]
  })

  return copy
}

module.exports = cloneIterable
