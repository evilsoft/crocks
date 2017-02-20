/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const flip = require('../combinators/flip')
const identity = require('../combinators/identity')
const ifElse = require('../logic/ifElse')
const isFunction = require('../predicates/isFunction')
const runWith = require('../pointfree/runWith')

module.exports = ifElse(isFunction, identity, flip(runWith))
