/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isApplicative from './isApplicative'
import isTypeRepOf from './isTypeRepOf'

const apOrFunc = af => x =>
  isApplicative(af)
    ? af.of(x)
    : isTypeRepOf(Array, af) ? [ x ] : af(x)

export default apOrFunc
