/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const isFunction = require('../core/isFunction')
const curry = require('../core/curry')

function project(index, m) {
  if(!(m && isFunction(m.project))) {
    throw new TypeError('project: Tuple required')
  }

  return m.project(index)
}

module.exports = curry(project)
