---
description: "Getting started with a Crocks."
icon: "arrow-right-rod"
layout: "guide"
title: "Getting Started"
weight: 1
---

<article id="installation">

## Installation
`crocks` is available from `npm` and is just a shell command away. All you need
to do is run the following to save it as a dependency in your current project
folder:

```
$ npm install crocks -S
```

This will pull down `crocks` into your project's `node_modules` folder and can
be accessed by adding something like the following in the file that needs it:

```javascript
// node require syntax
const crocks = require('crocks')

// Javascript modules (if you are transpiling)
import crocks from 'crocks'
```

</article>

<article id="import-only-what-you-need">

## Import only what you need 

This lib *should* work, with no additional compilation in all current browsers
(Edge, Safari, Chrome, Firefox), if it does not, please file an issue as I
really, really want it to. :smile_cat:.

There is a lot to this library, and as such it may not be desired to bring in
the entire library when bundling for a library or a frontend application. If
this is the case, the code is organized in a manner groups all types in
functions that construct those type in their own folders. The general purpose
functions are spread across the following folders: `combinators`, `helpers`,
`logic`, `pointfree` and `predicates`.

To access the types, just reference the folder like: `crocks/Maybe`, or
`crocks/Result`. If you want to access a function that constructs a given type,
reference it by name, like: `crocks/Maybe/safe` or `crocks/Result/tryCatch`.
This organization helps ensure that you only include what you need.

Another thing to note is, if you are transpiling, then destructuring in your
`import` statement is not going to work as you are thinking (maybe if you are
using `babel`, but this will be broken once modules are available in node, so
be careful). Basically you should not do this, as `crocks` will not be set up
for it until modules are available in node:

```javascript
// Nope! Nope! Nope!:
import { Maybe, compose, curry, map } from 'crocks'

// instead do something like this:
import crocks from 'crocks'
const { Maybe, compose, curry, map } = crocks

// do not wanna bring all of crocks into your bundle?
// I feel ya, all try this:

import Maybe from 'crocks/Maybe'
import compose from 'crock/helpers/compose'
import curry from 'crocks/helpers/curry'
import map from 'crocks/pointfree/map'

// you can of course do the same with require statements:
const All = require('crocks/All')
...
```

</article>
