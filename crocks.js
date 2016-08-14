/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const crocks = {
  Either:   require('./crocks/Either'),
  Identity: require('./crocks/Identity'),
  IO:       require('./crocks/IO'),
  Maybe:    require('./crocks/Maybe'),
  Pair:     require('./crocks/Pair'),
  Reader:   require('./crocks/Reader'),
  Writer:   require('./crocks/Writer')
}

const monoids = {
  All:      require('./monoids/All'),
  Any:      require('./monoids/Any'),
  Assign:   require('./monoids/Assign'),
  Compose:  require('./monoids/Compose'),
  Flip:     require('./monoids/Flip'),
  Min:      require('./monoids/Min'),
  Max:      require('./monoids/Max'),
  Prod:     require('./monoids/Prod'),
  Sum:      require('./monoids/Sum')
}

const helpers = {
  compose:    require('./funcs/compose'),
  curry:      require('./funcs/curry'),
  inspect:    require('./funcs/inspect'),
  liftA2:     require('./funcs/liftA2'),
  liftA3:     require('./funcs/liftA3'),
  mconcat:    require('./funcs/mconcat'),
  mconcatMap: require('./funcs/mconcatMap'),
}

const pointFree = {
  ap:           require('./pointfree/ap'),
  bimap:        require('./pointfree/bimap'),
  chain:        require('./pointfree/chain'),
  concat:       require('./pointfree/concat'),
  either:       require('./pointfree/either'),
  fst:          require('./pointfree/fst'),
  log:          require('./pointfree/log'),
  map:          require('./pointfree/map'),
  maybe:        require('./pointfree/maybe'),
  option:       require('./pointfree/option'),
  read:         require('./pointfree/read'),
  reduceLog:    require('./pointfree/reduceLog'),
  mreduceLog:   require('./pointfree/mreduceLog'),
  run:          require('./pointfree/run'),
  runWith:      require('./pointfree/runWith'),
  snd:          require('./pointfree/snd'),
  value:        require('./pointfree/value')
}

const combinators = {
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
