/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from '../core/isFunction'

export default function run(m) {
  if(!(m && isFunction(m.run))) {
    throw new TypeError('run: IO required')
  }

  return m.run()
}
