const fl = require('../core/flNames')

const id =
  x => x

const slice =
  x => Array.prototype.slice.call(x)

const contains = xs => x =>
  xs.indexOf(x) !== -1

const repFuncs =
  [ 'id', 'empty', 'of', 'zero' ]

const isRepFunc =
  contains(repFuncs)

function bindFunc(fn) {
  return function() {
    return Function.bind.apply(fn, [ null ].concat(slice(arguments)))
  }
}

function makeFake(algs, useFl) {
  const xs = algs.slice()
  const hasAlg = contains(xs)

  const inst = xs.reduce((o, alg) => {
    if(!isRepFunc(alg)) {
      o[useFl ? fl[alg] : alg] = id
    }

    return o
  }, {})

  const Fake =
    () => inst

  if(!useFl) {
    Fake['@@implements'] = hasAlg
  }

  inst.constructor = Fake

  return repFuncs.reduce((c, alg) => {
    if(hasAlg(alg)) {
      c[fl[alg]] = id
    }
    return c
  }, Fake)
}

module.exports = {
  bindFunc,
  makeFake
}
