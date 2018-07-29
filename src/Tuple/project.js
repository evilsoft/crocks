/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

import isFunction from '../core/isFunction'
import curry from '../core/curry'

function project(index, m) {
  if(!(m && isFunction(m.project))) {
    throw new TypeError('project: Tuple required')
  }

  return m.project(index)
}

export default curry(project)
