# Reader

`Reader e a`

--

--

```js
--
```

`Reader` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`ask`](#ask), [`of`](#of), [`type`](#type) |  [`ap`](#ap), [`chain`](#chain), [`inspect`](#inspect), [`map`](#map), [`of`](#of), [`run`](#runWith), [`type`](#type) |

## Constructor

### ask

`Reader m => (e -> a) -> m e a`

### of

`Reader m => a -> m e a`

### type

`() -> String`

## Instance

### ap

`Reader m => m e (a -> b) ~> m e a -> m e b`

### chain

`Reader m => m e a ~> (a -> m e b) -> m e b`

### inspect

`() -> String`

### map

`Reader m => m e a ~> (a -> b) -> m e b`

### of

`Reader m => a -> m e a`

### runWith

`Reader m => m e a ~> e -> a`

### type

`() -> String`
