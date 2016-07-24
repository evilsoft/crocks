const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

function LastMonoid(x) {
  return {
    concat: identity,
    value:  constant(x)
  }
}

LastMonoid.empty = () => LastMonoid(null)

module.exports = LastMonoid
