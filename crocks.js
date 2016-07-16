/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const crocks = {
  Maybe:    require('./crocks/Maybe'),
  Identity: require('./crocks/Identity')
}

const monoids = {
  Any: require('./monoids/Any'),
  All: require('./monoids/All'),
  Sum: require('./monoids/Sum')
}

const helpers = {
  compose:  require('./funcs/compose'),
  curry:    require('./funcs/curry'),
  mconcat:  require('./funcs/mconcat'),
  liftA:    require('./funcs/liftA')
}

const pointFree = {
  map:    require('./pointfree/map'),
  ap:     require('./pointfree/ap'),
  chain:  require('./pointfree/chain'),
  concat: require('./pointfree/concat'),
  maybe:  require('./pointfree/maybe'),
  value:  require('./pointfree/value')
}

const combinators = {
  applyTo:      require('./combinators/applyTo'),
  composeB:     require('./combinators/composeB'),
  constant:     require('./combinators/constant'),
  identity:     require('./combinators/identity'),
  reverseApply: require('./combinators/reverseApply')
}

module.exports = Object.assign(
  {},
  combinators,
  helpers,
  pointFree,
  crocks,
  monoids
)
