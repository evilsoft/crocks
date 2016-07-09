const curry = require('../funcs/curry')

// Constant (Kestrel)
// k_comb :: a -> b -> a
const k_comb = (x, _) => x

module.exports = curry(k_comb)
