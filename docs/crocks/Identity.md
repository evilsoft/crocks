# Identity

`Identity : a -> a`

It's just a function which returns what you pass into it.

## What a crock!

It converts your `non-crock` into a `crock`

```js
const frozenPizza = Identity('pizza') //Identity pizza
const microwave = x => 'microwave ' + x
const dinner = frozenPizza.map(microwave) //Identity "microwave pizza"
dinner.value() // "microwave pizza"
```

| Constructor | Instance |
|:---|:---|
| [`of`](#of) | [`ap`](#ap), [`chain`](#chain), [`equals`](#equals), [`map`](#map), [`of`](#of), [`sequence`](#sequence), [`traverse`](#traverse), [`value`](#value) |

## Constructors

### of

```js
crocks.Identity.of([1,2,10])
crocks.Identity([1,2,10])
```

## Instances

### ap

`Function (a -> b) -> Function b`

### chain

`(a -> m b) -> m b`

### equals

`x -> Boolean`

### map

`(a -> b) -> Function b`

### of

`a -> Function a`

### sequence

`Type (m a) -> m (Type a)`

### traverse

`a -> Function b -> Function b`

### value

`a -> a`
