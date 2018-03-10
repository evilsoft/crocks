/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const hasAlg = require('./hasAlg')

// isFunction : a -> Boolean
const isPredicate = (m) => !!m && hasAlg('runWith', m)

module.exports = isPredicate
