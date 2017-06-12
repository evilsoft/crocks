const id =
  x => x

const slice =
  x => Array.prototype.slice.call(x)

function bindFunc(fn) {
  return function() {
    return Function.bind.apply(fn, [ null ].concat(slice(arguments)))
  }
}

function makeFake(algs) {
  const xs = algs.slice()

  const Fake = function() {
    return xs.reduce(function(o, alg) {
      o[alg] = id
      return o
    }, {})
  }

  Fake['@@implements'] =
    x => xs.indexOf(x) !== -1

  return Fake
}

module.exports = {
  bindFunc,
  makeFake
}
