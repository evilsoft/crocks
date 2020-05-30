/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../core/isFunction')
const _once = require('../core/once')

/** once :: ((*) -> b) -> ((*) -> b) */
function once(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('once: Argument must be a Function')
  }

  return _once(fn)
}

module.exports = once
