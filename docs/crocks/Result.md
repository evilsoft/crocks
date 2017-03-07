# Result

`Result c a`

--

--

```js
--
```

`Result` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`Err`](#err), [`Ok`](#ok), [`of`](#of), [`type`](#type) | [`alt`](#alt), [`ap`](#ap), [`bimap`](#bimap), [`chain`](#chain), [`coalesce`](#coalesce), [`concat`](#concat), [`either`](#either), [`equals`](#equals), [`inspect`](#inspect), [`map`](#map),  [`of`](#of), [`sequence`](#sequence), [`swap`](#swap), [`traverse`](#traverse), [`type`](#type) |

## Constructor

### Err

`Result m => c -> m c _`

### Ok

`Result m => a -> m _ a`

### of

`Result m => a -> m _ a`

### type

`() -> String`

## Instance

### alt

`Result m => m c a ~> m c a -> m c a`

### ap

`Result m, Semigroup c => m c (a -> b) ~> m c a -> m c b`

### bimap

`Result m => m c a ~> ((c -> d), (a -> b)) -> m d b`

### chain

`Result m => m c a ~> (a -> m c b) -> m c b`

### coalesce

`Result m => m c a ~> ((c -> b), (a -> b)) -> m _ b`

### concat

`Result m, Semigroup a => m c a ~> m c a -> m c a`

### either

`Result m => m c a ~> ((c -> b), (a -> b)) -> b`

### equals

`a -> Boolean`

### inspect

`() -> String`

### map

`Result m => m c a ~> (a -> b) -> m c b`

### of

`Result m => a -> m _ a`

### sequence

`Result m, Applicative f => m c (f a) ~> (b -> f b) -> f (m c a)`

### swap

`Result m => m c a ~> ((c -> d), (a -> b)) -> m b d`

### traverse

`Result m, Applicative f => m c a ~> ((d -> f d), a -> f b) -> f (m c b)`

### type

`() -> String`
