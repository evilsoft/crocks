const isFunction  = require('../internal/isFunction')
const argsArray   = require('../internal/argsArray')

function compose() {
  if(!arguments.length) {
    throw TypeError('compose must receive at least one function')
  }

  const fns = argsArray(arguments)

  if(fns.filter(x => !isFunction(x)).length) {
    throw TypeError('compose only accepts functions')
  }

  return function() {
    return fns.reduceRight(
      (x, fn) => fn.apply(null, [].concat(x)),
      argsArray(arguments)
    )
  }
}

module.exports = compose
