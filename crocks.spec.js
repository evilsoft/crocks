const test = require('tape')

const crocks = require('./crocks')

const applyTo = require('./combinators/applyTo')
const composeB = require('./combinators/composeB')
const constant = require('./combinators/constant')
const flip = require('./combinators/flip')
const identity = require('./combinators/identity')
const reverseApply = require('./combinators/reverseApply')
const substitution = require('./combinators/substitution')

const branch = require('./helpers/branch')
const compose = require('./helpers/compose')
const curry = require('./helpers/curry')
const curryN = require('./helpers/curryN')
const fanout = require('./helpers/fanout')
const ifElse = require('./helpers/ifElse')
const liftA2 = require('./helpers/liftA2')
const liftA3 = require('./helpers/liftA3')
const mconcat = require('./helpers/mconcat')
const mconcatMap = require('./helpers/mconcatMap')
const mreduce = require('./helpers/mreduce')
const mreduceMap = require('./helpers/mreduceMap')
const not = require('./helpers/not')
const once = require('./helpers/once')
const pipe = require('./helpers/pipe')
const prop = require('./helpers/prop')
const propPath = require('./helpers/propPath')
const safe = require('./helpers/safe')
const safeLift = require('./helpers/safeLift')
const tap = require('./helpers/tap')
const tryCatch = require('./helpers/tryCatch')
const unless = require('./helpers/unless')
const when = require('./helpers/when')

const alt = require('./pointfree/alt')
const ap = require('./pointfree/ap')
const bimap = require('./pointfree/bimap')
const chain = require('./pointfree/chain')
const coalesce = require('./pointfree/coalesce')
const concat = require('./pointfree/concat')
const contramap = require('./pointfree/contramap')
const map = require('./pointfree/map')
const promap = require('./pointfree/promap')
const sequence = require('./pointfree/sequence')
const swap = require('./pointfree/swap')
const traverse = require('./pointfree/traverse')

const both = require('./pointfree/both')
const cons = require('./pointfree/cons')
const either = require('./pointfree/either')
const evalWith = require('./pointfree/evalWith')
const execWith = require('./pointfree/execWith')
const filter = require('./pointfree/filter')
const first = require('./pointfree/first')
const fst = require('./pointfree/fst')
const head = require('./pointfree/head')
const log = require('./pointfree/log')
const maybe = require('./pointfree/maybe')
const merge = require('./pointfree/merge')
const option = require('./pointfree/option')
const read = require('./pointfree/read')
const reduce = require('./pointfree/reduce')
const run = require('./pointfree/run')
const runWith = require('./pointfree/runWith')
const second = require('./pointfree/second')
const snd = require('./pointfree/snd')
const tail = require('./pointfree/tail')
const value = require('./pointfree/value')

const Arrow = require('./crocks/Arrow')
const Async = require('./crocks/Async')
const Const = require('./crocks/Const')
const Either = require('./crocks/Either')
const Identity = require('./crocks/Identity')
const IO = require('./crocks/IO')
const List = require('./crocks/List')
const Maybe = require('./crocks/Maybe')
const Pair = require('./crocks/Pair')
const Pred = require('./crocks/Pred')
const Reader = require('./crocks/Reader')
const Star = require('./crocks/Star')
const State = require('./crocks/State')
const Unit = require('./crocks/Unit')
const Writer = require('./crocks/Writer')

const All = require('./monoids/All')
const Any = require('./monoids/Any')
const Assign = require('./monoids/Assign')
const Min = require('./monoids/Min')
const Max = require('./monoids/Max')
const Prod = require('./monoids/Prod')
const Sum = require('./monoids/Sum')

const hasKey = require('./predicates/hasKey')
const isAlt = require('./predicates/isAlt')
const isApplicative = require('./predicates/isApplicative')
const isApply = require('./predicates/isApply')
const isArray = require('./predicates/isArray')
const isBoolean = require('./predicates/isBoolean')
const isDefined = require('./predicates/isDefined')
const isEmpty = require('./predicates/isEmpty')
const isFoldable = require('./predicates/isFoldable')
const isFunction = require('./predicates/isFunction')
const isFunctor = require('./predicates/isFunctor')
const isInteger = require('./predicates/isInteger')
const isMonad = require('./predicates/isMonad')
const isMonoid = require('./predicates/isMonoid')
const isNil = require('./predicates/isNil')
const isNumber = require('./predicates/isNumber')
const isObject = require('./predicates/isObject')
const isSameType = require('./predicates/isSameType')
const isSemigroup = require('./predicates/isSemigroup')
const isSetoid = require('./predicates/isSetoid')
const isString = require('./predicates/isString')
const isTraversable = require('./predicates/isTraversable')

const eitherToAsync = require('./transforms/eitherToAsync')
const eitherToMaybe = require('./transforms/eitherToMaybe')
const maybeToAsync = require('./transforms/maybeToAsync')
const maybeToEither  = require('./transforms/maybeToEither')

test('entry', t => {
  t.equal(crocks.toString(), '[object Object]', 'is an object')

  t.equal(crocks.applyTo, applyTo, 'provides the A combinator (applyTo)')
  t.equal(crocks.composeB, composeB, 'provides the B combinator (composeB)')
  t.equal(crocks.constant, constant, 'provides the K combinator (constant)')
  t.equal(crocks.flip, flip, 'provides the C combinator (flip)')
  t.equal(crocks.identity, identity, 'provides the I combinator (identity)')
  t.equal(crocks.reverseApply, reverseApply, 'provides the T combinator (reverseApply)')
  t.equal(crocks.substitution, substitution, 'provides the S combinator (substitution)')

  t.equal(crocks.branch, branch, 'provides the branch function')
  t.equal(crocks.compose, compose, 'provides the compose function')
  t.equal(crocks.curry, curry, 'provides the curry function')
  t.equal(crocks.curryN, curryN, 'provides the curryN function')
  t.equal(crocks.fanout, fanout, 'provides the fanout function')
  t.equal(crocks.ifElse, ifElse, 'provides the ifElse function')
  t.equal(crocks.liftA2, liftA2, 'provides the liftA2 function')
  t.equal(crocks.liftA3, liftA3, 'provides the liftA3 function')
  t.equal(crocks.mconcat, mconcat, 'provides the mconcat function')
  t.equal(crocks.mconcatMap, mconcatMap, 'provides the mconcatMap function')
  t.equal(crocks.mreduce, mreduce, 'provides the mreduce function')
  t.equal(crocks.mreduceMap, mreduceMap, 'provides the mreduceMap function')
  t.equal(crocks.not, not, 'provides the not function')
  t.equal(crocks.once, once, 'provides the once function')
  t.equal(crocks.pipe, pipe, 'provides the pipe function')
  t.equal(crocks.prop, prop, 'provides the prop function')
  t.equal(crocks.propPath, propPath, 'provides the propPath function')
  t.equal(crocks.safe, safe, 'provides the safe function')
  t.equal(crocks.safeLift, safeLift, 'provides the safeLift function')
  t.equal(crocks.tap, tap, 'provides the tap function')
  t.equal(crocks.tryCatch, tryCatch, 'provides the tryCatch function')
  t.equal(crocks.unless, unless, 'provides the unless function')
  t.equal(crocks.when, when, 'provides the when function')

  t.equal(crocks.alt, alt, 'provides the alt point-free function')
  t.equal(crocks.ap, ap, 'provides the ap point-free function')
  t.equal(crocks.bimap, bimap, 'provides the bimap point-free function')
  t.equal(crocks.chain, chain, 'provides the chain point-free function')
  t.equal(crocks.coalesce, coalesce, 'provides the concat point-free function')
  t.equal(crocks.concat, concat, 'provides the coalesce point-free function')
  t.equal(crocks.contramap, contramap, 'provides the contramap point-free function')
  t.equal(crocks.map, map, 'provides the map point-free function')
  t.equal(crocks.promap, promap, 'provides the promap point-free function')
  t.equal(crocks.sequence, sequence, 'provides the sequence point-free function')
  t.equal(crocks.swap, swap, 'provides the swap point-free function')
  t.equal(crocks.traverse, traverse, 'provides the traverse point-free function')

  t.equal(crocks.both, both, 'provides the both point-free function')
  t.equal(crocks.cons, cons, 'provides the cons point-free function')
  t.equal(crocks.either, either, 'provides the either point-free function')
  t.equal(crocks.evalWith, evalWith, 'provides the evalWith point-free function')
  t.equal(crocks.execWith, execWith, 'provides the execWith point-free function')
  t.equal(crocks.filter, filter, 'provides the filter point-free function')
  t.equal(crocks.first, first, 'provides the first point-free function')
  t.equal(crocks.fst, fst, 'provides the fst point-free function')
  t.equal(crocks.head, head, 'provides the head point-free function')
  t.equal(crocks.log, log, 'provides the log point-free function')
  t.equal(crocks.maybe, maybe, 'provides the maybe point-free function')
  t.equal(crocks.merge, merge, 'provides the merge point-free function')
  t.equal(crocks.option, option, 'provides the option point-free function')
  t.equal(crocks.reduce, reduce, 'provides the reduce point-free function')
  t.equal(crocks.read, read, 'provides the read point-free function')
  t.equal(crocks.run, run, 'provides the run point-free function')
  t.equal(crocks.runWith, runWith, 'provides the runWith point-free function')
  t.equal(crocks.second, second, 'provides the second point-free function')
  t.equal(crocks.snd, snd, 'provides the snd point-free function')
  t.equal(crocks.tail, tail, 'provides the tail point-free function')
  t.equal(crocks.value, value, 'provides the value point-free function')

  t.equal(crocks.Arrow, Arrow, 'provides the Arrow function')
  t.equal(crocks.Async, Async, 'provides the Async function')
  t.equal(crocks.Const, Const, 'provides the Const function')
  t.equal(crocks.Either, Either, 'provides the Either function')
  t.equal(crocks.Identity, Identity, 'provides the Identity function')
  t.equal(crocks.IO, IO, 'provides the IO function')
  t.equal(crocks.List, List, 'provides the List function')
  t.equal(crocks.Maybe, Maybe, 'provides the Maybe function')
  t.equal(crocks.Pair, Pair, 'provides the Pair function')
  t.equal(crocks.Pred, Pred, 'provides the Pred function')
  t.equal(crocks.Reader, Reader, 'provides the Reader function')
  t.equal(crocks.Star, Star, 'provides the Star function')
  t.equal(crocks.State, State, 'provides the State function')
  t.equal(crocks.Unit, Unit, 'provides the Unit function')
  t.equal(crocks.Writer, Writer, 'provides the Writer function')

  t.equal(crocks.All, All, 'provides the All monoid')
  t.equal(crocks.Any, Any, 'provides the Any monoid')
  t.equal(crocks.Assign, Assign, 'provides the Assign monoid')
  t.equal(crocks.Min, Min, 'provides the Min monoid')
  t.equal(crocks.Max, Max, 'provides the Max monoid')
  t.equal(crocks.Prod, Prod, 'provides the Prod monoid')
  t.equal(crocks.Sum, Sum, 'provides the Sum monoid')

  t.equal(crocks.hasKey, hasKey, 'provides the hasKey function')
  t.equal(crocks.isAlt, isAlt, 'provides the isAlt function')
  t.equal(crocks.isApplicative, isApplicative, 'provides the isApplicative function')
  t.equal(crocks.isApply, isApply, 'provides the isApply function')
  t.equal(crocks.isArray, isArray, 'provides the isArray function')
  t.equal(crocks.isBoolean, isBoolean, 'provides the isBoolean function')
  t.equal(crocks.isDefined, isDefined, 'provides the isDefined function')
  t.equal(crocks.isEmpty, isEmpty, 'provides the isEmpty function')
  t.equal(crocks.isFoldable, isFoldable, 'provides the isFoldable function')
  t.equal(crocks.isFunction, isFunction, 'provides the isFunction function')
  t.equal(crocks.isFunctor, isFunctor, 'provides the isFunctor function')
  t.equal(crocks.isInteger, isInteger, 'provides the isInteger function')
  t.equal(crocks.isMonad, isMonad, 'provides the isMonad function')
  t.equal(crocks.isMonoid, isMonoid, 'provides the isMonoid function')
  t.equal(crocks.isNil, isNil, 'provides the isNil function')
  t.equal(crocks.isNumber, isNumber, 'provides the isNumber function')
  t.equal(crocks.isObject, isObject, 'provides the isObject function')
  t.equal(crocks.isSameType, isSameType, 'provides the isSameType function')
  t.equal(crocks.isSemigroup, isSemigroup, 'provides the isSemigroup function')
  t.equal(crocks.isSetoid, isSetoid, 'provides the isSetoid function')
  t.equal(crocks.isString, isString, 'provides the isString function')
  t.equal(crocks.isTraversable, isTraversable, 'provides the isTraversable function')

  t.equal(crocks.eitherToAsync, eitherToAsync, 'provides the eitherToAsync function')
  t.equal(crocks.eitherToMaybe, eitherToMaybe, 'provides the eitherToMaybe function')
  t.equal(crocks.maybeToAsync, maybeToAsync, 'provides the maybeToAsync function')
  t.equal(crocks.maybeToEither, maybeToEither, 'provides the maybeToEither function')

  t.end()
})
