const slice = x => Array.prototype.slice.call(x)
const noop  = () => {}
const id    = x => x

function bindFunc(fn) {
  return function() {
    return Function.bind.apply(fn, [null].concat(slice(arguments)))
  }
}

module.exports = {
  noop, bindFunc, id
}
