# Maybe

`Maybe a`

--

--

```js
--
```

`Maybe` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`Just`](#just), [`Nothing`](#nothing), [`of`](#of), [`type`](#type), [`zero`](#zero) | [`alt`](#alt), [`ap`](#ap), [`chain`](#chain), [`coalesce`](#coalesce), [`either`](#either), [`equals`](#equals), [`inspect`](#inspect), [`map`](#map), [`maybe`](#maybe), [`of`](#of), [`option`](#option), [`sequence`](#sequence), [`traverse`](#traverse), [`type`](#type) |

## Constructor

### Nothing

`Maybe m => _ -> m a`

### Just

`Maybe m => a -> m a`

### of

`Maybe m => a -> m a`

### type

`() -> String`

### zero

`Maybe m => () -> m a`

## Instance

### alt

`Maybe m => m a ~> m a -> m a`

### ap

`Maybe m => m (a -> b) ~> m a -> m b`

### chain

`Maybe m => m a ~> (a -> m b) -> m b`

### coalesce

`Maybe m => m a ~> (() -> b) -> (a -> b) -> m b`

### either

`Maybe m => m a ~> (() -> b) -> (a -> b) -> b`

### equals

`a -> Boolean`

### inspect

`() -> String`

### map

`Maybe m => m a ~> (a -> b) -> m b`

### of

`Maybe m => a -> m a`

### option

`Maybe m => m a ~> a -> a`

### sequence

`Maybe m, Applicative f => m (f a) ~> (b -> f b) -> f (m a)`

### traverse

`Maybe m, Applicative f => m a ~> ((c -> f c), a -> f b) -> f (m b)`

### type

`() -> String`

### zero

`Maybe m => () -> m a`
