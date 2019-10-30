/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pair = require('../core/types').proxy('Pair')

const isFoldable = require('../core/isFoldable')
const isSameType = require('../core/isSameType')
const isString = require('../core/isString')

function foldPairs(acc, pair) {
  if(!isSameType(Pair, pair)) {
    throw new TypeError('fromPairs: Foldable of Pairs required for argument')
  }

  const key = pair.fst()
  const value = pair.snd()

  if(!isString(key)) {
    throw new TypeError('fromPairs: String required for fst of every Pair')
  }

  return value !== undefined
    ? Object.assign(acc, { [key]: value })
    : acc
}

/** fromPairs :: Foldable f => f (Pair String a) -> Object */
function fromPairs(xs) {
  if(!isFoldable(xs)) {
    throw new TypeError('fromPairs: Foldable of Pairs required for argument')
  }

  return xs.reduce(foldPairs, {})
}

module.exports = fromPairs
