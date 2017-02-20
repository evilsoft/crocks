# List

`List a`

--

--

```js
--
```

`List` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`empty`](#empty), [`fromArray`](#fromArray), [`of`](#of) | [`ap`](#ap), [`chain`](#chain), [`concat`](#concat), [`cons`](#cons), [`empty`](#empty), [`equals`](#equals), [`filter`](#filter), [`head`](#head), [`map`](#map), [`of`](#of), [`reduce`](#reduce), [`reject`](#reject), [`sequence`](#sequence), [`tail`](#tail), [`toArray`](#toArray), [`traverse`](#traverse), [`value`](#value) |

## Constructors

### empty

`List m => () -> m a`

### fromArray

`List m => [ a ] -> m a`

### of

`List m => a -> m a`

## Instances

## Instance

### ap

`List m => m (a -> b) ~> m a -> m b`

### chain

`List m => m a ~> (a -> m b) -> m b`

### concat

`List m => m a ~> m a -> m a`

### cons

`List m => m a ~> a -> m a`

### empty

`List m => () -> m a`

### equals

`a -> Boolean`

### filter

`List m => m a ~> ((a -> Boolean) | Pred a) -> m a`

### head

`List m => m a ~> () -> Maybe a`

### inspect

`() -> String`

### map

`List m => m a ~> (a -> b) -> m b`

### of

`List m => a -> m a`

### reduce

`List m => m a ~> (((b, a) -> b), b) -> b`

### reject

`List m => m a ~> ((a -> Boolean) | Pred a) -> m a`

### sequence

`List m, Applicative f => m (f a) ~> (b -> f b) -> f (m a)`

### tail

`List m => m a ~> () -> Maybe (m a)`

### toArray

`List m => m a ~> () -> [ a ]`

### traverse

`List m, Applicative f => m a ~> ((c -> f c), a -> f b) -> f (m b)`

### type

`() -> String`

### value

`List m => m a ~> () -> [ a ]`
