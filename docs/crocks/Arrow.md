# Arrow

`Arrow a b`

--

--

```js
--
```

`Arrow` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`type`](#type) | [`both`](#both), [`contramap`](#contramap), [`first`](#first), [`inspect`](#inspect), [`map`](#map), [`promap`](#promap), [`runWith`](#runWith), [`second`](#second), [`type`](#type) |

## Constructor

### type

`() -> String`

## Instance

### both

`Arrow m, Pair p => m a b ~> () -> m (p a a) (p b b)`

### contramap

`Arrow m => m a b ~> (c -> a) -> m c b`

### first

`Arrow m, Pair p => m a b ~> () -> m (p a c) (p b c)`

### inspect

`() => String`

### map

`Arrow m => m a b ~> (b -> c) -> m a c`

### promap

`Arrow m => m a b ~> ((c -> a), (b -> d)) -> m c d`

### runWith

`Arrow m => m a b ~> a -> b`

### second

`Arrow m, Pair p => m a b ~> () -> m (p c a) (p c b)`

### type

`() -> String`
