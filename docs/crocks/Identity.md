# Identity

`Identity : a -> a`

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

### ap

`Identity m => m (a -> b) -> m b`

### chain

`Identity m => (a -> m b) -> m b`

### equals

`Identity x => x -> Boolean`

### map

`Identity m => m (a -> b) -> Identity m b`

### of

`Identity a => a -> Identity a`

### sequence

`Identity m a => (m a) -> m (Identity a)`

### traverse

`Identity (a -> m b) => a -> m b -> Identity m b`

### value

`Identity a -> a`
