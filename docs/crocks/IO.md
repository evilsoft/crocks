# IO

`IO a`

--

--

```js
--
```

`IO` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`of`](#of), [`type`](#type) |  [`ap`](#ap), [`chain`](#chain), [`inspect`](#inspect), [`map`](#map), [`of`](#of), [`run`](#run), [`type`](#type) |

## Constructor

### of

`IO m => a -> m a`

### type

`() -> String`

## Instance

### ap

`IO m => m (a -> b) ~> m a -> m b`

### chain

`IO m => m a ~> m a -> (a -> m b) -> m b`

### inspect

`() -> String`

### map

`IO m => m a ~> (a -> b) -> m b`

### of

`IO m => a -> m a`

### run

`IO m => m a ~> () -> a`

### type

`() -> String`
