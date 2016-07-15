const isFunction  = require('../internal/isFunction')
const argsArray   = require('../internal/argsArray')

function compose() {
  if(!arguments.length) {
    throw new TypeError('compose: Must receive at least one function')
  }

  const fns = argsArray(arguments)

  if(fns.filter(x => !isFunction(x)).length) {
    throw new TypeError('compose: Only accepts functions')
  }

  return function() {
    return fns.reduceRight(
      (x, fn) => fn.apply(null, [].concat(x)),
      argsArray(arguments)
    )
  }
}

module.exports = compose
