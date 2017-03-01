# Pair

`Pair c a`

--

--

```js
--
```

`Pair` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`type`](#type) | [`ap`](#ap), [`bimap`](#bimap), [`chain`](#chain), [`concat`](#concat), [`equals`](#equals), [`fst`](#fst), [`inspect`](#inspect), [`map`](#map), [`merge`](#merge), [`of`](#of), [`type`](#type), [`snd`](#snd), [`swap`](#swap) |

## Constructor

### type

`() -> String`

## Instance

### ap

`Pair m, Semigroup c => m c (a -> b) ~> m c a -> m c b`

### bimap

`Pair m => m c a ~> ((c -> d), (a -> b)) -> m d b`

### chain

`Pair m, Semigroup c => m c a ~> (a -> m c b) -> m c b`

### concat

`Pair m, Semigroup < c, a > => m c a ~> m c a -> m c a`

### equals

`a -> Boolean`

### fst

`Pair m => m c a ~> () -> c`

### inspect

`() -> String`

### map

`Pair m => m c a ~> (a -> b) -> m c b`

### merge

`Pair m => m c a ~> ((c, a) -> b) -> b`

### type

`() -> String`

### snd

`Pair m => m c a ~> () -> a`

### swap

`Pair m => m c a ~> ((c -> d), (a -> b)) -> m b d`
