/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

function filter(f, m) {
  return Object.keys(m).reduce((acc, key) => {
    if(f(m[key])) {
      acc[key] = m[key]
    }
    return acc
  }, {})
}

module.exports = {
  filter
}
