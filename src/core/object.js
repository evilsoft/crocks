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

export function assign(x, m) {
  const result = Object.keys(m).reduce(rejectUnit(m), {})
  return Object.keys(x).reduce(rejectUnit(x), result)
}

export function filter(f, m) {
  return Object.keys(m).reduce((acc, key) => {
    if(f(m[key])) {
      acc[key] = m[key]
    }
    return acc
  }, {})
}

export function map(f, m) {
  return Object.keys(m).reduce((acc, key) => {
    acc[key] = f(m[key])
    return acc
  }, {})
}

export function set(key, val, m) {
  return assign({ [key]: val }, m)
}

export function unset(key, m) {
  return Object.keys(m).reduce((acc, k) => {
    if(m[k] !== undefined && k !== key) {
      acc[k] = m[k]
    }

    return acc
  }, {})
}
