# Either

`Either l r`

Crock which takes a `l` and a `r`, or just a `r`, and acts accordingly:
* taking only `r` will proceed as `Identity`
* taking `l` and `r` will handle errors (or results defined as `Left`) with `l` and results with `r` (or results defined as `Right`)

The "`Either`" crock creates disjunction with a linear data flow.

```js
// Imperative flow
const renderPage = user => {
  const isAuthenticated = user ? true : false
  return isAuthenticated ? "Home Page" : "Login Page"
}

// Declarative flow
const isAuthenticated = u => u ? Either.Right(u) : Either.Left("Login Page")

const renderPage = user =>
  isAuthenticated(user)
  .map(u => "Home Page")
  .value()
```

`Either` exposes these constructors and instances:

| Constructor | Instance |
|:---|:---|
| [`Left`](#left), [`Right`](#right), [`of`](#of) | [`inspect`](#inspect), [`value`](#value), [`type`](#type), [`equals`](#equals), [`map`](#map), [`ap`](#ap), [`of`](#of), [`chain`](#chain), [`sequence`](#sequence), [`traverse`](#traverse) |

## Constructors

### Left

`Either m => l -> m l _`

### Right

`Either m => r -> m _ r`

### of

`Either m => a -> m _ a`

## Instances

### inspect

`() => String`

### either

`Either m => m l r ~> (l -> c) -> (r -> d) -> m l d`

### value

`Either m => m l r ~> () => a`

### type

`() -> String`

### swap

`Either m => m l r ~> m r l`

### coalesce

`Either m => m l r ~> (l -> a) -> m _ a`

### equals

`a -> Boolean`

### map

`Either m => m l r ~> (r -> d) -> m c d`

### bimap

`Either m => m l r ~> (l -> c) -> (r -> d) -> m c d`

### ap

`Either m => m l (r -> a) ~> m l r -> m l a`

### of

`Either m => a -> m _ a`

### chain

`Either m => m l r ~> (r -> m a) -> m l a`

### sequence

`Either m, Applicative f => m l (f r) ~> (l -> f l) -> (r -> f r) -> f (m l r)`

### traverse

`Either m, Applicative f => m l r ~> (a -> f a) -> (r -> f b) -> f (m l b)`
