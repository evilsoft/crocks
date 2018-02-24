module.exports = {
  assign: require('./assign'),
  assoc: require('./assoc'),
  binary: require('./binary'),
  branch: require('../Pair/branch'),
  compose: require('./compose'),
  composeK: require('./composeK'),
  composeP: require('./composeP'),
  composeS: require('./composeS'),
  curry: require('./curry'),
  defaultProps: require('./defaultProps'),
  defaultTo: require('./defaultTo'),
  dissoc: require('./dissoc'),
  fanout: require('./fanout'),
  fromPairs: require('./fromPairs'),
  liftA2: require('./liftA2'),
  liftA3: require('./liftA3'),
  liftN: require('./liftN'),
  mapProps: require('./mapProps'),
  mapReduce: require('./mapReduce'),
  mconcat: require('./mconcat'),
  mconcatMap: require('./mconcatMap'),
  mreduce: require('./mreduce'),
  mreduceMap: require('./mreduceMap'),
  nAry: require('./nAry'),
  objOf: require('./objOf'),
  omit: require('./omit'),
  once: require('./once'),
  partial: require('./partial'),
  pick: require('./pick'),
  pipe: require('./pipe'),
  pipeK: require('./pipeK'),
  pipeP: require('./pipeP'),
  pipeS: require('./pipeS'),
  prop: require('../Maybe/prop'),
  propPath: require('../Maybe/propPath'),
  propOr: require('./propOr'),
  propPathOr: require('./propPathOr'),
  safe: require('../Maybe/safe'),
  safeLift: require('../Maybe/safeLift'),
  tap: require('./tap'),
  toPairs: require('../Pair/toPairs'),
  tryCatch: require('../Result/tryCatch'),
  unary: require('./unary'),
  unit: require('./unit')
}