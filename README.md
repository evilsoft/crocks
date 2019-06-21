[![Build Status](https://travis-ci.org/evilsoft/crocks.svg?branch=master)](https://travis-ci.org/evilsoft/crocks) [![Coverage Status](https://coveralls.io/repos/github/evilsoft/crocks/badge.svg?branch=master)](https://coveralls.io/github/evilsoft/crocks?branch=master)
[![Join the chat at https://gitter.im/crocksjs/crocks](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/crocksjs/crocks?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![NPM version](https://badge.fury.io/js/crocks.svg)](https://www.npmjs.com/package/crocks)

`crocks` is a collection of popular *Algebraic Data Types (ADTs)* that are all
the rage in functional programming. You have heard of things like `Maybe` and
`Either` and heck maybe even `IO`, that is what these are. The main goal of
`crocks` is to curate and provide not only a common interface between each type
(where possible of course), but also provide all of the helper functions needed
to hit the ground running.

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
  - [Entire `crocks` library (CommonJS)](#entire-crocks-library-commonjs)
  - [Entire `crocks` library (JS Modules)](#entire-crocks-library-js-modules)
  - [Single entities (CommonJS)](#single-entities-commonjs)
  - [Single entities (JS Modules)](#single-entities-js-modules)
- [Documentation](#documentation)
- [What is Included?](#what-is-included)
- [Contributors](#contributors)
  - [Course/Videos](#coursevideos)
    - [Video evilsoft](#video-evilsoft)
    - [Video avanslaars](#video-avanslaars)
  - [Tutorials](#tutorials)
    - [Tutorial rpearce](#tutorial-rpearce)
  - [Examples](#examples)
    - [Example dbagia](#example-dbagia)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
`crocks` is available from `npm` and is just a shell command away. All you need
to do is run the following to save it as a dependency in your current project
folder:

```
$ npm install crocks -S
```

## Usage

There are many options to use `crocks` to suit the needs of your, projects. When
used on the backend or in an environment where size is not a big concern, the
entire lib can be brought in and the various elements can be either be plucked
off of or referenced by the namespace.

For those cases where size matters, like in the case of frontend bundle
building, the individual entities can be brought in. This will ensure that
your finished bundles include only what is needed for your application/program.

For using the latter case, refer to the desired function's documentation to
find the path in which it resides.

### Entire `crocks` library (CommonJS)

```javascript
// namespace entire suite to crocks variable
const crocks = require('crocks')

// pluck anything that does not require name-spacing
const { safe, isNumber } = crocks

// still requires entire object, but removes name-spacing
const { and, liftA2 } = require('crocks')

// divide :: Number -> Number
const divide =
  x => y => x / y

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// notZero :: a -> Maybe Number
const notZero = safe(
  and(isNumber, x => x !== 0)
)

// safeDivide:: a -> Maybe Number
const safeDivide = crocks.curry(
  (x, y) => liftA2(divide, safeNumber(x), notZero(y))
)

safeDivide(20, 0)
//=> Nothing

safeDivide(20, 5)
//=> Just 4

safeDivide('number', 5)
//=> Nothing
```

### Entire `crocks` library (JS Modules)

```javascript
// namespace entire suite to crocks variable
import crocks from 'crocks'

// still imports entire object, but removes name-spacing
import { and, liftA2 }  from 'crocks'

// pluck anything that does not require name-spacing
const { safe, isNumber } = crocks

// divide :: Number -> Number
const divide =
  x => y => x / y

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// notZero :: a -> Maybe Number
const notZero = safe(
  and(isNumber, x => x !== 0)
)

// safeDivide:: a -> Maybe Number
const safeDivide = crocks.curry(
  (x, y) => liftA2(divide, safeNumber(x), notZero(y))
)

safeDivide(20, 0)
//=> Nothing

safeDivide(20, 5)
//=> Just 4

safeDivide('number', 5)
//=> Nothing
```

### Single entities (CommonJS)

```javascript
// require in each entity directly
const and = require('crocks/logic/and')
const curry = require('crocks/helpers/curry')
const isNumber = require('crocks/predicates/isNumber')
const liftA2 = require('crocks/helpers/liftA2')
const safe = require('crocks/Maybe/safe')

// divide :: Number -> Number
const divide =
  x => y => x / y

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// notZero :: a -> Maybe Number
const notZero = safe(
  and(isNumber, x => x !== 0)
)

// safeDivide:: a -> Maybe Number
const safeDivide = curry(
  (x, y) => liftA2(divide, safeNumber(x), notZero(y))
)

safeDivide(20, 0)
//=> Nothing

safeDivide(20, 5)
//=> Just 4

safeDivide('number', 5)
//=> Nothing
```

### Single entities (JS Modules)

```javascript
// import in each entity directly
import and from 'crocks/logic/and'
import curry from 'crocks/helpers/curry'
import isNumber from 'crocks/predicates/isNumber'
import liftA2 from 'crocks/helpers/liftA2'
import safe from 'crocks/Maybe/safe'

// divide :: Number -> Number
const divide =
  x => y => x / y

// safeNumber :: a -> Maybe Number
const safeNumber =
  safe(isNumber)

// notZero :: a -> Maybe Number
const notZero = safe(
  and(isNumber, x => x !== 0)
)

// safeDivide:: a -> Maybe Number
const safeDivide = curry(
  (x, y) => liftA2(divide, safeNumber(x), notZero(y))
)

safeDivide(20, 0)
//=> Nothing

safeDivide(20, 5)
//=> Just 4

safeDivide('number', 5)
//=> Nothing
```

## Documentation

* [API Documentation](https://evilsoft.github.io/crocks/docs/)
* [Contributing Information](https://github.com/evilsoft/crocks/blob/master/CONTRIBUTORS.md)

## What is Included?
There are (8) classifications of "things" included in this library:

* [Crocks][crock-docs]: These are the ADTs that this library is centered around.
They are all `Functor` based Data Types that provide different computational
contexts for working in a more declarative, functional flow. For the most part,
a majority of the other bits in `crocks` exist to serve these ADTs.

* [Monoids][monoid-docs]: These helpful ADTs are in a class of their own, not
really `Functor`s in their own right (although some can be), they are still very
useful in our everyday programming needs. Ever need to sum a list of numbers or
mix a mess of objects together? This is were you will find the ADTs you need to
do that.

* [Combinators][combinator-docs]: A collection of functions that are used for
working with other functions. These do things like compose (2) functions
together, or flip arguments on a function. They typically either take a
function, return a function or a bit a both. These are considered the glue that
holds the mighty house of `crocks` together and a valuable aid in writing
reusable code.

* [Helper Functions][helper-docs]: All other support functions that are
either convenient versions of combinators or not even combinators at all cover
this group.

* [Logic Functions][logic-docs]: A helpful collection of logic based
functions. All of these functions work with either predicate functions or
instances of `Pred` and let you combine them in some very interesting ways.

* [Predicate Functions][predicate-docs]: A helpful collection of predicate
functions to get you started.

* [Point-free Functions][pointfree-docs]: Wanna use these ADTs in a way
that you never have to reference the actual data being worked on? Well here is
where you will find all of these functions to do that. For every algebra
available on both the `Crocks` and `Monoids` there is a function here.

* [Transformation Functions][transformation-docs]: All the functions found
here are used to transform from one type to another, naturally. These come are
handy in situations where you have functions that return one type (like an
`Either`), but are working in a context of another (say `Maybe`). You would
like to compose these, but in doing so will result in a nesting that you will
need to account for for the rest of your flow.

## Contributors

Thanks goes to these wonderful people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://github.com/evilsoft"><img src="https://avatars1.githubusercontent.com/u/3665793?v=4" width="100px;" alt="Ian Hofmann-Hicks"/><br /><sub><b>Ian Hofmann-Hicks</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=evilsoft" title="Code">💻</a> <a href="https://github.com/evilsoft/crocks/commits?author=evilsoft" title="Documentation">📖</a> <a href="#video-evilsoft" title="Videos">📹</a></td><td align="center"><a href="https://github.com/rstegg"><img src="https://avatars0.githubusercontent.com/u/19234385?v=4" width="100px;" alt="Ryan"/><br /><sub><b>Ryan</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=rstegg" title="Code">💻</a> <a href="https://github.com/evilsoft/crocks/issues?q=author%3Arstegg" title="Bug reports">🐛</a> <a href="#review-rstegg" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="http://vanslaars.io"><img src="https://avatars0.githubusercontent.com/u/1271181?v=4" width="100px;" alt="Andrew Van Slaars"/><br /><sub><b>Andrew Van Slaars</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=avanslaars" title="Documentation">📖</a> <a href="#video-avanslaars" title="Videos">📹</a></td><td align="center"><a href="https://github.com/HenriqueLimas"><img src="https://avatars0.githubusercontent.com/u/2222191?v=4" width="100px;" alt="Henrique Limas"/><br /><sub><b>Henrique Limas</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=HenriqueLimas" title="Code">💻</a> <a href="https://github.com/evilsoft/crocks/commits?author=HenriqueLimas" title="Documentation">📖</a> <a href="#review-HenriqueLimas" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://robertwpearce.com"><img src="https://avatars2.githubusercontent.com/u/592876?v=4" width="100px;" alt="Robert Pearce"/><br /><sub><b>Robert Pearce</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/issues?q=author%3Arpearce" title="Bug reports">🐛</a> <a href="https://github.com/evilsoft/crocks/commits?author=rpearce" title="Code">💻</a> <a href="#review-rpearce" title="Reviewed Pull Requests">👀</a> <a href="#tutorial-rpearce" title="Tutorials">✅</a> <a href="https://github.com/evilsoft/crocks/commits?author=rpearce" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/flintinatux"><img src="https://avatars1.githubusercontent.com/u/888052?v=4" width="100px;" alt="Scott McCormack"/><br /><sub><b>Scott McCormack</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/issues?q=author%3Aflintinatux" title="Bug reports">🐛</a></td><td align="center"><a href="http://www.fdaoud.com"><img src="https://avatars3.githubusercontent.com/u/1706600?v=4" width="100px;" alt="Fred Daoud"/><br /><sub><b>Fred Daoud</b></sub></a><br /><a href="#review-foxdonut" title="Reviewed Pull Requests">👀</a></td></tr><tr><td align="center"><a href="https://github.com/karthikiyengar"><img src="https://avatars0.githubusercontent.com/u/8260207?v=4" width="100px;" alt="Karthik Iyengar"/><br /><sub><b>Karthik Iyengar</b></sub></a><br /><a href="#review-karthikiyengar" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/evilsoft/crocks/commits?author=karthikiyengar" title="Code">💻</a> <a href="https://github.com/evilsoft/crocks/commits?author=karthikiyengar" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/jonwhelan"><img src="https://avatars1.githubusercontent.com/u/7376957?v=4" width="100px;" alt="Jon Whelan"/><br /><sub><b>Jon Whelan</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/issues?q=author%3Ajonwhelan" title="Bug reports">🐛</a> <a href="https://github.com/evilsoft/crocks/commits?author=jonwhelan" title="Code">💻</a></td><td align="center"><a href="http://bennypowers.com"><img src="https://avatars0.githubusercontent.com/u/1466420?v=4" width="100px;" alt="Benny Powers"/><br /><sub><b>Benny Powers</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=bennypowers" title="Documentation">📖</a> <a href="https://github.com/evilsoft/crocks/commits?author=bennypowers" title="Code">💻</a> <a href="#review-bennypowers" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://github.com/dalefrancis88"><img src="https://avatars0.githubusercontent.com/u/1909325?v=4" width="100px;" alt="Dale Francis"/><br /><sub><b>Dale Francis</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=dalefrancis88" title="Code">💻</a> <a href="#review-dalefrancis88" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://github.com/premithk"><img src="https://avatars1.githubusercontent.com/u/7926867?v=4" width="100px;" alt="Premith"/><br /><sub><b>Premith</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=premithk" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/dbagia"><img src="https://avatars0.githubusercontent.com/u/6302673?v=4" width="100px;" alt="Dipen Bagia"/><br /><sub><b>Dipen Bagia</b></sub></a><br /><a href="#example-dbagia" title="Examples">💡</a></td><td align="center"><a href="https://github.com/ximenean"><img src="https://avatars3.githubusercontent.com/u/5243925?v=4" width="100px;" alt="Andrew Jones"/><br /><sub><b>Andrew Jones</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=ximenean" title="Documentation">📖</a></td></tr><tr><td align="center"><a href="https://github.com/wayneseymour"><img src="https://avatars0.githubusercontent.com/u/4858051?v=4" width="100px;" alt="W. K. Seymour III"/><br /><sub><b>W. K. Seymour III</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=wayneseymour" title="Documentation">📖</a></td><td align="center"><a href="https://youtube.com/euprogramadoroficial"><img src="https://avatars2.githubusercontent.com/u/11702749?v=4" width="100px;" alt="Eliseu Benedito Codinhoto"/><br /><sub><b>Eliseu Benedito Codinhoto</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=zeucxb" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/NiallArkEnergy"><img src="https://avatars3.githubusercontent.com/u/12712867?v=4" width="100px;" alt="NiallArkEnergy"/><br /><sub><b>NiallArkEnergy</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=NiallArkEnergy" title="Code">💻</a> <a href="https://github.com/evilsoft/crocks/commits?author=NiallArkEnergy" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/vidyu"><img src="https://avatars0.githubusercontent.com/u/3265934?v=4" width="100px;" alt="vidyu"/><br /><sub><b>vidyu</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=vidyu" title="Documentation">📖</a></td><td align="center"><a href="http://michael-wolfenden.github.io"><img src="https://avatars2.githubusercontent.com/u/780521?v=4" width="100px;" alt="Michael Wolfenden"/><br /><sub><b>Michael Wolfenden</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=michael-wolfenden" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/JohanCodinha"><img src="https://avatars0.githubusercontent.com/u/14071356?v=4" width="100px;" alt="Johan Codinha"/><br /><sub><b>Johan Codinha</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/issues?q=author%3AJohanCodinha" title="Bug reports">🐛</a></td><td align="center"><a href="http://www.mattross.io"><img src="https://avatars0.githubusercontent.com/u/450220?v=4" width="100px;" alt="Matt Ross"/><br /><sub><b>Matt Ross</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=amsross" title="Code">💻</a></td></tr><tr><td align="center"><a href="http://jazzy.codes"><img src="https://avatars2.githubusercontent.com/u/4014487?v=4" width="100px;" alt="Jasmina Jacquelina"/><br /><sub><b>Jasmina Jacquelina</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=jasminabasurita" title="Documentation">📖</a> <a href="https://github.com/evilsoft/crocks/commits?author=jasminabasurita" title="Code">💻</a></td><td align="center"><a href="https://github.com/faliah"><img src="https://avatars0.githubusercontent.com/u/5593080?v=4" width="100px;" alt="Denis Zolkin"/><br /><sub><b>Denis Zolkin</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=faliah" title="Documentation">📖</a></td><td align="center"><a href="http://www.cnblogs.com/Answer1215/"><img src="https://avatars0.githubusercontent.com/u/11929006?v=4" width="100px;" alt="Zhentian Wan"/><br /><sub><b>Zhentian Wan</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=zhentian-wan" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/RichardForrester"><img src="https://avatars0.githubusercontent.com/u/12902182?v=4" width="100px;" alt="RichardForrester"/><br /><sub><b>RichardForrester</b></sub></a><br /><a href="https://github.com/evilsoft/crocks/commits?author=RichardForrester" title="Code">💻</a> <a href="https://github.com/evilsoft/crocks/commits?author=RichardForrester" title="Documentation">📖</a> <a href="https://github.com/evilsoft/crocks/commits?author=RichardForrester" title="Tests">⚠️</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

### Course/Videos

#### Video evilsoft
* [State Monad In Javascript (egghead.io)](https://egghead.io/courses/state-monad-in-javascript)
* [Working With ADTs (YouTube)](https://www.youtube.com/playlist?list=PLjvgv-FpMo7XRVFZjZsWXJ5nVmRJ5a5Hv)
* [Functional JS (YouTube)](https://www.youtube.com/playlist?list=PLjvgv-FpMo7XvlfO8YKiz4_onf8WonhiA)

#### Video avanslaars
* [Safer JavaScript with the Maybe Type](https://egghead.io/courses/safer-javascript-with-the-maybe-type)

### Tutorials
#### Tutorial rpearce
* [Ramda Chops: Function Currying](https://robertwpearce.com/ramda-chops-function-currying.html)

### Examples
#### Example dbagia
* [React Declarative Form Generator](https://github.com/dbagia/declarative-form-generator)

[crock-docs]: https://evilsoft.github.io/crocks/docs/crocks/
[monoid-docs]: https://evilsoft.github.io/crocks/docs/monoids/
[combinator-docs]: https://evilsoft.github.io/crocks/docs/functions/#combinators
[helper-docs]: https://evilsoft.github.io/crocks/docs/functions/#helpers
[logic-docs]: https://evilsoft.github.io/crocks/docs/functions/#logic
[predicate-docs]: https://evilsoft.github.io/crocks/docs/functions/predicate-functions.html
[pointfree-docs]: https://evilsoft.github.io/crocks/docs/functions/pointfree-functions.html
[transformation-docs]: https://evilsoft.github.io/crocks/docs/functions/transformation-functions.html
[emojis]:https://github.com/kentcdodds/all-contributors#emoji-key
