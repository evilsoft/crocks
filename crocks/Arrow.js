/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')
const composeB = require('../combinators/composeB')

const _type =
  constant('Arrow')

function Arrow(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Arrow: Function required')
  }

  const type =
    _type

  const value =
    constant(runWith)

  const inspect =
    constant(`Arrow${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Arrow.concat: Arrow required')
    }

    return Arrow(composeB(m.runWith, runWith))
  }

  return {
    inspect, type, value, runWith,
    concat
  }
}

Arrow.empty = () => {}
Arrow.type = _type

Arrow.concat =
  require('../pointfree/concat')

Arrow.value =
  require('../pointfree/value')

Arrow.runWith =
  require('../pointfree/runWith')

module.exports = Arrow
