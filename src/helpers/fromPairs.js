/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { proxy } from '../core/types'
const Pair = proxy('Pair')

import isFoldable from '../core/isFoldable'
import isSameType from '../core/isSameType'
import isString from '../core/isString'

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

// fromPairs : Foldable f => f (Pair String a) -> Object
export default function fromPairs(xs) {
  if(!isFoldable(xs)) {
    throw new TypeError('fromPairs: Foldable of Pairs required for argument')
  }

  return xs.reduce(foldPairs, {})
}
