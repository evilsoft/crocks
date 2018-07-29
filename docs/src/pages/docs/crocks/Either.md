---
title: "Either"
description: "Either Crock"
layout: "guide"
functions: ["firsttoeither", "lasttoeither", "maybetoeither", "resulttoeither"]
weight: 40
---

```haskell
Either c a = Left c | Right a
```

[OVERALL DESC]

```javascript
```

<article id="topic-implements">

## Implements
`Setoid`, `Semigroup`, `Functor`, `Alt`, `Apply`, `Traversable`, `Chain`, `Applicative`, `Monad`

</article>

<article id="topic-construction">

## Construction

```haskell
Either :: a -> Either c a
```

[ CONSTRUCTOR DESC]

```javascript
```

</article>

<article id="topic-constructor">

## Constructor Methods

#### Left

```haskell
Either.Left :: c -> Either c a
```

[FUNC DESC]

```javascript
```

#### Right

```haskell
Either.Right :: a -> Either c a
```

[FUNC DESC]

```javascript
```

#### of

```haskell
Either.of :: a -> Either c a
```

[FUNC DESC]

```javascript
```

</article>

<article id="topic-instance">

## Instance Methods

#### equals

```haskell
Either c a ~> b -> Boolean
```

[ METHOD DESC ]

```javascript
```

#### concat

```haskell
Semigroup s => Either c s ~> Either c s -> Either c s
```

[ METHOD DESC ]

```javascript
```

#### map

```haskell
Either c a ~> (a -> b) -> Either c b
```

[ METHOD DESC ]

```javascript
```

#### alt

```haskell
Either c a ~> Either c a -> Either c a
```

[ METHOD DESC ]

```javascript
```

#### bimap

```haskell
Either c a ~> ((c -> d), (a -> b)) -> Either d b
```

[ METHOD DESC ]

```javascript
```

#### ap

```haskell
Either c (a -> b) ~> Either c a -> Either c b
```

[ METHOD DESC ]

```javascript
```

#### sequence

```haskell
Apply f => Either c (f a) ~> (b -> f b) -> f (Either c a)
Applicative f => Either c (f a) ~> TypeRep f -> f (Either c a)
```

[ METHOD DESC ]

```javascript
```

#### traverse

```haskell
Apply f => Either c a ~> (d -> f d), (a -> f b)) -> f Either c b
Applicative f => Either c a ~> (TypeRep f, (a -> f b)) -> f Either c b
```

[ METHOD DESC ]

```javascript
```

#### chain

```haskell
Either c a ~> (a -> Either c b) -> Either c b
```

[ METHOD DESC ]

```javascript
```

#### coalesce

```haskell
Either c a ~> ((c -> b), (a -> b)) -> Either c b
```

[ METHOD DESC ]

```javascript
```

#### swap

```haskell
Either c a ~> ((c -> d), (a -> b)) -> Either b d
```

[ METHOD DESC ]

```javascript
```

#### either

```haskell
Either c a ~> ((c -> b), (a -> b)) -> b
```

[ METHOD DESC ]

```javascript
```

</article>

<article id="topic-transformation">

## Transformation Functions

#### firstToEither

`crocks/Either/firstToEither`

```haskell
firstToEither :: c -> First a -> Either c a
firstToEither :: c -> (a -> First b) -> a -> Either c a
```

[TRANSFORMATION FUNCTION DESC]

```javascript
```

#### lastToEither

`crocks/Either/lastToEither`

```haskell
lastToEither :: c -> Last a -> Either c a
lastToEither :: c -> (a -> Last b) -> a -> Either c a
```

[TRANSFORMATION FUNCTION DESC]

```javascript
```

#### maybeToEither

`crocks/Either/maybeToEither`

```haskell
maybeToEither :: c -> Maybe a -> Either c a
maybeToEither :: c -> (a -> Maybe b) -> a -> Either c a
```

[TRANSFORMATION FUNCTION DESC]

```javascript
```

#### resultToEither

`crocks/Either/resultToEither`

```haskell
resultToEither :: Result e a -> Either e a
resultToEither :: (a -> Result e b) -> a -> Either e a
```

[TRANSFORMATION FUNCTION DESC]

```javascript
```

</article>
