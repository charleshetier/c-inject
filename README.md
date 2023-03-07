# C-inject ![GitHub CI](https://github.com/charleshetier/c-inject/actions/workflows/ci.yml/badge.svg)
A dead simple, fast, vanilla, memory friendly, typescript dependency injection library

## Usage
### Using reflect-metadata and typescript decorators
**requirements:**
* The project should have reflect-metadata npm package installed
* tsconfig should have both ```experimentalDecorators``` and ```emitDecoratorMetadata``` to ```true```

```typescript
class Bar { [...] }

@injectable()
class Foo {
  constructor(public readonly bar: Bar) {}
}

const container = new container();
const foo = container.resolve(Foo); // Contains foo instance (resolved by default as singleton for container scope)
```

### Using typescript decorators (without leveraging on reflect-metadata)
**requirements:** tsconfig should have both ```experimentalDecorators``` and ```emitDecoratorMetadata``` to ```true```
```typescript
class Bar { [...] }

@injectable([Bar]) // Constructor parameter types should be specified
class Foo {
  constructor(public readonly bar: Bar) {}
}

const container = new container();
const foo = container.resolve(Foo); // Contains foo instance (resolved by default as singleton for container scope)
```

### Vanilla
**requirements:** none
```typescript
class Bar { [...] }

class Foo {
  constructor(public readonly bar: Bar) {}
}
injectable([Bar])(Foo) // curried injectable declaration: injection keys, then injectable class

const container = new container();
const foo = container.resolve(Foo); // Contains foo instance (resolved by default as singleton for container scope)
```