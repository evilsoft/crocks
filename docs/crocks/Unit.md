# Unit

`Unit a`

--

--

```js
--
```

`Unit` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`empty`](#empty), [`of`](#of), [`type`](#type) | [`ap`](#ap), [`chain`](#chain), [`concat`](#concat), [`empty`](#empty), [`equals`](#equals), [`inspect`](#inspect), [`map`](#map), [`of`](#of), [`type`](#type), [`value`](#value) |

## Constructor

### empty

`Unit m => () -> m _`

### of

`Unit m => a -> m a`

### type

`() -> String`

## Instance

### ap

`Unit m => m (a -> b) ~> m a -> m b`

### chain

`Unit m => m a ~> (a -> m b) -> m b`

### concat

`Unit m => m a ~> m a -> m a`

### empty

`Unit m => () -> m a`

### equals

`a -> Boolean`

### inspect

`() => String`

### map

`Unit m => m a ~> (a -> b) -> m b`

### of

`Unit m => a -> m a`

### type

`() -> String`

### value

`Unit m => m a ~> () -> undefined`
