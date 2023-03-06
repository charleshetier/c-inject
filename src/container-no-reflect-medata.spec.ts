import { injectable } from "./injectable";
import { Container } from "./container";
import type { CInjectToken } from "./symbols";

describe("container without reflect-metadata", () => {
  describe("resolve", () => {
    it("should resolve type with nested type with symbol registration without reflect-metadata", () => {
      // Arrange
      const container = new Container();
      class Bar {
        public hello() {
          return "hello";
        }
      }

      const barToken = Symbol("bar") as CInjectToken<Bar>;
      container.registerType(barToken, Bar);

      @injectable([barToken])
      class Foo {
        constructor(public readonly bar: Bar) {}
      }

      // Act
      const foo = container.resolve(Foo);

      // Assert
      expect((Reflect as any).getMetadata).toBeUndefined();
      expect(foo).toBeTruthy();
      expect(foo.bar.hello()).toBe("hello");
    });

    it("should resolve type with nested type without any registration without reflect-metadata", () => {
      // Arrange
      const container = new Container();
      class Bar {
        public hello() {
          return "hello";
        }
      }

      @injectable([Bar])
      class Foo {
        constructor(public readonly bar: Bar) {}
      }

      // Act
      const foo = container.resolve(Foo);

      // Assert
      expect((Reflect as any).getMetadata).toBeUndefined();
      expect(foo).toBeTruthy();
      expect(foo.bar.hello()).toBe("hello");
    });

    it("should resolve type with nested type without any registration without reflect-metadata nor decorator", () => {
      // Arrange
      const container = new Container();
      class Bar {
        public hello() {
          return "hello";
        }
      }

      class Foo {
        constructor(public readonly bar: Bar) {}
      }
      injectable([Bar])(Foo);

      // Act
      const foo = container.resolve(Foo);

      // Assert
      expect((Reflect as any).getMetadata).toBeUndefined();
      expect(foo).toBeTruthy();
      expect(foo.bar.hello()).toBe("hello");
    });

    it("should throw an error if no possible resolution strategy found", () => {
      // Arrange
      const container = new Container();
      const unregisteredToken = Symbol();

      // Act, Assert
      expect(() => container.resolve(unregisteredToken)).toThrow();
    });
  });

  describe("children", () => {
    it("should resolve root registration from child", () => {
      const container = new Container();
      const barToken: CInjectToken<string> = Symbol("bar");
      container.registerConstant(barToken, "bar value");

      @injectable([barToken])
      class Foo {
        constructor(public readonly bar: string) {}
      }

      const foo = container.createChild().resolve(Foo);

      expect(foo).toBeTruthy();
      expect(foo.bar).toBe("bar value");
    });

    it("should share resolved type with root instance", () => {
      const container = new Container();
      const barToken: CInjectToken<string> = Symbol("bar");
      container.registerConstant(barToken, "bar value");

      @injectable([barToken])
      class Foo {
        constructor(public readonly bar: string) {}
      }

      const fooFromChild = container.createChild().resolve(Foo);
      const fooFromRoot = container.resolve(Foo);

      expect(fooFromChild === fooFromRoot).toBeTruthy();
    });

    it("should share resolved type with sibling instance", () => {
      const container = new Container();
      const barToken: CInjectToken<string> = Symbol("bar");
      container.registerConstant(barToken, "bar value");

      @injectable([barToken])
      class Foo {
        constructor(public readonly bar: string) {}
      }

      const fooFromChild1 = container.createChild().resolve(Foo);
      const fooFromChild2 = container.createChild().resolve(Foo);

      expect(fooFromChild1 === fooFromChild2).toBeTruthy();
    });
  });
});
