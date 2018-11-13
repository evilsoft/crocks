/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

function rejectUnit(obj) {
  return function(acc, key) {
    const value = obj[key]

    if(value !== undefined) {
      acc[key] = value
    }
    return acc
  }
}

function assign(x, m) {
  const result = Object.keys(m).reduce(rejectUnit(m), {})
  return Object.keys(x).reduce(rejectUnit(x), result)
}

function filter(f, m) {
  return Object.keys(m).reduce((acc, key) => {
    if(f(m[key])) {
      acc[key] = m[key]
    }
    return acc
  }, {})
}

function map(f, m) {
  return Object.keys(m).reduce((acc, key) => {
    acc[key] = f(m[key])
    return acc
  }, {})
}

function set(key, val, m) {
  return assign({ [key]: val }, m)
}

module.exports = {
  assign,
  filter,
  map,
  set
}
