# Change Log for `crocks`
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
