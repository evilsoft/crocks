/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const crocks = {
  Arrow: require('./crocks/Arrow'),
  Const: require('./crocks/Const'),
  Either: require('./crocks/Either'),
  Identity: require('./crocks/Identity'),
  IO: require('./crocks/IO'),
  List: require('./crocks/List'),
  Maybe: require('./crocks/Maybe'),
  Pair: require('./crocks/Pair'),
  Reader: require('./crocks/Reader'),
  Unit: require('./crocks/Unit'),
  Writer: require('./crocks/Writer')
}

const monoids = {
  All: require('./monoids/All'),
  Any: require('./monoids/Any'),
  Assign: require('./monoids/Assign'),
  Min: require('./monoids/Min'),
  Max: require('./monoids/Max'),
  Prod: require('./monoids/Prod'),
  Sum: require('./monoids/Sum')
}

const helpers = {
  branch: require('./funcs/branch'),
  compose: require('./funcs/compose'),
  curry: require('./funcs/curry'),
  ifElse: require('./funcs/ifElse'),
  inspect: require('./funcs/inspect'),
  liftA2: require('./funcs/liftA2'),
  liftA3: require('./funcs/liftA3'),
  mconcat: require('./funcs/mconcat'),
  mconcatMap: require('./funcs/mconcatMap'),
  mreduce: require('./funcs/mreduce'),
  mreduceMap: require('./funcs/mreduceMap'),
  pipe: require('./funcs/pipe')
}

const pointFree = {
  ap: require('./pointfree/ap'),
  bimap: require('./pointfree/bimap'),
  chain: require('./pointfree/chain'),
  coalesce: require('./pointfree/coalesce'),
  concat: require('./pointfree/concat'),
  cons: require('./pointfree/cons'),
  contramap: require('./pointfree/contramap'),
  either: require('./pointfree/either'),
  filter: require('./pointfree/filter'),
  fst: require('./pointfree/fst'),
  head: require('./pointfree/head'),
  log: require('./pointfree/log'),
  map: require('./pointfree/map'),
  maybe: require('./pointfree/maybe'),
  merge: require('./pointfree/merge'),
  option: require('./pointfree/option'),
  promap: require('./pointfree/promap'),
  read: require('./pointfree/read'),
  reduce: require('./pointfree/reduce'),
  run: require('./pointfree/run'),
  runWith: require('./pointfree/runWith'),
  sequence: require('./pointfree/sequence'),
  snd: require('./pointfree/snd'),
  swap: require('./pointfree/swap'),
  tail: require('./pointfree/tail'),
  traverse: require('./pointfree/traverse'),
  value: require('./pointfree/value')
}

const combinators = {
  applyTo: require('./combinators/applyTo'),
  composeB: require('./combinators/composeB'),
  constant: require('./combinators/constant'),
  flip: require('./combinators/flip'),
  identity: require('./combinators/identity'),
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
