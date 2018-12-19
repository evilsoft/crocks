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
    const fn = useFl ? fl[alg] : alg
    if((!isRepFunc(alg) || alg === 'empty') && fn) {
      o[fn] = id
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
    const fn = useFl ? fl[alg] : alg
    if(hasAlg(alg) && fn) {
      c[fn] = id
    }
    return c
  }, Fake)
}

const testIterable = (from = 1, to = 5, current = 1) => {
  const iterable = {
    from,
    to,
    current,
    [Symbol.iterator]: () => {
      iterable.current = current

      return iterable
    },
    next: () => {
      if (iterable.current <= iterable.to) {
        return { done: false, value: iterable.current++ }
      }

      return { done: true }
    }
  }

  return iterable
}

module.exports = {
  bindFunc,
  makeFake,
  testIterable
}
