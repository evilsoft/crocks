# Change Log for `crocks`
v0.12.4 -- September 22, 2019
--

### Additions
* Functions/Methods
  * `isMap` predicate function
  * Add `bichain` for the following types:
    * `Either`
    * `Maybe`
    * `Result`

### Optimizations
* Update `curry` to remove extra stack frames when currying.

### Documentation
* Add example for `applyTo`
* Corrections to the `project` example

### Pull Requests
* [#434 - Add isMap predicate](https://github.com/evilsoft/crocks/pull/434)
* [#435 - docs: add example for applyTo](https://github.com/evilsoft/crocks/pull/)
* [#438 - Micro-optimization to curry](https://github.com/evilsoft/crocks/pull/438)
* [#442 - Correct project example of Tuple](https://github.com/evilsoft/crocks/pull/442)
* [#443 - Add `bichain` to remaining Sum Types](https://github.com/evilsoft/crocks/pull/443)

v0.12.3 -- July 21, 2019
--

### Additions
* Functions/Methods
  * `hasProps` predicate
  * `psi` combinator
  * `compose2` combinator
  * `bichain` pointfree
  * `isBichain` predicate
  * `bichain` instance function on `Async`

### Documentation
* Minor Spelling error corrections
* Update to `ap` example on `Identity`

### Pull Requests
* [#416 - Minor spelling mistake](https://github.com/evilsoft/crocks/pull/416)
* [#413 - Update on index exports](https://github.com/evilsoft/crocks/pull/413)
* [#417 - Adding new `hasProps` predicate](https://github.com/evilsoft/crocks/pull/417)
* [#420 - Moving `Pred` to core](https://github.com/evilsoft/crocks/pull/420)
* [#424 - Updating `ap` example on `Identity`](https://github.com/evilsoft/crocks/pull/424)
* [#429 - Add the powerful P combinator](https://github.com/evilsoft/crocks/pull/429)
* [#394 - Add bichain to Async](https://github.com/evilsoft/crocks/pull/394)
* [#431 - Adding in the `compose2` combinator](https://github.com/evilsoft/crocks/pull/431)

v0.12.1 -- June 30, 2019
--

### Additions
* Functions/Methods
  * `init` Pointfree
  * `last` Pointfree
  * `List/maybeToList` Transformation
  * `Maybe/maybeToArray` Transformation

### Pull Requests
* [#409 - Add `init` and `last` to pointfree](https://github.com/evilsoft/crocks/pull/409)
* [#412 - Add `maybeToList` and `maybeToArray` transformations](https://github.com/evilsoft/crocks/pull/412)


v0.12.0 -- June 16, 2019
--

### Fixes
* Remove circular reference when using `inspect` with `Either`

### Breaking
* Move `fanout` into the `Pair` folder.
* Move `project` into `Tuple` folder.
* `assoc` will now throw when the key/index does not match the structure it is referencing. Positive `Integer` for `Array`, `String` for `Object`.

### Additions
* Functions/Methods
  * `fantasy-land` `Filterable` interface to `List`
  * `setPath` Helper
  * `unsetPath` Helper
  * `tupleToArray` Point-free
  * `isDate` Predicate
  * `isFalse`, `isFalsy`, `isTrue` and `isTruthy` Predicates
* Deprecation of `prop` and `propPath` Functions. Original functions will be maintained until `1.0.0` release.
  * Replace `helpers/assoc` with `helpers/setProp`
  * Replace `helpers/dissoc` with `helpers/unsetPath`
  * Replace `helpers/propOr` with `helpers/getPropOr`
  * Replace `helpers/propPathOr` with `helpers/getPathOr`
  * Replace `Maybe/prop` with `Maybe/getProp`
  * Replace `Maybe/propPath` with `Maybe/getPath`

### Modifications
* Add Iterable support to `head` Helper Function
* Have `isEmpty` work with `Monoid`s

### Documentation
* Many minor corrections and link updates
* Add examples for Logic Functions
* Add `Result` Documentation
* Updates to `combinator` Functions


### Pull Requests
* [#347 - Fix small `Reader` typo](https://github.com/evilsoft/crocks/pull/347)
* [#341 - Change Foldable to Filterable on List.filter for FL Compliance](https://github.com/evilsoft/crocks/pull/341)
* [#322 - Add `setPath` helper function](https://github.com/evilsoft/crocks/pull/322)
* [#331 - Move `assoc` to be `setProp`](https://github.com/evilsoft/crocks/pull/331)
* [#350 - Fixup some Links in the Docs](https://github.com/evilsoft/crocks/pull/350)
* [#342 - Move fanout to the Pair folder](https://github.com/evilsoft/crocks/pull/342)
* [#348 - Simplify `isNil` predicate for better backward compatibility.](https://github.com/evilsoft/crocks/pull/348)
* [#349 - Added support for iterables to `head`](https://github.com/evilsoft/crocks/pull/349)
* [#351 - Create function to clone iterables](https://github.com/evilsoft/crocks/pull/351)
* [#354 - Add tupleToArray point free function](https://github.com/evilsoft/crocks/pull/354)
* [#353 - Update for head that now uses the new cloneIterable function](https://github.com/evilsoft/crocks/pull/353)
* [#359 - Adding examples for the `And` function](https://github.com/evilsoft/crocks/pull/359)
* [#361 - Adding in examples for ifElse](https://github.com/evilsoft/crocks/pull/361)
* [#363 - Update Either.md](https://github.com/evilsoft/crocks/pull/363)
* [#362 - Adding in new isDate function](https://github.com/evilsoft/crocks/pull/362)
* [#308 - Move project to the Tuple folder](https://github.com/evilsoft/crocks/pull/308)
* [#367 - Update setPath to differentiate Array/Object by Integer/String](https://github.com/evilsoft/crocks/pull/367)
* [#370 - More changes to setPath and unsetPath](https://github.com/evilsoft/crocks/pull/370)
* [#364 - Adding in check for empty monoid](https://github.com/evilsoft/crocks/pull/364)
* [#383 - Minor update to fix docs bug](https://github.com/evilsoft/crocks/pull/383)
* [#374 - Adding truth predicates](https://github.com/evilsoft/crocks/pull/374)
* [#386 - Add `unsetProp` and deprecate `dissoc` in favor of the new function](https://github.com/evilsoft/crocks/pull/386)
* [#390 - Update `src` dependencies to fixup audit](https://github.com/evilsoft/crocks/pull/390)
* [#365 - Result Documentation](https://github.com/evilsoft/crocks/pull/365)
* [#372 - Added documentation for final logic functions](https://github.com/evilsoft/crocks/pull/372)
* [#381 - Updating descriptions and adding examples for combinators](https://github.com/evilsoft/crocks/pull/381)
* [#385 - Fixing linting issues](https://github.com/evilsoft/crocks/pull/385)
* [#392 - Fix isEmpty for truthy numbers](https://github.com/evilsoft/crocks/pull/392)
* [#391 - Updates to fully enable linting for docs](https://github.com/evilsoft/crocks/pull/391)
* [#389 - Move `propOr` to `getPropOr`](https://github.com/evilsoft/crocks/pull/389)
* [#396 - Remove `warning` option for uglifyjs to fix node 6 builds](https://github.com/evilsoft/crocks/pull/396)
* [#395 - Move `propPathOr` to `getPathOr`](https://github.com/evilsoft/crocks/pull/395)
* [#398 - Fix invalid link](https://github.com/evilsoft/crocks/pull/398)
* [#400 - Move `prop` to `getProp`](https://github.com/evilsoft/crocks/pull/400)
* [#402 - Update omit function signature](https://github.com/evilsoft/crocks/pull/402)
* [#403 - Move `propPath` to `getPath`](https://github.com/evilsoft/crocks/pull/403)
* [#408 - Fix Either constructor when called with object containing a circular reference](https://github.com/evilsoft/crocks/pull/408)
* [#407 - Move propPath predicate functions to path](https://github.com/evilsoft/crocks/pull/407)

v0.11.1 -- November 4, 2018
--

### Video Log

* [crocks-0.11.1 release](http://bit.ly/crocks-0-11-1-video)

### Additions
* Functions/Methods
  * Add `asyncToPromise` natural transformation function

### Documentation
* Add `Identity` documentation
* Add flattening examples for the following Natural Transformations:
  * `[x]toMaybe`
  * `[x]toAsync`
  * `[x]toEither`
  * `writerToPair`
* Main page layout and wording modifications

### Pull Requests
* [#330 - Documentation for Identity](https://github.com/evilsoft/crocks/pull/330)
* [#295 - Adding a new natural transform: asyncToPromise](https://github.com/evilsoft/crocks/pull/295)
* [#343 - Added flattening examples to the Maybe docs](https://github.com/evilsoft/crocks/pull/343)
* [#345 - Added flattening examples to Async](https://github.com/evilsoft/crocks/pull/345)
* [#344 - Updates to the layout, design and wording of the main docs page](https://github.com/evilsoft/crocks/pull/344)
* [#346 - Added flattening examples](https://github.com/evilsoft/crocks/pull/346)

v0.11.0 -- October 28, 2018
--

### Video Log

* [crocks-0.11.0 release](http://bit.ly/crocks-0-11-0-video)

### Bug Fix
* When doing computations on a `Async` using `fromPromise`, errors where being swallowed. This has been fixed and Errors will now throw as expected.

### Additions
* Functions/Methods
  * Add `converge` combinator function
  * Add `isIterable` predicate function

### Modifications
* `tryCatch` now works with functions of n-arity.
* Removed Specific Names of Types in pointfree function Errors when they worked on multiple types

### Breaking
* Changes to `Const`:
  * Now exports a Type Constructor that requires a TypeRep or JavaScript Type Constructor and will return an Instance Constructor, pointed to the provided Type
  * Removal of `chain` method on the Instance
  * Addition of `empty` to the Instance and TypeRep, when pointed to a `Monoid` (provides the empty of the `Monoid`)
  * `of` will now behave as the new `empty` when pointed to a `Monoid`, otherwise it is a TypeError.
  * `concat` will now map to the `concat` and perform concatenation when pointed to a `Semigroup`
  * `ap` has been changed to behave as `concat` when pointed to a `Semigroup`
* Removed links to package specific in folder index pages:
  * `crocks/helpers`
    * `branch` --> `Pair/branch`
    * `find` --> `Maybe/find`
    * `prop` --> `Maybe/prop`
    * `propPath` --> `Maybe/propPath`
    * `safe` --> `Maybe/safe`
    * `safeAfter` --> `Maybe/safeAfter`
    * `safeLift` --> `Maybe/safeLift`
    * `toPairs` --> `Pair/toPairs`
    * `tryCatch` --> `Result/tryCatch`
  * `crocks/pointfree`
    * `evalWith` --> `State/evalWith`
    * `execWith` --> `State/execWith`
    * `fst` --> `Pair/fst`
    * `log` --> `Writer/log`
    * `nmap` --> `Tuple/nmap`
    * `race` --> `Async/race`
    * `read` --> `Writer/read`
    * `snd` --> `Pair/snd`
* `crocks/transofrmations`
  * removed all

### Pull Requests
* [#332 - Added an isIterable predicate](https://github.com/evilsoft/crocks/pull/332)
* [#333 - Add converge (Phoenix) to combinators](https://github.com/evilsoft/crocks/pull/333)
* [#320 - Convert tryCatch to nAry](https://github.com/evilsoft/crocks/pull/320)
* [#327 - Make `Const` a "true" Applicative](https://github.com/evilsoft/crocks/pull/)
* [#339 - Prevent fromPromise from swallowing errors](https://github.com/evilsoft/crocks/pull/339)
* [#311 - Seperate function refs in the main index](https://github.com/evilsoft/crocks/pull/311)
* [#306 - Remove specific types in errors for pointfree functions](https://github.com/evilsoft/crocks/pull/306)
* [#340 - Expose isIterable to the main API](https://github.com/evilsoft/crocks/pull/340)

v0.10.2 -- October 20, 2018
--

### Bug Fix
* Allow only one reject/resolve in a single fork of an `Async`.

### Additions
* Functions/Methods
  * Add `implies` logic function
  * Add `propSatisfies` predicate function
  * Add `propPathSatisfies` predicate function
  * Add `foldMap` method to `List`
  * Add `foldMap` pointfree function for `List` and `Array`
  * Add `setPath` helper function
  * Add `unsetPath` helper function
* Documentation
  * Add `Either` documentation

### Pull Requests
* [#309 - Avoid Async resolving/rejecting multiple times in a single fork.](https://github.com/evilsoft/crocks/pull/309)
* [#303 - Add `implies` Logic Combinator](https://github.com/evilsoft/crocks/pull/303)
* [#305 - Add `propSatisfies` and `propPathSatisfies` to the Predicates](https://github.com/evilsoft/crocks/pull/305)
* [#310 - Add `foldMap` pointfree and `List`/`Array` implementations](https://github.com/evilsoft/crocks/pull/310)
* [#321 - Update Dependencies](https://github.com/evilsoft/crocks/pull/321)
* [#323 - Add `unsetPath` helper function](https://github.com/evilsoft/crocks/pull/323)
* [#322 - Add `setPath` helper function](https://github.com/evilsoft/crocks/pull/322)
* [#324 - Add `Either` docs](https://github.com/evilsoft/crocks/pull/324)

v0.10.1 -- July 24, 2018
--

### Bug Fix
* Fix up regression on `bimap` with `Pair` from last release

### Pull Requests
* [#300 - Fix up the Fantasy Land `bimap` method on `Pair`](https://github.com/evilsoft/crocks/pull/300)

v0.10.0 -- July 24, 2018
--

### Breaking
* Moved `merge` to `crocks/pointfree/merge` from `crocks/Pair/merge`

### Additions
* Types
  * `Tuple`
* Functions/Methods
  * Add `nmap` Pointfree Function
  * Add `race` method to `Async` type
  * Add `rejectAfter` and `resolveAfter` `Async` construction helper functions
  * Add `race` Pointfree Function
* Documentation:
  * Add a `Construction` to all data types
  * `Tuple` Documentation

### Modifications
* Documentation
  * `Async` documentation corrections.
  * `Arrow` documentation corrections.
  * Correct spelling of Integer throughout all documentation.
  * Fix up colon notation on Predicate Functions
* Functions  
  * Modify Type Class based predicates to account for Fantasy-Land methods.
  * Modify Type Class based Pointfree Function to account for Fantasy-Land methods.
  * `constant` combinator is now curried.
  * update `inspect` to account for `Symbol` values

### Pull Requests
* [#277 - update Async documentation](https://github.com/evilsoft/crocks/pull/277)
* [#276 - Add construction section for all Monoids](https://github.com/evilsoft/crocks/pull/276)
* [#275 - Add a Tuple Type](https://github.com/evilsoft/crocks/pull/275)
* [#279 - Add Fantasy Land Compliance for Associated Predicates](https://github.com/evilsoft/crocks/pull/279)
* [#280 - Add Fantasy Land Compliance for Pointfree Functions](https://github.com/evilsoft/crocks/pull/280)
* [#283 - Constant should be Curried](https://github.com/evilsoft/crocks/pull/283)
* [#284 - Support arbitrary length Tuples](https://github.com/evilsoft/crocks/pull/284)
* [#287 - Interger -> Integer](https://github.com/evilsoft/crocks/pull/287)
* [#282 - Add race and some construction helpers to Async](https://github.com/evilsoft/crocks/pull/282)
* [#289 - Update Arrow.md](https://github.com/evilsoft/crocks/pull/289)
* [#291 - Make nmap work with Tuples greater than size 10](https://github.com/evilsoft/crocks/pull/291)
* [#290 - Add Construction section to all Crocks](https://github.com/evilsoft/crocks/pull/290)
* [#298 - Support inspecting Symbols](https://github.com/evilsoft/crocks/pull/298)
* [#299 - Normalize predicates docs colons](https://github.com/evilsoft/crocks/pull/299)
* [#297 - Add Tuple documentation](https://github.com/evilsoft/crocks/pull/297)

v0.9.4 -- May 25, 2018
--

### Additions
* Documentation:
  * `Const`
  * `Pair`

### Modifications
* `inspect` now displays key/value pairs for objects.
* `Async` cancel works for flows that reuse instances.
* Function provided to the default `Async` constructor can now return a function
to be called when cancelled.

### Pull Requests
* [#265 - Make inspect method stringify objects](https://github.com/evilsoft/crocks/pull/265)
* [#268 - Time to Upgrade](https://github.com/evilsoft/crocks/pull/268)
* [#270 - Update Async.md](https://github.com/evilsoft/crocks/pull/270)
* [#271 - Update README.md](https://github.com/evilsoft/crocks/pull/271)
* [#266 - Initialize Async cancel state in call to fork](https://github.com/evilsoft/crocks/pull/266)
* [#248 - Adding new md for Const](https://github.com/evilsoft/crocks/pull/248)
* [#274 - Add Pair Documentation](https://github.com/evilsoft/crocks/pull/274)
* [#273 - Update index.md](https://github.com/evilsoft/crocks/pull/273)

v0.9.3 -- April 19, 2018
--

### Additions
* Make the following `Monoid`s `Setoid`s by adding `equals`:
  * `All`
  * `Any`
  * `Assign`
  * `First`
  * `Last`
  * `Max`
  * `Min`
  * `Prod`
  * `Sum`

### Documentation
* Improve search when searching through docs section
* Remove legacy documentation READMES in favor of single source in docs

### Modifications
* Make `isSame` curried.
* Differentiate error reporting between fluent style methods and fantasy land
methods for all ADTs

### Pull Requests
* [#255 - Fix search in docs](https://github.com/evilsoft/crocks/pull/255)
* [#258 - Add equals to most Monoids (without docs)](https://github.com/evilsoft/crocks/pull/258)
* [#257 - fixes missing curry in isSame](https://github.com/evilsoft/crocks/pull/257)
* [#260 - Add ability to report fluent style and fantasy-land errors](https://github.com/evilsoft/crocks/pull/260)
* [#262 - Add docs for monoid equals property](https://github.com/evilsoft/crocks/pull/262)
* [#263 - Move to one truth for documentation](https://github.com/evilsoft/crocks/pull/263)

v0.9.2 -- April 1, 2018
--
### Additions
* Helpers:
  * `Maybe/safeAfter`
  * `Maybe/find`

### Modifications
* Update documentation to favor JS Modules
* `sequence` and `traverse` allow for either an `Applicative` TypeRep or an
`Apply` returning function. (methods and pointfree functions)
* `sequence` and `traverse` allow for use of the `Array` constructor as a
TypeRep for `Array`

### Bug fixes
* Throw a `crocks` error instead of a standard JavaScript error when the data
is `null` or `undefined` in the following:
  * `pointfree/bimap`
  * `pointfree/coalesce`
  * `pointfree/cons`
  * `pointfree/head`
  * `pointfree/swap`
  * `pointfree/tail`

### Development Changes
* Better Development experience on Windows
* Updated linting rules:
  * Added `eol-last`
  * Added `comma-dangle` (never)
  * Added `no-extra-parens`
  * Added `no-multiple-empty-lines` (no more than 1)
* Update git file to use unix newlines.

### Pull Requests
* [#227 - Fix typos in Arrow docs](https://github.com/evilsoft/crocks/pull/227)
* [#232 - Updates to cleaner imports to es6](https://github.com/evilsoft/crocks/pull/232)
* [#235 - Fixed a typo](https://github.com/evilsoft/crocks/pull/235)
* [#229 - DOCS: Converts CJS-style require calls to import statements](https://github.com/evilsoft/crocks/pull/229)
* [#238 - Fix up Error specs and check for crocks errors in helper, pointfree and logic functions](https://github.com/evilsoft/crocks/pull/238)
* [#241 - Added safeAfter to Maybe](https://github.com/evilsoft/crocks/pull/241)
* [#239 - Allow `sequence` and `traverse` to accept an `Applicatve TypeRep`](https://github.com/evilsoft/crocks/pull/239)
* [#242 - Add `find` function to `Maybe` namespace](https://github.com/evilsoft/crocks/pull/242)
* [#243 - Allow Array Constructor as TypeRep for sequence and traverse](https://github.com/evilsoft/crocks/pull/243)
* [#244 - Added new function to check for isPredOrFunc](https://github.com/evilsoft/crocks/pull/244)
* [#247 - Git attribute added](https://github.com/evilsoft/crocks/pull/247)
* [#249 - Typo fix](https://github.com/evilsoft/crocks/pull/249)

v0.9.0 -- February 21, 2018
--
### Breaking
* Removed original `applyTo` combinator that was the A combinator.
* Renamed `reverseApply` to `applyTo` for the T or `thrush` combinator.
* Changed Sanctuary `@@type` on all types from a function `() -> String` to a `String` property on type constructors and instances.
* Updated the following for a consistent experience for each:
  * `predicates/hasProp`
  * `predicates/propEq`
  * `predicates/propPathEq`
  * `helpers/propOr`
  * `helpers/propPathOr`
  * `Maybe/prop`
  * `Maybe/propPath`

 Each will now do the following:
   * For predicates, failure cases result in a `false`.
   * For helpers, failure case will return the default value provided.
   * for Maybe functions failure case results in a `Nothing`
   * Act as identity when an empty array is passed in (all path based functions)
   * Throws unless `String` or `Integer` is provided for key names or in a key path.
   * Throws if empty `String` is found in a key name or key path.
   * Allows anything as the "data" but will default to a failure case if `null`, `undefined` or `NaN` is passed in. All other types traverse as normal.
   * Will exit with a failure on path functions if `null`, `undefined` or `NaN` values are encountered during a traversal. (ex, `[ 'a', 'b' ]` on `{ a: null }`)

### Additions
* Predicates:
  * `hasPropPath`

### Pull Requests
* [#218 - move over to sanctuary string types](https://github.com/evilsoft/crocks/pull/218)
* [#225 - All Object Traversal Functions Behave the Same](https://github.com/evilsoft/crocks/pull/225)
* [#226 - Remove original `applyTo` and replace with `thrush](https://github.com/evilsoft/crocks/pull/226)

v0.8.6 -- February 18, 2018
--
### Additions
* READMES:
  * `Max`
  * `Min`
* Predicates:
  * `propEq`
  * `propPathEq`
* Methods:
  * `sequence` to `Pair`
  * `traverse` to `Pair`
  * `reduceRight` to `List`
  * Add fantasy-land methods except for `traverse` and `ap`

### Bug fixes
* Stop traversing in `propPathOr` when default is an `Object` matching the path.

### Pull Requests
* [#216 - Add karthikiyengar as contributor for PR review](https://github.com/evilsoft/crocks/pull/216)
* [#214 - Move Fantasy-Land method name into one place](https://github.com/evilsoft/crocks/pull/214)
* [#213 - Update Error specs for the remaining Monoids](https://github.com/evilsoft/crocks/pull/213)
* [#212 - Update `traverse` and `sequence` Errors to signal for `Apply` and not `Applicative`](https://github.com/evilsoft/crocks/pull/212)
* [#211 - Add `sequence` and `traverse` to `Pair`](https://github.com/evilsoft/crocks/pull/211)
* [#217 - Fix issue in propPathOr if default value is an object](https://github.com/evilsoft/crocks/pull/217)
* [#220 - Add Max Documentation](https://github.com/evilsoft/crocks/pull/220)
* [#221 - Add Min Documentation](https://github.com/evilsoft/crocks/pull/221)
* [#222 - Clean up Prod and Sum Docs](https://github.com/evilsoft/crocks/pull/222)
* [#219 - Added `propEq` and `propPathEq`](https://github.com/evilsoft/crocks/pull/219)
* [#223 - Add `Max` and `Min` Monoids to the docs](https://github.com/evilsoft/crocks/pull/223)
* [#224 - Add jonwhelan as contributor for PR Code and Bug Reporting](https://github.com/evilsoft/crocks/pull/224)

v0.8.5 -- February 14, 2018
--
### Additions
* READMES:
  * `First`
  * `Last`
  * `Async`
* Helpers:
  * `liftN`
* Methods:
  * `@@type` to all types
  * `toString` to all types
  * `reduceRight` to `List`
  * Add fantasy-land methods except for `traverse` and `ap`

### Bug fixes
* Change composition order on `Traversable`s to allow from proper application

### Pull Requests
* [#190 - Add the `liftN` helper function](https://github.com/evilsoft/crocks/pull/190)
* [#191 - Add Tutorial Post from Robert Pearce](https://github.com/evilsoft/crocks/pull/191)
* [#192 - Add `toString` to all ADTs for those without `inspect`](https://github.com/evilsoft/crocks/pull/192)
* [#193 - Remove mention of the type method from Documentation](https://github.com/evilsoft/crocks/pull/193)
* [#194 - Add `@@type` to all ADTs](https://github.com/evilsoft/crocks/pull/194)
* [#195 - Add `First` documentation](https://github.com/evilsoft/crocks/pull/195)
* [#197 - Add `Last` Documentation](https://github.com/evilsoft/crocks/pull/197)
* [#198 - Apply traversals in the proper order, add `reduceRight` to `List`](https://github.com/evilsoft/crocks/pull/198)
* [#199 - Add First and Last monoids to documentation](https://github.com/evilsoft/crocks/pull/199)
* [#200 - Add Fantasy Land Prefixed Method Names](https://github.com/evilsoft/crocks/pull/200)
* [#204 - Add `Async` Documentation](https://github.com/evilsoft/crocks/pull/204)
* [#210 - Add Async crock to Documentation](https://github.com/evilsoft/crocks/pull/210)

v0.8.4 -- January 17, 2018
--
### Additions
* READMES:
  * `Assign`
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
