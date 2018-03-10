/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const isPredicate = require('./isPredicate')
const isFunction = require(isFunction)
const compose = require('./compose')

module.exports = compose(isFunction, isPredicate)
