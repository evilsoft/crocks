/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const combinators = {
  applyTo: require('./combinators/applyTo'),
  composeB: require('./combinators/composeB'),
  constant: require('./combinators/constant'),
  flip: require('./combinators/flip'),
  identity: require('./combinators/identity'),
  reverseApply: require('./combinators/reverseApply'),
  substitution: require('./combinators/substitution')
}

const crocks = {
  Arrow: require('./crocks/Arrow'),
  Async: require('./crocks/Async'),
  Const: require('./crocks/Const'),
  Either: require('./crocks/Either'),
  Identity: require('./crocks/Identity'),
  IO: require('./crocks/IO'),
  List: require('./crocks/List'),
  Maybe: require('./crocks/Maybe'),
  Pair: require('./crocks/Pair'),
  Pred: require('./crocks/Pred'),
  Reader: require('./crocks/Reader'),
  Star: require('./crocks/Star'),
  State: require('./crocks/State'),
  Unit: require('./crocks/Unit'),
  Writer: require('./crocks/Writer')
}

const helpers = {
  branch: require('./helpers/branch'),
  compose: require('./helpers/compose'),
  curry: require('./helpers/curry'),
  curryN: require('./helpers/curryN'),
  fanout: require('./helpers/fanout'),
  liftA2: require('./helpers/liftA2'),
  liftA3: require('./helpers/liftA3'),
  mconcat: require('./helpers/mconcat'),
  mconcatMap: require('./helpers/mconcatMap'),
  mreduce: require('./helpers/mreduce'),
  mreduceMap: require('./helpers/mreduceMap'),
  once: require('./helpers/once'),
  pipe: require('./helpers/pipe'),
  prop: require('./helpers/prop'),
  propPath: require('./helpers/propPath'),
  safe: require('./helpers/safe'),
  safeLift: require('./helpers/safeLift'),
  tap: require('./helpers/tap'),
  tryCatch: require('./helpers/tryCatch')
}

const logic = {
  and: require('./logic/and'),
  ifElse: require('./logic/ifElse'),
  not: require('./logic/not'),
  or: require('./logic/or'),
  unless: require('./logic/unless'),
  when: require('./logic/when')
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

const pointFree = {
  alt: require('./pointfree/alt'),
  ap: require('./pointfree/ap'),
  bimap: require('./pointfree/bimap'),
  both: require('./pointfree/both'),
  chain: require('./pointfree/chain'),
  coalesce: require('./pointfree/coalesce'),
  concat: require('./pointfree/concat'),
  cons: require('./pointfree/cons'),
  contramap: require('./pointfree/contramap'),
  evalWith: require('./pointfree/evalWith'),
  execWith: require('./pointfree/execWith'),
  either: require('./pointfree/either'),
  filter: require('./pointfree/filter'),
  first: require('./pointfree/first'),
  fold: require('./pointfree/fold'),
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
  second: require('./pointfree/second'),
  sequence: require('./pointfree/sequence'),
  snd: require('./pointfree/snd'),
  swap: require('./pointfree/swap'),
  tail: require('./pointfree/tail'),
  traverse: require('./pointfree/traverse'),
  value: require('./pointfree/value')
}

const predicates = {
  hasKey: require('./predicates/hasKey'),
  isAlt: require('./predicates/isAlt'),
  isApplicative: require('./predicates/isApplicative'),
  isApply: require('./predicates/isApply'),
  isArray: require('./predicates/isArray'),
  isBoolean: require('./predicates/isBoolean'),
  isDefined: require('./predicates/isDefined'),
  isEmpty: require('./predicates/isEmpty'),
  isFoldable: require('./predicates/isFoldable'),
  isFunction: require('./predicates/isFunction'),
  isFunctor: require('./predicates/isFunctor'),
  isInteger: require('./predicates/isInteger'),
  isMonad: require('./predicates/isMonad'),
  isMonoid: require('./predicates/isMonoid'),
  isNil: require('./predicates/isNil'),
  isNumber: require('./predicates/isNumber'),
  isObject: require('./predicates/isObject'),
  isSameType: require('./predicates/isSameType'),
  isSetoid: require('./predicates/isSetoid'),
  isSemigroup: require('./predicates/isSemigroup'),
  isString: require('./predicates/isString'),
  isTraversable: require('./predicates/isTraversable')
}

const transforms = {
  eitherToAsync: require('./transforms/eitherToAsync'),
  eitherToMaybe: require('./transforms/eitherToMaybe'),
  maybeToAsync: require('./transforms/maybeToAsync'),
  maybeToEither: require('./transforms/maybeToEither')
}

module.exports = Object.assign(
  {},
  combinators,
  crocks,
  helpers,
  logic,
  monoids,
  pointFree,
  predicates,
  transforms
)
