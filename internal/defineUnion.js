/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const constant = require('../combinators/constant')

const argsArray = require('./argsArray')

const isArray = require('../predicates/isArray')
const isEmpty = require('../predicates/isEmpty')
const isObject = require('../predicates/isObject')
const isString = require('../predicates/isString')

const isDefinition = x => isString(x) && x.length

function caseOf(defs) {
  return function(cases, m) {
    const tag = m.tag
    const def = defs[tag()]

    const args = def.reduce(function(xs, x) {
      return xs.concat([m[x].value()])
    }, [])

    return cases[tag()].apply(null, args)
  }
}

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
  }, { caseOf: curry(caseOf(defs)) })
}

module.exports = defineUnion
