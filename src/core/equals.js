/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isSameType = require('./isSameType')
const isSame = require('./isSame')
const hasAlg = require('./hasAlg')
const type = require('./type')
const fl = require('./flNames')

const comp = (a, b) =>
  a.valueOf() === b.valueOf()

const strats = {
  'Array': (a, b) =>
    a.length === b.length
      && deepEquals(a, b),

  'Date': (a, b) =>
    isSame(a.valueOf(), b.valueOf()),

  'Error': (a, b) =>
    a.name === b.name
      && a.message === b.message,

  'Object': (a, b) =>
    Object.keys(a).length === Object.keys(b).length
      && deepEquals(a, b),

  'RegExp': (a, b) =>
    a.source === b.source
      && a.ignoreCase === b.ignoreCase
      && a.global === b.global
      && a.multiline === b.multiline
      && a.unicode === b.unicode
}

function deepEquals(a, b) {
  for(const key in a) {
    if(!equals(a[key], b[key])) {
      return false
    }
  }
  return true
}

function equals(a, b) {
  if(isSame(a, b)) {
    return true
  }

  if(!isSameType(a, b)) {
    return false
  }

  if(hasAlg('equals', a)) {
    return (b[fl.equals] || b.equals).call(b, a)
  }

  return (strats[type(a)] || comp)(a, b)
}

module.exports = equals
