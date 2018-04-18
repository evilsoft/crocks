/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */
/** @author Henrique Limas */

import combinators from './combinators.js'
import helpers from './helpers.js'
import logic from './logic.js'
import pointfree from './pointfree.js'
import predicates from './predicates.js'
import transforms from './transforms.js'

import All from './All.js'
import Any from './Any.js'
import Assign from './Assign.js'
import Endo from './Endo.js'
import First from './First.js'
import Last from './Last.js'
import Max from './Max.js'
import Min from './Min.js'
import Prod from './Prod.js'
import Sum from './Sum.js'

const monoids = {
  All,
  Any,
  Assign,
  Endo,
  First,
  Last,
  Max,
  Min,
  Prod,
  Sum
}

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
import Reader from './Reader'
import ReaderT from './Reader/ReaderT'
import Result from './Result'
import Star from './Star'
import State from './State'
import Unit from './Unit'
import Writer from './Writer'

const crocks = {
  Arrow,
  Async,
  Const,
  Either,
  Equiv,
  Identity,
  IO,
  List,
  Maybe,
  Pair,
  Pred,
  Reader,
  ReaderT,
  Result,
  Star,
  State,
  Unit,
  Writer
}

export default Object.assign(
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
