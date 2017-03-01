# Async

`Async c a`

--

--

```js
--
```

`Async` exposes the following functions on the constructor and instance:

| Constructor | Instance |
|:---|:---|
| [`Rejected`](#rejected), [`Resolved`](#resolved), [`all`](#all), [`fromNode`](#fromnode), [`fromPromise`](#frompromise), [`of`](#of), [`type`](#type) | [`alt`](#alt), [`ap`](#ap), [`bimap`](#bimap), [`chain`](#chain), [`coalesce`](#coalesce), [`fork`](#fork), [`inspect`](#inspect), [`map`](#map),  [`of`](#of), [`swap`](#swap), [`toPromise`](#topromise), [`type`](#type) |

## Constructor

### Rejected

`Async m => c -> m c _`

### Resolved

`Async m => a -> m _ a`

### all
`Async m, Foldable f => f (m c a) -> m c (f a)`

### fromNode

`Async m, CPSFunc f, Context ctx => (f, ctx) -> (* -> m c a)`

### fromPromise

`Async m, Promise p => (* -> p a c) -> (* -> m c a)`

### of

`Async m => a -> m _ a`

### type

`() -> String`

## Instance

### alt

`Async m => m c a ~> m c a -> m c a`

### ap

`Async m => m c (a -> b) ~> m c a -> m c b`

### bimap

`Async m => m c a ~> ((c -> d), (a -> b)) -> m d b`

### chain

`Async m => m c a ~> (a -> m c b) -> m c b`

### coalesce

`Async m => m c a ~> ((c -> b), (a -> b)) -> m _ b`

### fork

`Async m => m c a ~> ((c -> ()), (a -> ())) -> ()`

### inspect

`() -> String`

### map

`Async m => m c a ~> (a -> b) -> m c b`

### of

`Async m => a -> m _ a`

### swap

`Async m => m c a ~> ((c -> d), (a -> b)) -> m b d`

### toPromise

`Async m, Promise p => m c a ~> () -> p a c`

### type

`() -> String`
