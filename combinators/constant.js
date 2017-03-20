/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

// Constant (Kestrel)
// constant :: a -> b -> a
const constant = x => () => x

module.exports = curry(constant)
