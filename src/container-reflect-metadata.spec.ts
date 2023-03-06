import "reflect-metadata";
import { injectable } from "./injectable";
import { Container } from "./container";

describe("container with reflect metadata", () => {
  describe("resolve", () => {
    it("should resolve type with nested type without any registration", () => {
      const container = new Container();
      class Bar {
        public hello() {
          return "hello";
        }
      }

      @injectable()
      class Foo {
        constructor(public readonly bar: Bar) {}
      }

      const foo = container.resolve(Foo);

      // Typing sandbox...
      // type Test = typeof Foo extends abstract new (...args: any) => infer R ? R : any;
      // type sdf = Test["bar"];

      expect(foo).toBeTruthy();
      expect(foo.bar.hello()).toBe("hello");
    });
  });
});
