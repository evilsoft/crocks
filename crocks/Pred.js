/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')

const constant = require('../combinators/constant')

const _type =
  constant('Pred')

function Pred(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Pred: Function required')
  }

  return { runWith }
}

Pred.type = _type

module.exports = Pred
