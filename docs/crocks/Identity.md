# Identity

`Identity a`

Crock which returns the same value that was used as its argument

## Why?

To expose the constructor and instances defined below

| Constructor | Instance |
|:---|:---|
| [`of`](#of) | [`ap`](#ap), [`chain`](#chain), [`equals`](#equals), [`map`](#map), [`of`](#of), [`sequence`](#sequence), [`traverse`](#traverse), [`value`](#value) |

## Constructors

### of

`Identity a => a -> Identity a`

## Instances

### inspect

`Identity a => Identity a`

### value

`() -> a`

### type

`() -> Identity`

### equals

`a -> Boolean`

### map

`Identity m => m (a -> b) -> m b`

### ap

`Identity m => m a ~> m (a -> b) -> m b`

### of

`Identity a => a -> Identity a`

### chain

`Identity m => m a ~> (a -> m b) -> m b`

### sequence

`Identity m, Applicative f => m (f b) ~> f (m a) -> m (f a)`

### traverse

`Identity m, Applicative f => m a ~> f (m b) -> m (f b)`
