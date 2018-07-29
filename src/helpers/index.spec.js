import test from 'tape'

import * as Helpers from '.'

import assign from './assign'
import assoc from './assoc'
import binary from './binary'
import compose from './compose'
import composeK from './composeK'
import composeP from './composeP'
import composeS from './composeS'
import curry from './curry'
import defaultProps from './defaultProps'
import defaultTo from './defaultTo'
import dissoc from './dissoc'
import fromPairs from './fromPairs'
import liftA2 from './liftA2'
import liftA3 from './liftA3'
import liftN from './liftN'
import mapProps from './mapProps'
import mapReduce from './mapReduce'
import mconcat from './mconcat'
import mconcatMap from './mconcatMap'
import mreduce from './mreduce'
import mreduceMap from './mreduceMap'
import nAry from './nAry'
import objOf from './objOf'
import omit from './omit'
import once from './once'
import partial from './partial'
import pick from './pick'
import pipe from './pipe'
import pipeK from './pipeK'
import pipeP from './pipeP'
import pipeS from './pipeS'
import propOr from './propOr'
import propPathOr from './propPathOr'
import setPath from './setPath'
import setProp from './setProp'
import tap from './tap'
import unary from './unary'
import unit from './unit'
import unsetPath from './unsetPath'

test('helpers entry', t => {
  t.equal(Helpers.assign, assign, 'provides the assign helper')
  t.equal(Helpers.assoc, assoc, 'provides the assoc helper')
  t.equal(Helpers.binary, binary, 'provides the binary helper')
  t.equal(Helpers.compose, compose, 'provides the compose helper')
  t.equal(Helpers.composeK, composeK, 'provides the composeK helper')
  t.equal(Helpers.composeP, composeP, 'provides the composeP helper')
  t.equal(Helpers.composeS, composeS, 'provides the composeS helper')
  t.equal(Helpers.curry, curry, 'provides the curry helper')
  t.equal(Helpers.defaultProps, defaultProps, 'provides the defaultProps helper')
  t.equal(Helpers.defaultTo, defaultTo, 'provides the defaultTo helper')
  t.equal(Helpers.dissoc, dissoc, 'provides the dissoc helper')
  t.equal(Helpers.fromPairs, fromPairs, 'provides the fromPairs helper')
  t.equal(Helpers.liftA2, liftA2, 'provides the liftA2 helper')
  t.equal(Helpers.liftA3, liftA3, 'provides the liftA3 helper')
  t.equal(Helpers.liftN, liftN, 'provides the liftN helper')
  t.equal(Helpers.mapProps, mapProps, 'provides the mapProps helper')
  t.equal(Helpers.mapReduce, mapReduce, 'provides the mapReduce helper')
  t.equal(Helpers.mconcat, mconcat, 'provides the mconcat helper')
  t.equal(Helpers.mconcatMap, mconcatMap, 'provides the mconcatMap helper')
  t.equal(Helpers.mreduce, mreduce, 'provides the mreduce helper')
  t.equal(Helpers.mreduceMap, mreduceMap, 'provides the mreduceMap helper')
  t.equal(Helpers.nAry, nAry, 'provides the nAry helper')
  t.equal(Helpers.objOf, objOf, 'provides the objOf helper')
  t.equal(Helpers.omit, omit, 'provides the omit helper')
  t.equal(Helpers.once, once, 'provides the once helper')
  t.equal(Helpers.partial, partial, 'provides the partial helper')
  t.equal(Helpers.pick, pick, 'provides the pick helper')
  t.equal(Helpers.pipe, pipe, 'provides the pipe helper')
  t.equal(Helpers.pipeK, pipeK, 'provides the pipeK helper')
  t.equal(Helpers.pipeP, pipeP, 'provides the pipeP helper')
  t.equal(Helpers.pipeS, pipeS, 'provides the pipeS helper')
  t.equal(Helpers.propOr, propOr, 'provides the propOr helper')
  t.equal(Helpers.propPathOr, propPathOr, 'provides the propPathOr helper')
  t.equal(Helpers.setPath, setPath, 'provides the setPath helper')
  t.equal(Helpers.setProp, setProp, 'provides the setProp helper')
  t.equal(Helpers.tap, tap, 'provides the tap helper')
  t.equal(Helpers.unary, unary, 'provides the unary helper')
  t.equal(Helpers.unit, unit, 'provides the unit helper')
  t.equal(Helpers.unsetPath, unsetPath, 'provides the unsetPath helper')

  t.end()
})
