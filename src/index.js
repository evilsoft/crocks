/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */
/** @author Henrique Limas */

const combinators = require('./combinators')
const helpers = require('./helpers')
const logic = require('./logic')
const pointfree = require('./pointfree')
const predicates = require('./predicates')
const transforms = require('./transforms')

const monoids = {
  All: require('./All'),
  Any: require('./Any'),
  Assign: require('./Assign'),
  Endo: require('./Endo'),
  First: require('./First'),
  Last: require('./Last'),
  Max: require('./Max'),
  Min: require('./Min'),
  Prod: require('./Prod'),
  Sum: require('./Sum'),
}

const crocks = {
  Arrow: require('./Arrow'),
  Async: require('./Async'),
  Const: require('./Const'),
  Either: require('./Either'),
  Equiv: require('./Equiv'),
  Identity: require('./Identity'),
  IO: require('./IO'),
  List: require('./List'),
  Maybe: require('./Maybe'),
  Pair: require('./Pair'),
  Pred: require('./Pred'),
  Reader: require('./Reader'),
  ReaderT: require('./Reader/ReaderT'),
  Result: require('./Result'),
  Star: require('./Star'),
  State: require('./State'),
  Unit: require('./Unit'),
  Writer: require('./Writer')
}

module.exports = Object.assign(
  {},
  combinators,
  crocks,
  helpers,
  logic,
  monoids,
  pointfree,
  predicates,
  transforms
)
