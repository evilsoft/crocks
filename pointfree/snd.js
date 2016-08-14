const isFunction = require('../internal/isFunction')

function snd(m) {
  if(!(m && isFunction(m.snd))) {
    throw new TypeError('snd: Pair required')
  }

  return m.snd()
}

module.exports = snd
