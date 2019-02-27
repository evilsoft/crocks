import test from 'tape'
import * as Crocks from '.'

// combinators
import applyTo from './combinators/applyTo'
import composeB from './combinators/composeB'
import constant from './combinators/constant'
import flip from './combinators/flip'
import identity from './combinators/identity'
import substitution from './combinators/substitution'

// Crocks
import Arrow from './Arrow'
import Async from './Async'
import Const from './Const'
import Either from './Either'
import Equiv from './Equiv'
import Identity from './Identity'
import IO from './IO'
import List from './List'
import Maybe from './Maybe'
import Pair from './Pair'
import Pred from './Pred'
import Result from './Result'
import Reader from './Reader'
import ReaderT from './Reader/ReaderT'
import Star from './Star'
import State from './State'
import Tuple from './Tuple'
import Unit from './Unit'
import Writer from './Writer'

// helpers
import assign from './helpers/assign'
import assoc from './helpers/assoc'
import binary from './helpers/binary'
import branch from './Pair/branch'
import compose from './helpers/compose'
import composeK from './helpers/composeK'
import composeP from './helpers/composeP'
import composeS from './helpers/composeS'
import curry from './helpers/curry'
import defaultProps from './helpers/defaultProps'
import defaultTo from './helpers/defaultTo'
import dissoc from './helpers/dissoc'
import fanout from './Pair/fanout'
import fromPairs from './helpers/fromPairs'
import liftA2 from './helpers/liftA2'
import liftA3 from './helpers/liftA3'
import liftN from './helpers/liftN'
import mapProps from './helpers/mapProps'
import mapReduce from './helpers/mapReduce'
import mconcat from './helpers/mconcat'
import mconcatMap from './helpers/mconcatMap'
import mreduce from './helpers/mreduce'
import mreduceMap from './helpers/mreduceMap'
import nAry from './helpers/nAry'
import objOf from './helpers/objOf'
import omit from './helpers/omit'
import once from './helpers/once'
import partial from './helpers/partial'
import pick from './helpers/pick'
import pipe from './helpers/pipe'
import pipeK from './helpers/pipeK'
import pipeP from './helpers/pipeP'
import pipeS from './helpers/pipeS'
import prop from './Maybe/prop'
import propOr from './helpers/propOr'
import propPath from './Maybe/propPath'
import propPathOr from './helpers/propPathOr'
import safe from './Maybe/safe'
import safeLift from './Maybe/safeLift'
import setPath from './helpers/setPath'
import setProp from './helpers/setProp'
import tap from './helpers/tap'
import toPairs from './Pair/toPairs'
import tryCatch from './Result/tryCatch'
import unary from './helpers/unary'
import unit from './helpers/unit'
import unsetPath from './helpers/unsetPath'

// logic
import and from './logic/and'
import ifElse from './logic/ifElse'
import implies from './logic/implies'
import not from './logic/not'
import or from './logic/or'
import unless from './logic/unless'
import when from './logic/when'

// monoids
import All from './All'
import Any from './Any'
import Assign from './Assign'
import Endo from './Endo'
import First from './First'
import Last from './Last'
import Max from './Max'
import Min from './Min'
import Prod from './Prod'
import Sum from './Sum'

// pointfree
import alt from './pointfree/alt'
import ap from './pointfree/ap'
import bimap from './pointfree/bimap'
import both from './pointfree/both'
import chain from './pointfree/chain'
import coalesce from './pointfree/coalesce'
import compareWith from './pointfree/compareWith'
import concat from './pointfree/concat'
import cons from './pointfree/cons'
import contramap from './pointfree/contramap'
import either from './pointfree/either'
import empty from './pointfree/empty'
import equals from './pointfree/equals'
import evalWith from './State/evalWith'
import execWith from './State/execWith'
import extend from './pointfree/extend'
import filter from './pointfree/filter'
import first from './pointfree/first'
import fold from './pointfree/fold'
import foldMap from './pointfree/foldMap'
import fst from './Pair/fst'
import head from './pointfree/head'
import log from './Writer/log'
import nmap from './Tuple/nmap'
import map from './pointfree/map'
import merge from './pointfree/merge'
import option from './pointfree/option'
import project from './Tuple/project'
import promap from './pointfree/promap'
import race from './Async/race'
import read from './Writer/read'
import reduce from './pointfree/reduce'
import reduceRight from './pointfree/reduceRight'
import reject from './pointfree/reject'
import run from './pointfree/run'
import runWith from './pointfree/runWith'
import second from './pointfree/second'
import sequence from './pointfree/sequence'
import snd from './Pair/snd'
import swap from './pointfree/swap'
import tail from './pointfree/tail'
import traverse from './pointfree/traverse'
import valueOf from './pointfree/valueOf'

// predicates
import hasProp from './predicates/hasProp'
import hasPropPath from './predicates/hasPropPath'
import isAlt from './predicates/isAlt'
import isAlternative from './predicates/isAlternative'
import isApplicative from './predicates/isApplicative'
import isApply from './predicates/isApply'
import isArray from './predicates/isArray'
import isBifunctor from './predicates/isBifunctor'
import isBoolean from './predicates/isBoolean'
import isCategory from './predicates/isCategory'
import isChain from './predicates/isChain'
import isContravariant from './predicates/isContravariant'
import isDate from './predicates/isDate'
import isDefined from './predicates/isDefined'
import isEmpty from './predicates/isEmpty'
import isExtend from './predicates/isExtend'
import isFoldable from './predicates/isFoldable'
import isFunction from './predicates/isFunction'
import isFunctor from './predicates/isFunctor'
import isInteger from './predicates/isInteger'
import isIterable from './predicates/isIterable'
import isMonad from './predicates/isMonad'
import isMonoid from './predicates/isMonoid'
import isNil from './predicates/isNil'
import isNumber from './predicates/isNumber'
import isObject from './predicates/isObject'
import isPlus from './predicates/isPlus'
import isProfunctor from './predicates/isProfunctor'
import isPromise from './predicates/isPromise'
import isSame from './predicates/isSame'
import isSameType from './predicates/isSameType'
import isSemigroup from './predicates/isSemigroup'
import isSemigroupoid from './predicates/isSemigroupoid'
import isSetoid from './predicates/isSetoid'
import isString from './predicates/isString'
import isSymbol from './predicates/isSymbol'
import isTraversable from './predicates/isTraversable'
import propEq from './predicates/propEq'
import propPathEq from './predicates/propPathEq'
import propSatisfies from './predicates/propSatisfies'
import propPathSatisfies from './predicates/propPathSatisfies'

// transforms
import arrayToList from './List/arrayToList'
import asyncToPromise from './Async/asyncToPromise'
import eitherToAsync from './Async/eitherToAsync'
import eitherToFirst from './First/eitherToFirst'
import eitherToLast from './Last/eitherToLast'
import eitherToMaybe from './Maybe/eitherToMaybe'
import eitherToResult from './Result/eitherToResult'
import find from './Maybe/find'
import firstToAsync from './Async/firstToAsync'
import firstToEither from './Either/firstToEither'
import firstToLast from './Last/firstToLast'
import firstToMaybe from './Maybe/firstToMaybe'
import firstToResult from './Result/firstToResult'
import lastToAsync from './Async/lastToAsync'
import lastToEither from './Either/lastToEither'
import lastToFirst from './First/lastToFirst'
import lastToMaybe from './Maybe/lastToMaybe'
import lastToResult from './Result/lastToResult'
import listToArray from './List/listToArray'
import maybeToAsync from './Async/maybeToAsync'
import maybeToEither from './Either/maybeToEither'
import maybeToFirst from './First/maybeToFirst'
import maybeToLast from './Last/maybeToLast'
import maybeToResult from './Result/maybeToResult'
import resultToAsync from './Async/resultToAsync'
import resultToEither from './Either/resultToEither'
import resultToFirst from './First/resultToFirst'
import resultToLast from './Last/resultToLast'
import resultToMaybe from './Maybe/resultToMaybe'
import tupleToArray from './Tuple/tupleToArray'
import writerToPair from './Pair/writerToPair'

test('entry', t => {
  t.equal(typeof Crocks, 'object', 'is an object')

  // combinators
  t.equal(Crocks.applyTo, applyTo, 'provides the T combinator (applyTo)')
  t.equal(Crocks.composeB, composeB, 'provides the B combinator (composeB)')
  t.equal(Crocks.constant, constant, 'provides the K combinator (constant)')
  t.equal(Crocks.flip, flip, 'provides the C combinator (flip)')
  t.equal(Crocks.identity, identity, 'provides the I combinator (identity)')
  t.equal(Crocks.substitution, substitution, 'provides the S combinator (substitution)')

  // Crocks
  t.equal(Crocks.Arrow, Arrow, 'provides the Arrow crock')
  t.equal(Crocks.Async, Async, 'provides the Async crock')
  t.equal(Crocks.Const, Const, 'provides the Const crock')
  t.equal(Crocks.Either, Either, 'provides the Either crock')
  t.equal(Crocks.Equiv, Equiv, 'provides the Equiv crock')
  t.equal(Crocks.Identity, Identity, 'provides the Identity crock')
  t.equal(Crocks.IO, IO, 'provides the IO crock')
  t.equal(Crocks.List, List, 'provides the List crock')
  t.equal(Crocks.Maybe, Maybe, 'provides the Maybe crock')
  t.equal(Crocks.Pair, Pair, 'provides the Pair crock')
  t.equal(Crocks.Pred, Pred, 'provides the Pred crock')
  t.equal(Crocks.Result, Result, 'provides the Result crock')
  t.equal(Crocks.Reader, Reader, 'provides the Reader crock')
  t.equal(Crocks.ReaderT, ReaderT, 'provides the ReaderT crock')
  t.equal(Crocks.Star, Star, 'provides the Star crock')
  t.equal(Crocks.State, State, 'provides the State crock')
  t.equal(Crocks.Tuple, Tuple, 'provides the Unit crock')
  t.equal(Crocks.Unit, Unit, 'provides the Unit crock')
  t.equal(Crocks.Writer, Writer, 'provides the Writer crock')

  // helpers
  t.equal(Crocks.assign, assign, 'provides the assign helper')
  t.equal(Crocks.assoc, assoc, 'provides the assoc helper')
  t.equal(Crocks.binary, binary, 'provides the binary helper')
  t.equal(Crocks.branch, branch, 'provides the branch helper')
  t.equal(Crocks.compose, compose, 'provides the compose helper')
  t.equal(Crocks.composeK, composeK, 'provides the composeK helper')
  t.equal(Crocks.composeP, composeP, 'provides the composeP helper')
  t.equal(Crocks.composeS, composeS, 'provides the composeS helper')
  t.equal(Crocks.curry, curry, 'provides the curry helper')
  t.equal(Crocks.defaultProps, defaultProps, 'provides the defaultProps helper')
  t.equal(Crocks.defaultTo, defaultTo, 'provides the defaultTo helper')
  t.equal(Crocks.dissoc, dissoc, 'provides the dissoc helper')
  t.equal(Crocks.fanout, fanout, 'provides the fanout helper')
  t.equal(Crocks.fromPairs, fromPairs, 'provides the fromPairs helper')
  t.equal(Crocks.find, find, 'provides the find helper')
  t.equal(Crocks.liftA2, liftA2, 'provides the liftA2 helper')
  t.equal(Crocks.liftA3, liftA3, 'provides the liftA3 helper')
  t.equal(Crocks.liftN, liftN, 'provides the liftN helper')
  t.equal(Crocks.mapProps, mapProps, 'provides the mapProps helper')
  t.equal(Crocks.mapReduce, mapReduce, 'provides the mapReduce helper')
  t.equal(Crocks.mconcat, mconcat, 'provides the mconcat helper')
  t.equal(Crocks.mconcatMap, mconcatMap, 'provides the mconcatMap helper')
  t.equal(Crocks.mreduce, mreduce, 'provides the mreduce helper')
  t.equal(Crocks.mreduceMap, mreduceMap, 'provides the mreduceMap helper')
  t.equal(Crocks.nAry, nAry, 'provides the nAry helper')
  t.equal(Crocks.objOf, objOf, 'provides the objOf helper')
  t.equal(Crocks.omit, omit, 'provides the omit helper')
  t.equal(Crocks.once, once, 'provides the once helper')
  t.equal(Crocks.partial, partial, 'provides the partial helper')
  t.equal(Crocks.pick, pick, 'provides the pick helper')
  t.equal(Crocks.pipe, pipe, 'provides the pipe helper')
  t.equal(Crocks.pipeK, pipeK, 'provides the pipeK helper')
  t.equal(Crocks.pipeP, pipeP, 'provides the pipeP helper')
  t.equal(Crocks.pipeS, pipeS, 'provides the pipeS helper')
  t.equal(Crocks.prop, prop, 'provides the prop helper')
  t.equal(Crocks.propOr, propOr, 'provides the propOr helper')
  t.equal(Crocks.propPath, propPath, 'provides the propPath helper')
  t.equal(Crocks.propPathOr, propPathOr, 'provides the propPathOr helper')
  t.equal(Crocks.safe, safe, 'provides the safe helper')
  t.equal(Crocks.safeLift, safeLift, 'provides the safeLift helper')
  t.equal(Crocks.setPath, setPath, 'provides the setPath helper')
  t.equal(Crocks.setProp, setProp, 'provides the setProp helper')
  t.equal(Crocks.tap, tap, 'provides the tap helper')
  t.equal(Crocks.toPairs, toPairs, 'provides the toPairs helper')
  t.equal(Crocks.tryCatch, tryCatch, 'provides the tryCatch helper')
  t.equal(Crocks.unary, unary, 'provides the unary helper')
  t.equal(Crocks.unit, unit, 'provides the unit helper')
  t.equal(Crocks.unsetPath, unsetPath, 'provides the unsetPath helper')

  // logic
  t.equal(Crocks.and, and, 'provides the and logic')
  t.equal(Crocks.ifElse, ifElse, 'provides the ifElse logic')
  t.equal(Crocks.implies, implies, 'provides the implies logic')
  t.equal(Crocks.not, not, 'provides the not logic')
  t.equal(Crocks.or, or, 'provides the or logic')
  t.equal(Crocks.unless, unless, 'provides the unless logic')
  t.equal(Crocks.when, when, 'provides the when logic')

  // monoids
  t.equal(Crocks.All, All, 'provides the All monoid')
  t.equal(Crocks.Any, Any, 'provides the Any monoid')
  t.equal(Crocks.Assign, Assign, 'provides the Assign monoid')
  t.equal(Crocks.Endo, Endo, 'provides the Endo monoid')
  t.equal(Crocks.First, First, 'provides the First monoid')
  t.equal(Crocks.Last, Last, 'provides the Last monoid')
  t.equal(Crocks.Max, Max, 'provides the Max monoid')
  t.equal(Crocks.Min, Min, 'provides the Min monoid')
  t.equal(Crocks.Prod, Prod, 'provides the Prod monoid')
  t.equal(Crocks.Sum, Sum, 'provides the Sum monoid')

  // pointfree
  t.equal(Crocks.alt, alt, 'provides the alt pointfree')
  t.equal(Crocks.ap, ap, 'provides the ap pointfree')
  t.equal(Crocks.bimap, bimap, 'provides the bimap pointfree')
  t.equal(Crocks.both, both, 'provides the both pointfree')
  t.equal(Crocks.chain, chain, 'provides the chain pointfree')
  t.equal(Crocks.compareWith, compareWith, 'provides the compareWith pointfree')
  t.equal(Crocks.coalesce, coalesce, 'provides the coalesce pointfree')
  t.equal(Crocks.concat, concat, 'provides the concat pointfree')
  t.equal(Crocks.cons, cons, 'provides the cons pointfree')
  t.equal(Crocks.contramap, contramap, 'provides the contramap pointfree')
  t.equal(Crocks.either, either, 'provides the either pointfree')
  t.equal(Crocks.empty, empty, 'provides the empty pointfree')
  t.equal(Crocks.equals, equals, 'provides the equals pointfree')
  t.equal(Crocks.evalWith, evalWith, 'provides the evalWith pointfree')
  t.equal(Crocks.execWith, execWith, 'provides the execWith pointfree')
  t.equal(Crocks.extend, extend, 'provides the extend pointfree')
  t.equal(Crocks.filter, filter, 'provides the filter pointfree')
  t.equal(Crocks.first, first, 'provides the first pointfree')
  t.equal(Crocks.fold, fold, 'provides the fold pointfree')
  t.equal(Crocks.foldMap, foldMap, 'provides the foldMap pointfree')
  t.equal(Crocks.fst, fst, 'provides the fst pointfree')
  t.equal(Crocks.head, head, 'provides the head pointfree')
  t.equal(Crocks.log, log, 'provides the log pointfree')
  t.equal(Crocks.nmap, nmap, 'provides the nmap pointfree')
  t.equal(Crocks.map, map, 'provides the map pointfree')
  t.equal(Crocks.merge, merge, 'provides the merge pointfree')
  t.equal(Crocks.option, option, 'provides the option pointfree')
  t.equal(Crocks.project, project, 'provides the project pointfree')
  t.equal(Crocks.promap, promap, 'provides the promap pointfree')
  t.equal(Crocks.race, race, 'provides the race pointfree')
  t.equal(Crocks.read, read, 'provides the read pointfree')
  t.equal(Crocks.reduce, reduce, 'provides the reduce pointfree')
  t.equal(Crocks.reduceRight, reduceRight, 'provides the reduceRight pointfree')
  t.equal(Crocks.reject, reject, 'provides the reject pointfree')
  t.equal(Crocks.run, run, 'provides the run pointfree')
  t.equal(Crocks.runWith, runWith, 'provides the runWith pointfree')
  t.equal(Crocks.second, second, 'provides the second pointfree')
  t.equal(Crocks.sequence, sequence, 'provides the sequence pointfree')
  t.equal(Crocks.snd, snd, 'provides the snd pointfree')
  t.equal(Crocks.swap, swap, 'provides the swap pointfree')
  t.equal(Crocks.tail, tail, 'provides the tail pointfree')
  t.equal(Crocks.traverse, traverse, 'provides the traverse pointfree')
  t.equal(Crocks.valueOf, valueOf, 'provides the valueOf pointfree')

  // predicates
  t.equal(Crocks.hasProp, hasProp, 'provides the hasProp predicate')
  t.equal(Crocks.hasPropPath, hasPropPath, 'provides the hasPropPath predicate')
  t.equal(Crocks.isAlt, isAlt, 'provides the isAlt predicate')
  t.equal(Crocks.isAlternative, isAlternative, 'provides the isAlternative predicate')
  t.equal(Crocks.isApply, isApply, 'provides the isApply predicate')
  t.equal(Crocks.isApplicative, isApplicative, 'provides the isApply predicate')
  t.equal(Crocks.isArray, isArray, 'provides the isArray predicate')
  t.equal(Crocks.isBifunctor, isBifunctor, 'provides the isBifunctor predicate')
  t.equal(Crocks.isBoolean, isBoolean, 'provides the isBoolean predicate')
  t.equal(Crocks.isCategory, isCategory, 'provides the isCategory predicate')
  t.equal(Crocks.isChain, isChain, 'provides the isChain predicate')
  t.equal(Crocks.isContravariant, isContravariant, 'provides the isContravariant predicate')
  t.equal(Crocks.isDate, isDate, 'provides the isDate predicate')
  t.equal(Crocks.isDefined, isDefined, 'provides the isDefined predicate')
  t.equal(Crocks.isEmpty, isEmpty, 'provides the isEmpty predicate')
  t.equal(Crocks.isExtend, isExtend, 'provides the isExtend predicate')
  t.equal(Crocks.isFoldable, isFoldable, 'provides the isFoldable predicate')
  t.equal(Crocks.isFunction, isFunction, 'provides the isFunction predicate')
  t.equal(Crocks.isFunctor, isFunctor, 'provides the isFunctor predicate')
  t.equal(Crocks.isInteger, isInteger, 'provides the isInteger predicate')
  t.equal(Crocks.isIterable, isIterable, 'provides the isIterable predicate')
  t.equal(Crocks.isMonad, isMonad, 'provides the isMonad predicate')
  t.equal(Crocks.isMonoid, isMonoid, 'provides the isMonoid predicate')
  t.equal(Crocks.isNil, isNil, 'provides the isNil predicate')
  t.equal(Crocks.isNumber, isNumber, 'provides the isNumber predicate')
  t.equal(Crocks.isObject, isObject, 'provides the isObject predicate')
  t.equal(Crocks.isPlus, isPlus, 'provides the isPlus predicate')
  t.equal(Crocks.isProfunctor, isProfunctor, 'provides the isProfunctor predicate')
  t.equal(Crocks.isPromise, isPromise, 'provides the isPromise predicate')
  t.equal(Crocks.isSame, isSame, 'provides the isSame predicate')
  t.equal(Crocks.isSameType, isSameType, 'provides the isSameType predicate')
  t.equal(Crocks.isSemigroup, isSemigroup, 'provides the isSemigroup predicate')
  t.equal(Crocks.isSemigroupoid, isSemigroupoid, 'provides the isSemigroupoid predicate')
  t.equal(Crocks.isSetoid, isSetoid, 'provides the isSetoid predicate')
  t.equal(Crocks.isString, isString, 'provides the isString predicate')
  t.equal(Crocks.isSymbol, isSymbol, 'provides the isSymbol predicate')
  t.equal(Crocks.isTraversable, isTraversable, 'provides the isTraversable predicate')
  t.equal(Crocks.propEq, propEq, 'provides the propEq predicate')
  t.equal(Crocks.propPathEq, propPathEq, 'provides the propEq predicate')
  t.equal(Crocks.propSatisfies, propSatisfies, 'provides the propSatisfies predicate')
  t.equal(Crocks.propPathSatisfies, propPathSatisfies, 'provides the propPathSatisfies predicate')

  // transforms
  t.equal(Crocks.arrayToList, arrayToList, 'provides the arrayToList transform')
  t.equal(Crocks.asyncToPromise, asyncToPromise, 'provides the asyncToPromise transform')
  t.equal(Crocks.eitherToAsync, eitherToAsync, 'provides the eitherToAsync transform')
  t.equal(Crocks.eitherToFirst, eitherToFirst, 'provides the eitherToFirst transform')
  t.equal(Crocks.eitherToLast, eitherToLast, 'provides the eitherToLast transform')
  t.equal(Crocks.eitherToMaybe, eitherToMaybe, 'provides the eitherToMaybe transform')
  t.equal(Crocks.eitherToResult, eitherToResult, 'provides the eitherToResult transform')
  t.equal(Crocks.firstToAsync, firstToAsync, 'provides the firstToAsync transform')
  t.equal(Crocks.firstToEither, firstToEither, 'provides the firstToEither transform')
  t.equal(Crocks.firstToLast, firstToLast, 'provides the firstToLast transform')
  t.equal(Crocks.firstToMaybe, firstToMaybe, 'provides the firstToMaybe transform')
  t.equal(Crocks.firstToResult, firstToResult, 'provides the firstToResult transform')
  t.equal(Crocks.lastToAsync, lastToAsync, 'provides the lastToAsync transform')
  t.equal(Crocks.lastToEither, lastToEither, 'provides the lastToEither transform')
  t.equal(Crocks.lastToFirst, lastToFirst, 'provides the lastToFirst transform')
  t.equal(Crocks.lastToMaybe, lastToMaybe, 'provides the lastToMaybe transform')
  t.equal(Crocks.lastToResult, lastToResult, 'provides the lastToResult transform')
  t.equal(Crocks.listToArray, listToArray, 'provides the listToArray transform')
  t.equal(Crocks.maybeToAsync, maybeToAsync, 'provides the maybeToAsync transform')
  t.equal(Crocks.maybeToEither, maybeToEither, 'provides the maybeToEither transform')
  t.equal(Crocks.maybeToFirst, maybeToFirst, 'provides the maybeToFirst transform')
  t.equal(Crocks.maybeToLast, maybeToLast, 'provides the maybeToLast transform')
  t.equal(Crocks.maybeToResult, maybeToResult, 'provides the maybeToResult transform')
  t.equal(Crocks.resultToAsync, resultToAsync, 'provides the resultToAsync transform')
  t.equal(Crocks.resultToEither, resultToEither, 'provides the resultToEither transform')
  t.equal(Crocks.resultToFirst, resultToFirst, 'provides the resultToFirst transform')
  t.equal(Crocks.resultToLast, resultToLast, 'provides the resultToLast transform')
  t.equal(Crocks.resultToMaybe, resultToMaybe, 'provides the resultToMaybe transform')
  t.equal(Crocks.tupleToArray, tupleToArray, 'provides the tupleToArray transform')
  t.equal(Crocks.writerToPair, writerToPair, 'provides the writerToPair transform')

  t.end()
})
