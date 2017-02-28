# Pred

`Pred a`

The `Pred` crock allows you to reuse the same predicate logic with different kinds of inputs, the only thing we ask of you is that you let `Pred` know how to get from your expected input to the predicate input. `Pred` will coerce any non-boolean return type of your predicate function to a boolean.

Say you have a predicate function `isOfAge = age => age >= 21`, but you have an input `{name: "John", age : 23}`, you could of course do something like `isPersonOfAge = person => isOfAge(person.age)`

Or you can use `Pred` and gain a monoidal interface, with the ability to decorate your predicate to work with any kind of input, using the `contramap` interface.

That means that you would have the ability to easily chain your predicates without too much rewrite.

Let's say that you also want to require that a person was referred by a friend, you could just concat 2 `Pred`s or use another mechanism for conjunction.


```js
const {
  Pred, compose, contramap, curry,
  mconcat, option, prop
} = crocks

// Helpers -- predicate functions
const person =
  {name: "John", age : 23, referral: "ANON", role: "TENANT"}
const isOfAge =
  age => age >= 21
const isReferred =
  who => who === "FRIEND"
const isOwner =
  role => (role).match(/OWNER/)

// Helpers -- point-free functions
const defProp = curry(
  (propName, def) => compose(option(def), prop(propName))
)

const getRefs =
  defProp('referral', 'ANON')

const getAge =
  defProp('age', 0)

const getRole =
  defProp('role', 'VISITOR')


// Without Pred -- function predicates
const isPersonOfAge =
  person => isOfAge(person.age)
const isPersonReferred =
  person => isReferred(person.referral)
const isPersonOwner =
  person => isOwner(person.role)
const requirements =
  person =>
    isPersonReferred(person)
    && isPersonOfAge(person)
    && !!isPersonOwner(person)
    // watch out && doesn't coerce, so you have to manually coerce it

requirements(person)
// => false

// With Pred -- fluent
Pred(isOfAge).contramap(getAge)
.concat(
    Pred(isReferred).contramap(getRefs)
).concat(
    Pred(isOwner).contramap(getRole)
).runWith(person)
//=> false

// With Pred -- point free
mconcat(Pred,[
    contramap(getAge  , Pred(isOfAge)),
    contramap(getRefs , Pred(isReferred)),
    contramap(getRole , Pred(isOwner))
]).runWith(person)

```

`Pred` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`empty`](#empty), [`type`](#type) | [`concat`](#concat), [`contramap`](#contramap), [`empty`](#empty),  [`inspect`](#inspect), [`runWith`](#runWith), [`type`](#type), [`value`](#value) |

## Constructor

### empty

`Pred m => () -> m ()`

### type

`() -> String`

## Instance

### concat

`Pred m => m a ~> m a -> m a`

### contramap

`Pred m => m a ~> (a -> b) -> m b`

### empty

`Pred m => () -> m ()`

### inspect

`() => String`

### runWith

`Pred m => m a ~> a -> Boolean`

### type

`() -> String`

### value

`Pred m => m a ~> () -> (a -> Boolean)`
