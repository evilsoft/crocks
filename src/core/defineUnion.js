/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const argsArray = require('./argsArray')
const constant = require('./constant')
const curry = require('./curry')
const isArray = require('./isArray')
const isEmpty = require('./isEmpty')
const isFunction = require('./isFunction')
const isObject = require('./isObject')
const isString = require('./isString')

const isDefinition =
  x => isString(x) && x.length

function caseOf(defs) {
  return function(cases, m) {
    const tag = m.tag
    const def = defs[tag()]

    const args = def.reduce(
      (xs, x) => xs.concat([ m[x].value() ]),
      []
    )

    return cases[tag()].apply(null, args)
  }
}

const includes =
  defs => m => !!m && isFunction(m.tag) && Object.keys(defs).indexOf(m.tag()) !== -1

function construction(def, tag) {
  return function() {
    const args = argsArray(arguments)

    return def.reduce(function(obj, key, index) {
      obj[key] = { value: constant(args[index]) }
      return obj
    }, { tag: constant(tag) })
  }
}

function defineUnion(defs) {
  if(!isObject(defs) || isEmpty(defs)) {
    throw new TypeError('defineUnion: Argument must be an Object containing definition lists')
  }

  return Object.keys(defs).reduce(function(obj, tag) {
    const def = defs[tag]

    if(!isArray(def) || !def.reduce((x, y) => x && isDefinition(y), true)) {
      throw new TypeError('defineUnion: Definitions must be a list of non-empty string identifiers')
    }

    obj[tag] = construction(def, tag)

    return obj
  }, { caseOf: curry(caseOf(defs)), includes: curry(includes(defs)) })
}

module.exports = defineUnion
