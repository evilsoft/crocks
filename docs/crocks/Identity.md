# Identity

`Identity a`

--

--

```js
--
```

`Identity` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`of`](#of), [`type`](#type) | [`ap`](#ap), [`chain`](#chain), [`equals`](#equals), [`inspect`](#inspect), [`map`](#map), [`of`](#of), [`sequence`](#sequence), [`traverse`](#traverse), [`type`](#type), [`value`](#value) |

## Constructor

### of

`Identity m => a -> m a`

### type

`() -> String`

## Instance

### ap

`Identity m => m (a -> b) ~> m a -> m b`

### chain

`Identity m => m a ~> (a -> m b) -> m b`

### equals

`a -> Boolean`

### inspect

`() -> String`

### map

`Identity m => m a ~> (a -> b) -> m b`

### of

`Identity m => a -> m a`

### sequence

`Identity m, Applicative f => m (f a) ~> (b -> f b) -> f (m a)`

### traverse

`Identity m, Applicative f => m a ~> (c -> f c) -> (a -> f b) -> f (m b)`

### type

`() -> String`

### value

`Identity m => m a ~> () -> a`
