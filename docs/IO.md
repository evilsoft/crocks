# IO

`IO a`

--

--

```js
--
```

`IO` exposes the following constructor and instances:

| Constructor | Instance |
|:---|:---|
| [`of`](#of) | [`inspect`](#inspect), [`run`](#run), [`type`](#type), [`map`](#map), [`ap`](#ap), [`of`](#of), [`chain`](#chain) |

## Constructors

### of

`IO m => a -> m a`

## Instances

### inspect

`() => String`

### type

`() -> String`

### map

`IO m => m a ~> (a -> b) -> m b`

### ap

`IO m => m (a -> b) ~> m a -> m b`

### of

`IO m => a -> m a`

### map

`IO m => m a ~> (a -> b) -> m b`

### ap

`IO m => m (a -> b) ~> m a -> m b`

### chain

`IO m => m a ~> m a -> (a -> m b) -> m b`
