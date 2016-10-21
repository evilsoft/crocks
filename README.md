# crocks.js
`crocks` is a collection of popular *Algebraic Data Types (ADTs)* that are all the rage in functional programming. You have heard of things like `Maybe` and `Either` and heck maybe even `IO`, that is what these are. The main goal of `crocks` is to curate and provide not only a common interface between each type (where possible of course), but also all of the helper functions needed to hit the ground running.

## Installation
`crocks` is available from `npm` and is just a shell command away. All you need to do is run the following to save it as a dependency in your current project folder:

```
$ npm install crocks -S
```

This will pull down `crocks` into your project's `node_modules` folder and can be accessed by adding something like the following in the file that needs it:

```javascript
// node require syntax
const crocks = require('crocks')

// Javascript modules (if you are transpiling or using rollup.js)
import crocks from 'crocks'
```

There is no compilation going on here, so as a result, you will need to bundle or run with node `4.x` or higher. This lib *should* work, with no additional compilation in all current browsers (Edge, Safari, Chrome, Firefox), if it does not, please file an issue as I really, really want it to. :smile_cat:.

Another thing to note is, if you are transpiling, then destructuring in your `import` statement is not going to work as you are thinking (maybe if you are using `babel`, but this will be broken once modules are available in node, so be careful). Basically you should not do this, as `crocks` will not be set up for it until modules are available in node:

```javascript
// Nope! Nope! Nope!:
import { Maybe, compose, curry, map } from 'crocks'

// instead do something like this:
import crocks from 'crocks'
const { Maybe, compose, curry, map } = crocks

// do not wanna bring all of crocks into your bundle?
// I feel ya, try this:

import Maybe from 'crocks/crocks/Maybe'
import compose from 'crocks/funcs/compose'
import curry from 'crocks/funcs/curry'
import map from 'crocks/pointfree/map'

// you can of course do the same with require statements:
const Maybe = require('crocks/crocks/Maybe')
...
```

## What is in this?
There are (5) classifications of "things" included in this library:

* Combinators (`crocks/combinators`): A collection of functions that are used for working with other functions. These do things like compose (2) functions together, or flip arguments on a function. They typically either take a function, return a function or a bit a both. These are considered the glue that holds a mighty house of `crocks` together and aid in writing reusable code.


* Crocks (`crocks/crocks`): These are the ADTs that this library is centered around. They are all Functor based Data Types that provide different computational contexts for working in a more declarative, functional flow. For the most part, a majority of the other bits in `crocks` exist to server these ADTs.

* Helper Functions (`crocks/funcs`): All other support functions that are either convenient versions of combinators or not even combinators at all cover this group.

* Monoids (`crocks/monoids`): These helpful ADTs are in a class of their own, not really Functors in their own right (although some can be), they are still very useful in our everyday programming needs. Every need to Sum a list of Numbers or mix a mess of objects together? This is were you will find the ADTs you need to do that.

* Point-Free Functions (`crocks/pointfree`): Wanna use these ADTs in a way that you never have to reference the actual data being worked on? Well here is where you will find all of these functions to do that. For every algebra available on both the `crocks` and `monoids` there is a function here.

### Combinators
#### `applyTo : (a -> b) -> a -> b`
Seems really silly, but is quite useful for a lot of things. It takes a function and a value and then returns the result of that function with the argument applied.

#### `composeB : (b -> c) -> (a -> b) -> a -> c`
Provides a means to describe a composition between two functions. it takes two functions and an value. Given `composeB(f, g)`, which is read `f` after `g`, it will return a function that will take value `a` and apply it to `g`, passing the result as an argument to `f`, and will finally return the result of `f`. (This allows only two functions, if you want to avoid things like: `composeB(composeB(f, g), composeB(h, i))` then check out `crocks/funcs/compose`.)

#### `constant : a -> b -> a`
This is a very handy dandy function, used a lot. Pass it any value and it will give you back a function that will return that same value no matter what you pass it.

#### `flip : (a -> b -> c) -> b -> a -> c`
This little function just takes a function and returns a function that takes the first two parameters in reverse. Once can compose flip calls down the line to flip all, or some of the other parameters if there are more than two. Mix and match to your :heart:s desire.

#### `identity :  a -> a`
This function and `constant` are the workhorses of writing code with this library. It quite simply is just a function that when you pass it something, it returns that thing right back to you. So simple, I will leave it as an exercise to reason about why this is so powerful and important.

#### `reverseApply : a -> (a -> b) -> b`
Ever run into a situation where you have a value but do not have a function to apply it to? Well this little bird, named Thrush, is there to help out. Just give it a value and it will give you back a function ready to take a function. Once that function is provided, it will return the result of applying your value to that function.

#### `substitution : (a -> b -> c) -> (a -> b) -> a -> c`
While it a complicated little bugger, it can come in very handy from time to time. In it's first two arguments it takes functions. The first must be binary and the second unary. That will return you a function that is ready to take some value. Once supplied the fun starts, it will pass the `a` to the first argument of both functions, and the result of the second function to the second parameter of the first function. Finally after all that juggling, it will return the result of that first function. When used with partial application on that first parameter, a whole new world of combinatory madness is presented!

### Crocks
#### `Const a`
This is a special ADT. Once you get it going, no matter what you do with it, it will always retain the value it was initialized with.
