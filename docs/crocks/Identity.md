# Identity

`Identity a`

--

```js
--
```

`Identity` exposes these constructors and instance functions:

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
