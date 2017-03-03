# State

`State s a` / `Pair p => State s (p a s)`

--

--

```js
--
```

`State` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`get`](#get), [`gets`](#gets), [`modify`](#modify), [`of`](#of), [`put`](#put), [`type`](#type) | [`ap`](#ap), [`chain`](#chain), [`evalWith`](#evalWith), [`execWith`](#execWith), [`inspect`](#inspect), [`map`](#map), [`of`](#of), [`runWith`](#runWith), [`type`](#type) |

## Constructor

### get

`State m => () -> m s s`

### gets

`State m => (s -> a) -> m s a`

### modify

`State m, Unit u => (s -> t) -> m t u`

### of

`State m => a -> m s a`

### put

`State m, Unit u => t -> m t u`

### type

`() -> String`

## Instance

### ap

`State m => m s (a -> b) ~> m s a -> m s b`

### chain

`State m => m s a ~> (a -> m s b) -> m s b`

### evalWith

`State m => m s a ~> s -> a`

### execWith

`State m => m s a ~> s -> s`

### inspect

`() -> String`

### map

`State m => m s a ~> (a -> b) -> m s b`

### of

`State m => a -> m s a`

### runWith

`State m, Pair p => m s a ~> s -> p a s`

### type

`() -> String`
