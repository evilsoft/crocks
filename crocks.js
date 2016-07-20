/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const crocks = {
  Maybe:    require('./crocks/Maybe'),
  Identity: require('./crocks/Identity'),
  IO:       require('./crocks/IO')
}

const monoids = {
  Any:  require('./monoids/Any'),
  All:  require('./monoids/All'),
  Prod: require('./monoids/Prod'),
  Sum:  require('./monoids/Sum')
}

const helpers = {
  compose:    require('./funcs/compose'),
  curry:      require('./funcs/curry'),
  liftA:      require('./funcs/liftA'),
  liftA2:     require('./funcs/liftA2'),
  liftA3:     require('./funcs/liftA3'),
  mconcat:    require('./funcs/mconcat'),
  mconcatMap: require('./funcs/mconcatMap'),
}

const pointFree = {
  ap:     require('./pointfree/ap'),
  chain:  require('./pointfree/chain'),
  concat: require('./pointfree/concat'),
  map:    require('./pointfree/map'),
  maybe:  require('./pointfree/maybe'),
  run:    require('./pointfree/run'),
  value:  require('./pointfree/value')
}

const combinators = {
  applyTo:      require('./combinators/applyTo'),
  composeB:     require('./combinators/composeB'),
  constant:     require('./combinators/constant'),
  flip:         require('./combinators/flip'),
  identity:     require('./combinators/identity'),
  reverseApply: require('./combinators/reverseApply'),
  substitution: require('./combinators/substitution')
}

module.exports = Object.assign(
  {},
  combinators,
  helpers,
  pointFree,
  crocks,
  monoids
)
