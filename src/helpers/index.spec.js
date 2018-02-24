const test = require('tape')

const assign = require('./assign')
const assoc = require('./assoc')
const binary = require('./binary')
const branch = require('../Pair/branch')
const compose = require('./compose')
const composeK = require('./composeK')
const composeP = require('./composeP')
const composeS = require('./composeS')
const curry = require('./curry')
const defaultProps  = require('./defaultProps')
const defaultTo  = require('./defaultTo')
const dissoc = require('./dissoc')
const fanout = require('./fanout')
const fromPairs = require('./fromPairs')
const liftA2 = require('./liftA2')
const liftA3 = require('./liftA3')
const liftN = require('./liftN')
const mapProps = require('./mapProps')
const mapReduce = require('./mapReduce')
const mconcat = require('./mconcat')
const mconcatMap = require('./mconcatMap')
const mreduce = require('./mreduce')
const mreduceMap = require('./mreduceMap')
const nAry = require('./nAry')
const objOf = require('./objOf')
const omit = require('./omit')
const once = require('./once')
const partial = require('./partial')
const pick = require('./pick')
const pipe = require('./pipe')
const pipeK = require('./pipeK')
const pipeP = require('./pipeP')
const pipeS = require('./pipeS')
const prop = require('../Maybe/prop')
const propOr = require('./propOr')
const propPath = require('../Maybe/propPath')
const propPathOr = require('./propPathOr')
const safe = require('../Maybe/safe')
const safeLift = require('../Maybe/safeLift')
const tap = require('./tap')
const toPairs = require('../Pair/toPairs')
const tryCatch = require('../Result/tryCatch')
const unary = require('./unary')
const unit = require('./unit')

test('helpers entry', t => {
  t.equal(assign, assign, 'provides the assign helper')
  t.equal(assoc, assoc, 'provides the assoc helper')
  t.equal(binary, binary, 'provides the binary helper')
  t.equal(branch, branch, 'provides the branch helper')
  t.equal(compose, compose, 'provides the compose helper')
  t.equal(composeK, composeK, 'provides the composeK helper')
  t.equal(composeP, composeP, 'provides the composeP helper')
  t.equal(composeS, composeS, 'provides the composeS helper')
  t.equal(curry, curry, 'provides the curry helper')
  t.equal(defaultProps, defaultProps, 'provides the defaultProps helper')
  t.equal(defaultTo, defaultTo, 'provides the defaultTo helper')
  t.equal(dissoc, dissoc, 'provides the dissoc helper')
  t.equal(fanout, fanout, 'provides the fanout helper')
  t.equal(fromPairs, fromPairs, 'provides the fromPairs helper')
  t.equal(liftA2, liftA2, 'provides the liftA2 helper')
  t.equal(liftA3, liftA3, 'provides the liftA3 helper')
  t.equal(liftN, liftN, 'provides the liftN helper')
  t.equal(mapProps, mapProps, 'provides the mapProps helper')
  t.equal(mapReduce, mapReduce, 'provides the mapReduce helper')
  t.equal(mconcat, mconcat, 'provides the mconcat helper')
  t.equal(mconcatMap, mconcatMap, 'provides the mconcatMap helper')
  t.equal(mreduce, mreduce, 'provides the mreduce helper')
  t.equal(mreduceMap, mreduceMap, 'provides the mreduceMap helper')
  t.equal(nAry, nAry, 'provides the nAry helper')
  t.equal(objOf, objOf, 'provides the objOf helper')
  t.equal(omit, omit, 'provides the omit helper')
  t.equal(once, once, 'provides the once helper')
  t.equal(partial, partial, 'provides the partial helper')
  t.equal(pick, pick, 'provides the pick helper')
  t.equal(pipe, pipe, 'provides the pipe helper')
  t.equal(pipeK, pipeK, 'provides the pipeK helper')
  t.equal(pipeP, pipeP, 'provides the pipeP helper')
  t.equal(pipeS, pipeS, 'provides the pipeS helper')
  t.equal(prop, prop, 'provides the prop helper')
  t.equal(propOr, propOr, 'provides the propOr helper')
  t.equal(propPath, propPath, 'provides the propPath helper')
  t.equal(propPathOr, propPathOr, 'provides the propPathOr helper')
  t.equal(safe, safe, 'provides the safe helper')
  t.equal(safeLift, safeLift, 'provides the safeLift helper')
  t.equal(tap, tap, 'provides the tap helper')
  t.equal(toPairs, toPairs, 'provides the toPairs helper')
  t.equal(tryCatch, tryCatch, 'provides the tryCatch helper')
  t.equal(unary, unary, 'provides the unary helper')
  t.equal(unit, unit, 'provides the unit helper')

  t.end()
})
