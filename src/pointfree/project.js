/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const isFunction = require('../core/isFunction')

function project(m) {
  if(!(m && isFunction(m.project))) {
    throw new TypeError('project: Tuple required')
  }

  return m.project()
}

module.exports = project
