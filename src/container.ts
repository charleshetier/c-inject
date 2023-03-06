import { prepareTypeResolver } from "./type-resolver";
import type { CInjectToken } from "./symbols";

/** Dependency injection container */
export class Container {
  /** The root container instance */
  public readonly root: Container;

  constructor(public readonly parent?: Container) {
    this.root = parent?.root ?? this;
  }

  /** The registration state (initially with registration, then with resolved types) */
  private readonly registrations = new Map<any, (container: Container) => any>();

  /**
   * Resolves the specified key
   * @param key The key to be resolved. Should be a Type instance or a registration token
   * @returns The resolved instance
   * @throws Error when resolution has failed
   */
  public resolve<T extends CInjectToken<any> | { new (...args: any[]): any } | string>(
    key: T
  ): T extends CInjectToken<infer TResult>
    ? TResult
    : T extends { new (...args: any[]): infer TResult }
    ? TResult
    : any {
    // Existing registration case
    const registration = this.getRegistrationRecursively(key);
    if (registration) return registration(this);

    // Type resolution on the fly (only the first time)
    if (typeof key?.constructor === "function") {
      const instance = prepareTypeResolver(
        key as any,
        this.root // Root is used for type resolution on the fly so that singleton instances can be shared with linked containers
      )();
      this.root.registerConstant(key, instance);
      return instance as any;
    }

    // Cannot resolve the specified key
    throw new Error(`The specified key ${key} cannot be resolved`);
  }

  /**
   * Creates a child container.
   * The child container will inherit current container instance registrations
   */
  public createChild() {
    return new Container(this);
  }

  /**
   * Registers a constant value
   * @param key The associated key
   * @param value The constant value
   */
  public registerConstant(key: any, value: any /*, options?: { multi?: boolean }*/) {
    this.registrations.set(key, () => value);
  }

  /**
   * Registers a factory
   * @param key The associated key
   * @param factory The factory
   * @param options Available registration options
   */
  public registerFactory(
    key: any,
    factory: () => any,
    options?: {
      /*multi?: boolean */
      /** Determines whether the type resolution should be transient */
      transient?: boolean;
    }
  ) {
    if (options?.transient) this.registrations.set(key, () => factory());
    else {
      let instance: any = undefined;
      let solved = false;
      this.registrations.set(key, () => (solved ? instance : finalize()));
      function finalize() {
        solved = true;
        instance = factory!();
        return instance;
      }
    }

    return this;
  }

  /**
   * Registers a type
   * @param key The associated key
   * @param type The type instance
   * @param options Available options
   */
  public registerType(
    key: any,
    type: any,
    options?: {
      /*multi?: boolean;*/
      /** Determines whether the type resolution should be transient */
      transient?: boolean;
    }
  ) {
    return this.registerFactory(key, prepareTypeResolver(type, this), { transient: options?.transient });
  }

  public getRegistrationRecursively(key: any): any {
    return this.registrations.get(key) ?? this.parent?.getRegistrationRecursively(key);
  }
}
