/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */
/** @author Henrique Limas */

const combinators = require('./combinators')
const logic = require('./logic')
const predicates = require('./predicates')

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
  Tuple: require('./Tuple'),
  Unit: require('./Unit'),
  Writer: require('./Writer')
}

const helpers = Object.assign({},
  require('./helpers'), {
    branch: require('./Pair/branch'),
    fanout: require('./Pair/fanout'),
    find: require('./Maybe/find'),
    getPath: require('./Maybe/getPath'),
    getProp: require('./Maybe/getProp'),
    prop: require('./Maybe/prop'),
    propPath: require('./Maybe/propPath'),
    safe: require('./Maybe/safe'),
    safeAfter: require('./Maybe/safeAfter'),
    safeLift: require('./Maybe/safeLift'),
    toPairs: require('./Pair/toPairs'),
    tryCatch: require('./Result/tryCatch')
  }
)

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
  Sum: require('./Sum')
}

const pointfree = Object.assign({},
  require('./pointfree'), {
    evalWith: require('./State/evalWith'),
    execWith: require('./State/execWith'),
    fst: require('./Pair/fst'),
    log: require('./Writer/log'),
    nmap: require('./Tuple/nmap'),
    project: require('./Tuple/project'),
    race: require('./Async/race'),
    read: require('./Writer/read'),
    snd: require('./Pair/snd')
  }
)

const transforms = {
  arrayToList: require('./List/arrayToList'),
  asyncToPromise: require('./Async/asyncToPromise'),
  eitherToAsync: require('./Async/eitherToAsync'),
  eitherToFirst: require('./First/eitherToFirst'),
  eitherToLast: require('./Last/eitherToLast'),
  eitherToMaybe: require('./Maybe/eitherToMaybe'),
  eitherToResult: require('./Result/eitherToResult'),
  firstToAsync: require('./Async/firstToAsync'),
  firstToEither: require('./Either/firstToEither'),
  firstToLast: require('./Last/firstToLast'),
  firstToMaybe: require('./Maybe/firstToMaybe'),
  firstToResult: require('./Result/firstToResult'),
  lastToAsync: require('./Async/lastToAsync'),
  lastToEither: require('./Either/lastToEither'),
  lastToFirst: require('./First/lastToFirst'),
  lastToMaybe: require('./Maybe/lastToMaybe'),
  lastToResult: require('./Result/lastToResult'),
  listToArray: require('./List/listToArray'),
  maybeToArray: require('./Maybe/maybeToArray'),
  maybeToAsync: require('./Async/maybeToAsync'),
  maybeToEither: require('./Either/maybeToEither'),
  maybeToFirst: require('./First/maybeToFirst'),
  maybeToLast: require('./Last/maybeToLast'),
  maybeToList: require('./List/maybeToList'),
  maybeToResult: require('./Result/maybeToResult'),
  resultToAsync: require('./Async/resultToAsync'),
  resultToEither: require('./Either/resultToEither'),
  resultToFirst: require('./First/resultToFirst'),
  resultToLast: require('./Last/resultToLast'),
  resultToMaybe: require('./Maybe/resultToMaybe'),
  tupleToArray: require('./Tuple/tupleToArray'),
  writerToPair: require('./Pair/writerToPair')
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
