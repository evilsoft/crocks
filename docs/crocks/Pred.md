# Pred

`Pred a`

--

--

```js
--
```

`Pred` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`empty`](#empty), [`type`](#type) | [`concat`](#concat), [`contramap`](#contramap), [`empty`](#empty),  [`inspect`](#inspect), [`runWith`](#runWith), [`type`](#type), [`value`](#value) |

## Constructor

### empty

`Pred m => () -> m ()`

### type

`() -> String`

## Instance

### concat

`Pred m => m a ~> m a -> m a`

### contramap

`Pred m => m a ~> (a -> b) -> m b`

### empty

`Pred m => () -> m ()`

### inspect

`() => String`

### runWith

`Pred m => m a ~> a -> Boolean`

### type

`() -> String`

### value

`Pred m => m a ~> () -> (a -> Boolean)`
