const isFunction = require('../internal/isFunction')

function fst(m) {
  if(!(m && isFunction(m.fst))) {
    throw new TypeError('fst: Pair required')
  }

  return m.fst()
}

module.exports = fst
