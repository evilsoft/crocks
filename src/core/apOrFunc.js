/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApplicative = require('./isApplicative')
const isTypeRepOf = require('./isTypeRepOf')

const apOrFunc = af => x =>
  isApplicative(af)
    ? af.of(x)
    : isTypeRepOf(Array, af) ? [ x ] : af(x)

module.exports = apOrFunc
