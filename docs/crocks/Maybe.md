# Maybe

`Maybe a`

--

--

```js
--
```

`Maybe` exposes the following constructor and instances:

| Constructor | Instance |
|:---|:---|
| [`Nothing`](#nothing), [`Just`](#just), [`of`](#of) | [`inspect`](#inspect), [`maybe`](#maybe), [`either`](#either), [`option`](#option), [`type`](#type), [`equals`](#equals), [`coalesce`](#coalesce), [`map`](#map), [`ap`](#ap), [`of`](#of), [`chain`](#chain), [`sequence`](#sequence), [`traverse`](#traverse) |

## Constructors

### Nothing

`Maybe m => _ -> m a`

### Just

`Maybe m => a -> m a`

### of

`Maybe m => a -> m a`

## Instances

### inspect

`() => String`

### equals

`a -> Boolean`

### either

`Maybe m => m a ~> (_ -> b) -> (a -> b) -> b`

### option

`Maybe m => m a ~> a -> a`

### type

`() -> String`

### coalesce

`Maybe m => m a ~> (_ -> b) -> (a -> b) -> m b`

### map

`Maybe m => m a ~> (a -> b) -> m b`

### ap

`Maybe m => m (a -> b) ~> m a -> m b`

### of

`Maybe m => a -> m a`

### chain

`Maybe m => m a ~> (a -> m b) -> m b`

### sequence

`Maybe m, Applicative f => m (f a) ~> (b -> f b) -> f (m a)`

### traverse

`Maybe m, Applicative f => m a ~> (c -> f c) -> (a -> f b) -> f (m b)`
