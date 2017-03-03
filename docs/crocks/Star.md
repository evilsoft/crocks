# Star

`Star a b` / `Monad m => Star a (m b)`

--

--

```js
--
```

`Star` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`type`](#type) | [`both`](#both), [`contramap`](#contramap), [`first`](#first), [`inspect`](#inspect), [`map`](#map), [`promap`](#promap), [`runWith`](#runWith), [`second`](#second), [`type`](#type) |

## Constructor

### type

`() -> String`

## Instance

### both

`Star m, Pair p => m a b ~> () -> m (p a a) (p b b)`

### contramap

`Star m  => m a b ~> (c -> a) -> m c b`

### first

`Star m, Pair p => m a b ~> () -> m (p a c) (p b c)`

### inspect

`() -> String`

### map

`Star m => m a b ~> (b -> c) -> m a c`

### promap

`Star m => m a b ~> ((c -> a), (b -> d)) -> s c d`

### runWith

`Star s, Monad m => s a (m b) ~> a -> m b`

### second

`Star m, Pair p => m a b ~> () -> m (p c a) (p c b)`

### type

`() -> String`
