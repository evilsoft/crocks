# Change Log for `crocks`

v0.8.4 -- January 17, 2018
--
### Additions
* READMES:  * `Assign`
  * `Endo`
  * `Maybe`
  * `Prod`
  * `Sum`

### Bug fixes
* Traversable types can now accept `Array` as its `Applicative`

### Pull Requests
* [#155 - Add Assign, Prod, Sum docs](https://github.com/evilsoft/crocks/pull/155)
* [#179 - Clean up Docs/Readme and Implement all-collaborators](https://github.com/evilsoft/crocks/pull/179)
* [#180 - More Documentation Cleanup](https://github.com/evilsoft/crocks/pull/180)
* [#182 - Better Error Specs for some of the ADTs](https://github.com/evilsoft/crocks/pull/182)
* [#184 - Accept Array as the Applicative for Traversable Types](https://github.com/evilsoft/crocks/pull/184)
* [#183 - Writing changes to docs index](https://github.com/evilsoft/crocks/pull/183)
* [#186 - Clean up heading on existing READMEs](https://github.com/evilsoft/crocks/pull/186)
* [#187 - Add Documentation for `Endo`](https://github.com/evilsoft/crocks/pull/187)
* [#185 - Add `Maybe` Documentation](https://github.com/evilsoft/crocks/pull/185)
* [#188 - Add `Endo` and `Maybe` to the documentation](https://github.com/evilsoft/crocks/pull/188)


v0.8.3 -- January 4, 2018
--
### Additions
* Github Pages Documentation
* READMES:
  * `State`
* All ADTs:
  * Add `constructor` property to all ADT instances.

### Bug fixes
* Correct spelling from 'returing' to 'returning' for a majority of the errors

### Pull Requests
* [#168 - Add constructor to instances to comply](https://github.com/evilsoft/crocks/pull/168)
* [#170 - Add linting for the READMEs](https://github.com/evilsoft/crocks/pull/170)
* [#165 - Improve documentation layout using electric.js](https://github.com/evilsoft/crocks/pull/165)
* [#172 - Some small tweaks to the build system for the Docs](https://github.com/evilsoft/crocks/pull/172)
* [#171 - Add State Docs](https://github.com/evilsoft/crocks/pull/171)
* [#173 - Expand on the Documentation a bit](https://github.com/evilsoft/crocks/pull/173)
* [#174 - Add Github style header links](https://github.com/evilsoft/crocks/pull/174)
* [#175 - Index and Cross Reference Function Documentation](https://github.com/evilsoft/crocks/pull/175)
* [#176 - Correct casing for Point-free links in Docs](https://github.com/evilsoft/crocks/pull/176)
* [#178 - Fix spelling of returing to returning](https://github.com/evilsoft/crocks/pull/178)

v0.8.2 -- December 22, 2017
--
### Additions
* READMES:
  * `Equiv`
  * `Pred`
  * `Reader`
  * `ReaderT`
* Crocks:
  * `Equiv`
  * `ReaderT`
* Helpers:
  * `propOr`
  * `propPathOr`

### Bug fixes
* `propPath` would throw when it encountered `NaN` or `null` values in the path

### Pull Requests
* [#156 - Add `ReaderT` and Documentation for both `Reader` and `ReaderT`](https://github.com/evilsoft/crocks/pull/156)
* [#158 - Add `propOr` and `propPathOr` and Documentation for both](https://github.com/evilsoft/crocks/pull/158)
* [#160 - `propPath` will no longer throw with `NaN` and `null` values.](https://github.com/evilsoft/crocks/pull/160)
* [#161 - Add the `Equiv` datatype](https://github.com/evilsoft/crocks/pull/161)
* [#166 - Add Documentation for the `Pred` datatype](https://github.com/evilsoft/crocks/pull/166)

v0.8.1 -- November 14, 2017
--
### Additions
* Helpers:
  * `mapProps`

### Bug fixes
* `runWith` on `State` did not report an error unless one of the
  methods were called. Now it throws if the result is not a `Pair`
  for all calls to `runWith`
* Update path on branch helper on README to point to location in `Pair`


### Pull Requests
* [#154 - Updated path for branch - helpers -> Pair](https://github.com/evilsoft/crocks/pull/154)
* [#152 - Better `runWith` errors for State](https://github.com/evilsoft/crocks/pull/152)
* [#153 - Add a new `mapProps` helper function](https://github.com/evilsoft/crocks/pull/153)

v0.8.0 -- November 09, 2017
--
### Breaking

* Changes `value` `pointfree` and instance methods to `valueOf`.
* All `Setoid`s now compare Object types by value.
  * `Const`
  * `Either`
  * `Identity`
  * `List`
  * `Maybe`
  * `Pair`
  * `Result`
  * `Writer`
* `read` method on `Writer` instance now returns a `Monoid m => Pair m a` instead of an Object with `{ log, value }`.

### Additions

* READMES:
  * `All`
  * `Any`
  * `Arrow`
* Predicates
  * `isSame`
* Pointfree
  * `equals`

### Bug fixes
  * `propPath` and `prop` would throw then passed `undefined`, `null` or `NaN`. Now they do not.

### Optimizations
* Just use the native es6 rest operator instead of slicing arguments.
* Optimized `isSameType` function.

### Pull Requests
* [#145 - Allow `prop` and `propPath` to accept `null` and `undefined` as data](https://github.com/evilsoft/crocks/pull/145)
* [#147 - Move to ES6 Rest operator instead of slicing arguments.](https://github.com/evilsoft/crocks/pull/147)
* [#148 - Add READMEs for All, Any and Arrow types](https://github.com/evilsoft/crocks/pull/148)
* [#149 - Equality is by value](https://github.com/evilsoft/crocks/pull/149)
* [#151 - Use `valueOf` instead of `value`](https://github.com/evilsoft/crocks/pull/151)
* [#150 - Return `Pair` for `Writer`'s `read` method](https://github.com/evilsoft/crocks/pull/150)

v0.7.1 -- August 28, 2017
--
### Additions
* Crocks
  * `Pair.toArray`
* Helpers:
  * `mapReduce`
* Transforms
  * `Pair/writerToPair`

### Optimizations
* General cleanup and better specs for `All`, `Any`, `Arrow` and `Pair`

### Pull Requests
* [#141 - Clean up `All`, `Any`, `Arrow` and `Pair`](https://github.com/evilsoft/crocks/pull/141)
* [#142 - Add Some `Pair` Transforms](https://github.com/evilsoft/crocks/pull/142)
* [#143 - Add `mapReduce` helper function](https://github.com/evilsoft/crocks/pull/143)

v0.7.0 -- July 28, 2017
--
### Breaking

  * Restructure entire folder structure into a src folder with folders for each type. Functions that construct types are now housed in their respective types folder. All general functions that work many types are still in their old folders `combinators`, `helpers`, `logic`, `pointfree` and `predicates`. All `transformation` functions have been moved into the folder of the type that they transform into (i.e. `resultToEither` is in the folder `Either`). This is the first step to moving to a monorepo format.
  * `Reader.ask` now takes either a `Function` or no arguments. If a function is provided it will map the environment through the function. No arguments behaves like `identity`.
  * Removed `State.gets` and updated `State.get` to take either a `Function` or no arguments. Passing a `Function` will apply the state to that function an update the value to match the result. No arguments behaves like `identity` matching the value to the state.
  * Allow for `Star` to be fixed to a specific `Monad`. Instead of using `Star` to construct a `Star`, it now takes a `Monad` constructor returning the consumer a constructor specific for that type of `Monad`.
  * Update `Result.alt` to accumulate `Err`s if the `Result` wraps a `Semigroup`, much like `Result.ap`, it will `concat` the `Semigroup`s together.

### Additions

* Crocks:
  * `Star.id`

### Bug fixes
  * All code is now compiled through `buble`, which means that it clears up all of the errors we were experiencing with Safari and in some instances `uglifyJS`. The code published to `npm` will now be standard `es5`.

### Optimizations
* Have all functions used by the library that are available on the public API do no type checks when called by other library functions.

### Pull Requests
* [#132 - Compile all code for a better experience and flatten API](https://github.com/evilsoft/crocks/pull/132)
* [#133 - Remove name conflict with new structure](https://github.com/evilsoft/crocks/pull/133)
* [#134 - Move type based functions into type folders](https://github.com/evilsoft/crocks/pull/134)
* [#135 - Add publish bits for new api](https://github.com/evilsoft/crocks/pull/135)
* [#136 - Use TypeProxies to remove simple type check dependencies](https://github.com/evilsoft/crocks/pull/136)
* [#137 - Make `Reader.ask` and `State.get` use identity by default ](https://github.com/evilsoft/crocks/pull/137)
* [#138 - Make `Star` a `Category` by fixing it to a given `Monad`](https://github.com/evilsoft/crocks/pull/138)
* [#139 - Update README and some :lipstick:](https://github.com/evilsoft/crocks/pull/139)
* [#140 - Accumulate `Err` on `Alt` for `Result` type](https://github.com/evilsoft/crocks/pull/140)


 v0.6.1 -- July 04, 2017
--
### Additions

* Crocks API:
  * `Pair.extend`
* Monoids:
  * `First`
  * `Last`
* Pointfree
  * `extend`
* Predicates
  * `isAlternative`
  * `isBifunctor`
  * `isContravariant`
  * `isPlus`
  * `isProfunctor`
  * `isExtend`
* Transforms
  * `eitherToFirst`
  * `eitherToLast`
  * `firstToAsync`
  * `firstToEither`
  * `firstToLast`
  * `firstToMaybe`
  * `firstToResult`
  * `lastToAsync`
  * `lastToEither`
  * `lastToFirst`
  * `lastToMaybe`
  * `lastToResult`
  * `maybeToFirst`
  * `maybeToLast`
  * `resultToFirst`
  * `resultToLast`

### Non-Breaking
* Add internal functions for typeclass determination
* Add `@@implements` function on all types for typeclass determination

### Pull Requests
* [#128 - Add `extend` to `Pair`](https://github.com/evilsoft/crocks/pull/128)
* [#129 - Add `@@implements`to allow Constructors to signal what they do](https://github.com/evilsoft/crocks/pull/129)
* [#130 - Add the Last Monoid](https://github.com/evilsoft/crocks/pull/130)
* [#131 - Add the First Monoid](https://github.com/evilsoft/crocks/pull/131)

v0.6.0 -- May 21, 2017
--
### Breaking
  * Remove `curryN` in favor of `nAry`
  * Replace `concat` and `empty` with `compose` and `id` on `Arrow`
  * Replace `concat` with `compose` on `Star`

### Additions
* Helper Functions:
  * `binary`
  * `composeK`
  * `composeS`
  * `dissoc`
  * `nAry`
  * `partial`
  * `pipeK`
  * `pipeS`
  * `unary`
  * `unit`
* Pointfree
  * `empty`
* Predicates
  * `isCategory`
  * `isSemigroupoid`

### Non-Breaking
  * Small optimization on all `pipe` and `compose` functions.

### Pull Requests
* [#121 - Add some Function based Helper functions](https://github.com/evilsoft/crocks/pull/121)
* [#124 - Add cancellation to Async](https://github.com/evilsoft/crocks/pull/124)
* [#125 - Add composeK, dissoc and pipeK](https://github.com/evilsoft/crocks/pull/125)
* [#126 - Better compose and pipe functions](https://github.com/evilsoft/crocks/pull/126)
* [#127 - Move Star and Arrow from Semigroups to Semigroupoids](https://github.com/evilsoft/crocks/pull/127)

v0.5.0 -- May 4, 2017
--
### Breaking
  * Rename `hasKey` to `hasProp`
  * Allow `ap` pointfree to accept `Array`
  * Allow `chain` pointfree to accept `Array`
  * Restrict `concat` pointfree to Semigroups of the same type
  * Restrict `liftA*` functions to `Apply`s of the same type
  * Update `isApply` predicate to report true for `Array`
  * Update `isChain` predicate to report true for `Array`
  * Allow `filter` pointfree to accept `Object`
  * Allow `reject` pointfree to accept `Object`
  * Change `tryCatch` to return a `Result` instead of `Either`
  * Remove parent name when inspecting `Either`
  * Remove parent name when inspecting `Maybe`
  * Remove parent name when inspecting `Result`

### Additions
* Helper Functions:
  * `assign`
  * `assoc`
  * `defaultProps`
  * `defaultTo`
  * `fromPairs`
  * `objOf`
  * `omit`
  * `pick`
  * `toPairs`
* Predicates
  * `isChain`

### Pull Requests
* [#110 - Rename `hasKey` to `hasProp` for :corn:sistancy](https://github.com/evilsoft/crocks/pull/110)
* [#113 - Better Linting and Some :lipstick:](https://github.com/evilsoft/crocks/pull/113)
* [#112 - Accept `Array` for `chain` and `ap` pointfree functions](https://github.com/evilsoft/crocks/pull/112)
* [#114 - `tryCatch` should return a `Result` and not an `Either`](https://github.com/evilsoft/crocks/pull/114)
* [#115 - Remove parent type on inspect string for sum types](https://github.com/evilsoft/crocks/pull/115)
* [#118 - Update `reject` and `filter` to accept `Object`s](https://github.com/evilsoft/crocks/pull/118)
* [#119 - Add a bunch of `Object` related functions.](https://github.com/evilsoft/crocks/pull/119)

v0.4.1 -- Mar. 12, 2017
--
### Additions
* Crocks:
  * `Result`
* Crock Instance Functions:
  * `List fold`
* Helper Functions:
  * `composeP`
  * `pipeP`
* Monoids:
  * `Endo`
* Pointfree Functions:
  * `fold`
* Predicate Functions:
  * `isPromise`
* Transformation Functions:
  * `eitherToResult`
  * `maybeToResult`
  * `resultToAsync`
  * `resultToEither`
  * `resultToMaybe`

### Bug fixes
* Lock `Pred` down to returning `Boolean` values as defined.

### Pull Requests
* [#91 - `Pred` should only return `Boolean`s](https://github.com/evilsoft/crocks/pull/91)
* [#101 - Add `fold` to List and a pointfree version for Arrays/Lists](https://github.com/evilsoft/crocks/pull/101)
* [#100 - Add the Result Crock](https://github.com/evilsoft/crocks/pull/100)
* [#104 - Add the Endo Monoid](https://github.com/evilsoft/crocks/pull/104)
* [#107 - Add `composeP`, `pipeP` and `isPromise`](https://github.com/evilsoft/crocks/pull/107)

v0.4.0 -- Feb. 26, 2017
--
### Additions
* Crock Instance Functions:
  * `Either concat`
  * `Identity concat`
  * `Maybe concat`

### Breaking
  * Remove `of` and `value` from `Pair`.
  * Allow `isSameType` to compare JS type constructors to JS values and value types to other value types.

### Pull Requests
* [#85 - Add `concat` to `Maybe`, `Either` and `Identity`](https://github.com/evilsoft/crocks/pull/85)
* [#86 - Remove of and value from Pair](https://github.com/evilsoft/crocks/pull/86)

v0.3.1 -- Feb. 19, 2017
--
### Additions
* Crock Instance Functions:
  * `List reject`
* Pointfree Functions
  * `reject`

### Non-Breaking
  * Clean up README a bit.
  * DRY up the `Pred`/predicate functions to use the new `predOrFunc` internal function.

### Pull Requests
* [#77 - fix up README and add reject to List and reject pointfree](https://github.com/evilsoft/crocks/pull/77)
* [#78 - predOrFunc internal function and use it to lean up the logic functions](https://github.com/evilsoft/crocks/pull/78)

v0.3.0 -- Feb. 18, 2017
--
### Breaking
  * Move the following from `helpers` folder into new `logic` folder:
    * `ifElse`
    * `not`
    * `unless`
    * `when`
  * Removed `value` from `Either` instances
  * Removed `maybe` from `Maybe` instances
  * Move `Async.rejected` to `Async.Rejected`
  * `List` constructor will now accept any value. If it is an array is makes a `List` with the same elements.

### Additions
* Crock Constructor Functions:
  * `List fromArray`
  * `Maybe zero`
  * `Async Resolved`
* Crock Instance Functions:
  * `Async alt`
  * `Either alt`
  * `List toArray`
  * `Maybe alt`
  * `Maybe zero`
* Logic Functions:
  * `and`
  * `or`
* Pointfree Functions
  * `alt`
* Predicate Functions
  * `isAlt`
* Transformation Functions:
  * `arrayToList`
  * `listToArray`

### Non-Breaking
  * Clean up signatures on README.
  * Add `gitter` badge to README.
  * Add CHANGELOG to the mix

### Pull Requests
* [#62 - Adds constructor _fromArray_ and instance _toArray_](https://github.com/evilsoft/crocks/pull/62)
* [#64 - Adds Array <-> List transforms](https://github.com/evilsoft/crocks/pull/64)
* [#73 - Add `alt` and `zero` for `Alt` and `Plus` on the Coproducts](https://github.com/evilsoft/crocks/pull/73)
* [#53 - Move logic functions into new `logic` folder and add `and` and `or` functions](https://github.com/evilsoft/crocks/pull/53)
* [#56 - Remove extraction functions from `Either` and `Maybe`](https://github.com/evilsoft/crocks/pull/56)
* [#74 - Make Async more :corn:sistant with Resovled/Rejected](https://github.com/evilsoft/crocks/pull/74)
* [#75 - Update List constructor to act like `of` for non-array values](https://github.com/evilsoft/crocks/pull/75)

v0.2.3 -- Feb. 4, 2017
--
### Additions
* Crock Instance Functions:
  * `Arrow both`
  * `Star both`
* Pointfree Functions:
  * `both`
  * `Arrow.both instance`
  * `Star.both instance`
* Predicate Functions:
  * `isSameType`
* Transformation Functions:
  * `eitherToAsync`
  * `eitherToMaybe`
  * `maybeToAsync`
  * `maybeToEither`

### Non-Breaking
* Add coverage folder to `npmignore`
* Better coverage configuration.
* Fix up some signatures
* Add npm badge to README
* remove `isType` internal function
* Another pass at :corn:sistant Error messaging.
* Fix up the `IO` chain instance errors.


### Pull Requests
* [#46 - Add `both` to `Arrow` and `Star` with an additional pointfree function](https://github.com/evilsoft/crocks/pull/46)
* [#48 - Add Initial Transformation Functions](https://github.com/evilsoft/crocks/pull/48)
* [#50 - Move `isType` out of internal and make it a predicate named `isSameType`](https://github.com/evilsoft/crocks/pull/50)
* [#51 - :corn:sistant errors and add chain errors to IO and Reader](https://github.com/evilsoft/crocks/pull/51)

v0.2.2 -- Jan. 29, 2017
--
### Non-Breaking
* Configure Coveralls for better coverage reports
* Fix :beetle: with `isFoldable` check in `mreduce`.

### Pull Requests
* [#45 - Fix regression in`mreduce` and provide better coverage](https://github.com/evilsoft/crocks/pull/45)

v0.2.1 -- Jan. 29, 2017
--
### Additions
* Helper Functions:
  * `prop`
  * `propPath`
  * `safeLift`
* Predicate Functions:
  * `hasKey`
  * `isDefined`
  * `isFoldable`

### Non-Breaking
  * Update some copyright dates for newer files.
  * Add `fromNode` and `all` to `Async` constructor
  * Add Coveralls integration

### Pull Requests
* [#41 - Add a bunch of helpers](https://github.com/evilsoft/crocks/pull/41)
* [#43 - Add Async.All](https://github.com/evilsoft/crocks/pull/43)
* [#44 - Add and configure coveralls for code coverage reporing](https://github.com/evilsoft/crocks/pull/44)


v0.2.0 -- Jan. 21, 2017
--
### Breaking
  * Rename `Funcs` folder to `Helpers`
  * Remove `inspect` function from public API
  * Move `inspect` into `internal` folder.
  * Change `first` and `second`pointfree to accept `Functions` as well as `Arrow` and `Star`.
  * Change `first` and `second` on `Arrow` to not take any arguments and instead apply its inner function.

### Additions
  * Crocks:
    * `Async`
  * Helper Functions:
    * `fanout`
    * `not`
    * `once`
    * `tap`
  * Internal functions:
    * move all predicate functions from `internal` and into a new `predicates` folder
  * Predicate Functions:
    * `isApplicative`
    * `isApply`
    * `isArray`
    * `isBoolean`
    * `isEmpty`
    * `isFunction`
    * `isFunctor`
    * `isInteger`
    * `isMonad`
    * `isMonoid`
    * `isNil`
    * `isNumber`
    * `isObject`
    * `isSemigroup`
    * `isSetoid`
    * `isString`
    * `isTraversable`

### Non-Breaking
  * README updates
  * Allow `Pred` to be accepted on the following predicate functions:
    * `ifElse`
    * `safe`
    * `unless`
    * `when`
    * `filter`
    * `List.filter`
  * Allow pointfree `traverse` and `sequence` to work with Arrays.
  * Add `first` and `second` to `Star`
  * Add linting and Travis integration

### Pull Requests
* [#24 - move `funcs` folder to new `helpers` folder](https://github.com/evilsoft/crocks/pull/24)
* [#23 - Remove the `inspect` function from the public api` folder](https://github.com/evilsoft/crocks/pull/23)
* [#25 - Move inspect into internal from helpers](https://github.com/evilsoft/crocks/pull/25)
* [#26 - Provide a collection of Predicate functions](https://github.com/evilsoft/crocks/pull/26)
* [#27 - Allow `traverse` and `sequence` to accept arrays](https://github.com/evilsoft/crocks/pull/27)
* [#28 - Add `Async` crock and some more helpers](https://github.com/evilsoft/crocks/pull/28)
* [#30 - Fix up `Arrow` `first` and `second` and add them to `Star`](https://github.com/evilsoft/crocks/pull/30)
* [#32 - Add JSHint and Hook up Travis](https://github.com/evilsoft/crocks/pull/32)


v0.1.1 -- Jan. 9, 2017
--
### Additions
  * Crocks:
    * `Pred`
    * `Star`
    * `State`
  * Helper Functions:
    * `curryN`
    * `ifElse`
    * `safe`
    * `tryCatch`
    * `unless`
    * `when`
  * Internal functions:
    * `isFunctor`
    * `isUndefOrNull` -> `isNil`
  * Pointfree functions:
    * `evalWith`
    * `execWith`

### Non-Breaking
  * README updates
  * Allow `Pred` to be accepted on the following predicate functions:
    * `ifElse`
    * `safe`
    * `unless`
    * `when`
    * `filter`
    * `List.filter`

### Pull Requests
* [#9 - Add some helpers for Logic and Branching](https://github.com/evilsoft/crocks/pull/9)
* [#13 - Add the State Monad](https://github.com/evilsoft/crocks/pull/13)
* [#15 - Add the Star Crock](https://github.com/evilsoft/crocks/pull/15)
* [#16 - Add Pred crock](https://github.com/evilsoft/crocks/pull/16)
* [#18 - Add a tryCatch helper function](https://github.com/evilsoft/crocks/pull/18)
* [#19 - Allow for Pred to be used with safe, ifElse, unless, when and filter](https://github.com/evilsoft/crocks/pull/19)
* [#20 - Add `curryN` to the helper function](https://github.com/evilsoft/crocks/pull/20)
