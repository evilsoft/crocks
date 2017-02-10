# Either

`Either a b`

Crock which --

The "`Either`" crock creates disjunction with a linear data flow.

```js
--
```

`Either` exposes these constructors and instances:

| Constructor | Instance |
|:---|:---|
| [`Left`](#left), [`Right`](#right), [`of`](#of) | [`inspect`](#inspect), [`value`](#value), [`type`](#type), [`equals`](#equals), [`map`](#map), [`ap`](#ap), [`of`](#of), [`chain`](#chain), [`sequence`](#sequence), [`traverse`](#traverse) |

## Constructors

### Left

`Either m => a -> m a _`

### Right

`Either m => a -> m _ a`

### of

`Either m => a -> m _ a`

## Instances

### inspect

`() => String`

### either

`Either m => m c a ~> (c -> b) -> (a -> b) -> b`

### value

`Either m => m c a ~> () => c | a`

### type

`() -> String`

### swap

`Either m => m a b ~> m a b`

### coalesce

`Either m => m a b ~> (b -> c) -> m _ c`

### equals

`a -> Boolean`

### map

`Either m => m c a ~> (a -> b) -> m a b`

### bimap

`Either m => m a b ~> (a -> c) -> (b -> d) -> m c d`

### ap

`Either m => m c (a -> b) ~> m c a -> m c b`

### of

`Either m => a -> m _ a`

### chain

`Either m => m c a ~> (a -> m c b) -> m c b`

### sequence

`Either m, Applicative f => m c (f a) ~> (b -> f b) -> f (m c a)`

### traverse

`Either m, Applicative f => m c a ~> (d -> f d) -> (a -> f b) -> f (m c b)`
