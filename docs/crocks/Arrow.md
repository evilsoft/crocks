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
| [`empty`](#empty), [`type`](#type) | [`both`](#both), [`concat`](#concat), [`contramap`](#contramap), [`empty`](#empty), [`first`](#first), [`inspect`](#inspect), [`map`](#map), [`promap`](#promap), [`runWith`](#runWith), [`second`](#second), [`type`](#type), [`value`](#value) |

## Constructor

### empty

`Arrow m => () -> m a a`

### type

`() -> String`

## Instance

### both

`Arrow m, Pair p => m a b ~> () -> m (p a a) (p b b)`

### concat

`Arrow m => m a b ~> m a b -> m a b`

### contramap

`Arrow m => m a b ~> (c -> a) -> m c b`

### empty

`Arrow m => () -> m a a`

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

### value

`Arrow m => m a b ~> (a -> b)`
