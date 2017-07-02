/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const { Nothing, Just } = require('./Maybe')
const predOrFunc = require('./predOrFunc')

// safe : ((a -> Boolean) | Pred) -> a -> Maybe a
function safe(pred) {
  return x =>
    predOrFunc(pred, x) ? Just(x) : Nothing()
}

module.exports = safe
