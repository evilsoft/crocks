# Const

`Const c a`

--

--

```js
--
```

`Const` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`type`](#type) | [`ap`](#ap), [`chain`](#chain), [`concat`](#concat), [`equals`](#equals), [`inspect`](#inspect), [`map`](#map), [`type`](#type), [`value`](#value) |

## Constructor

### type

`() -> String`

## Instance

### ap

`Const m => m c (a -> b) ~> m c a -> m c b`

### chain

`Const m => m c a ~> (a -> m c b) -> m c b`

### concat

`Const m => m c a ~> m c a -> m c a`

### equals

`a -> Boolean`

### inspect

`() => String`

### map

`Const m => m c a ~> (a -> b) -> m c b`

### type

`() -> String`

### value

`Const m => m c a ~> () -> c`
