# Unit

`Unit ()`

--

--

```js
--
```

`Unit` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`empty`](#empty), [`of`](#of) | [`ap`](#ap), [`chain`](#chain), [`concat`](#concat), [`empty`](#empty), [`equals`](#equals), [`of`](#of), [`value`](#value) |

## Constructor

### empty

`Unit m => () -> m ()`

### of

`Unit m => _ -> m ()`

### type

`() -> String`

## Instance

### ap

`Unit m => m () ~> m () -> m ()`

### chain

`Unit m => m () ~> m () -> m ()`

### concat

`Unit m => m () ~> m () -> m ()`

### empty

`Unit m => () -> m ()`

### equals

`a -> Boolean`

### inspect

`() => String`

### map

`Unit m => m () ~> m () -> m ()`

### type

`() -> String`

### value

`Unit m => m () ~> m () -> ()`
