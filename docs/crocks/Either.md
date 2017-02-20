# Either

`Either c a`

--

--

```js
--
```

`Either` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`Left`](#left), [`Right`](#right), [`of`](#of), [`type`](#type) | [`alt`](#alt), [`ap`](#ap), [`bimap`](#bimap), [`chain`](#chain), [`coalesce`](#coalesce), [`either`](#either), [`equals`](#equals), [`inspect`](#inspect), [`map`](#map),  [`of`](#of), [`sequence`](#sequence), [`swap`](#swap), [`traverse`](#traverse), [`type`](#type) |

## Constructor

### Left

`Either m => c -> m c _`

### Right

`Either m => a -> m _ a`

### of

`Either m => a -> m _ a`

### type

`() -> String`

## Instance

### alt

`Either m => m c a ~> m c a -> m c a`

### ap

`Either m => m c (a -> b) ~> m c a -> m c b`

### bimap

`Either m => m c a ~> (c -> d) -> (a -> b) -> m d b`

### chain

`Either m => m c a ~> (a -> m c b) -> m c b`

### coalesce

`Either m => m c a ~> (c -> b) -> (a -> b) -> m _ b`

### either

`Either m => m c a ~> (c -> b) -> (a -> b) -> b`

### equals

`a -> Boolean`

### inspect

`() -> String`

### map

`Either m => m c a ~> (a -> b) -> m c b`

### of

`Either m => a -> m _ a`

### sequence

`Either m, Applicative f => m c (f a) ~> (b -> f b) -> f (m c a)`

### swap

`Either m => m c a ~> (c -> d) -> (a -> b) -> m b d`

### traverse

`Either m, Applicative f => m c a ~> ((d -> f d), a -> f b) -> f (m c b)`

### type

`() -> String`
