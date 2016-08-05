const curry = require('../funcs/curry')

// Constant (Kestrel)
// constant :: a -> b -> a
const constant = x => _ => x

module.exports = curry(constant)
