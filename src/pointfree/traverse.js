/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import array from '../core/array.js'
import curry from '../core/curry.js'
import isApplicative from '../core/isApplicative.js'
import isArray from '../core/isArray.js'
import isFunction from '../core/isFunction.js'

function traverse(af, fn, m) {
  if(!(isApplicative(af) || isFunction(af))) {
    throw new TypeError(
      'traverse: Applicative TypeRep or Apply returning function required for first argument'
    )
  }

  if(!isFunction(fn)) {
    throw new TypeError(
      'traverse: Apply returning function required for second argument'
    )
  }

  if(m && isFunction(m.traverse)) {
    return m.traverse(af, fn)
  }

  if(isArray(m)) {
    return array.traverse(af, fn, m)
  }

  throw new TypeError('traverse: Traversable or Array required for third argument')
}

export default curry(traverse)
