# Identity

`Identity a`

Crock which returns the same value that was used as its argument

"`Identity`" creates linear data flow in comparison to imperative usage.

```js
// Imperative flow
const capitalizeFirstLetter = string => {
  const firstLetter = string.charAt(0)
  const upppercasedLetter = firstLetter.toUpperCase()
  return upppercasedLetter + string.slice(1);
}

// Declarative flow
const capitalizeFirstLetter = string =>
  Identity(string)
    .map(str => str.charAt(0))
    .map(char => char.toUpperCase())
    .map(upper => upper + string.slice(1))
    .value()
```

`Identity` exposes these constructors and instances:

| Constructor | Instance |
|:---|:---|
| [`of`](#of) | [`inspect`](#inspect), [`value`](#value), [`type`](#type), [`equals`](#equals), [`map`](#map), [`ap`](#ap), [`of`](#of), [`chain`](#chain), [`sequence`](#sequence), [`traverse`](#traverse) |

## Constructors

### of

`Identity m => a -> m a`

## Instances

### inspect

`() => String`

### value

`Identity m => m a ~> () => a`

### type

`() -> String`

### equals

`a -> Boolean`

### map

`Identity m => m a ~> (a -> b) -> m b`

### ap

`Identity m => m (a -> b) ~> m a -> m b`

### of

`Identity m => a -> m a`

### chain

`Identity m => m a ~> (a -> m b) -> m b`

### sequence

`Identity m, Applicative f => m (f a) ~> (b -> f b) -> f (m a)`

### traverse

`Identity m, Applicative f => m a ~> (c -> f c) -> (a -> f b) -> f (m b)`
