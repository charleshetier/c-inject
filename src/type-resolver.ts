import type { Container } from "./container";
import { CONSTRUCTOR_TYPES_SYMBOL, ConstructorWithParamTypes } from "./symbols";

/**
 * Curried type recursive resolution with :
 * * 1rst call = preparation
 * * 2nd call == resolution
 *
 * Preparation step consist in prefetching constructor types
 *
 * @param type The type to be resolved
 * @param container The current container
 */
export const prepareTypeResolver = (type: ConstructorWithParamTypes, container: Container) => {
  // Pre resolution step
  const paramTypes = getConstructorParamTypes(type);
  const paramResolvers: Function[] = paramTypes?.map((paramType: any) => () => container.resolve(paramType)) ?? [];

  // Resolution step
  return () => new type(...streamResolution());

  /** Yields types resolutions */
  function* streamResolution() {
    for (const resolver of paramResolvers) yield resolver();
  }
};

/** Constructor type params strategy according to reflect-metadata existence */
const getConstructorParamTypes =
  typeof (Reflect as any).getMetadata === "function"
    ? getConstructorParamTypesUsingReflectMetadata // With reflect-metadata strategy
    : getConstructorParamTypesVanilla; // without reflect-metadata strategy

/** Constructor type params strategy using reflect-metadata */
function getConstructorParamTypesUsingReflectMetadata(
  type: ConstructorWithParamTypes & (new (...params: unknown[]) => unknown)
) {
  return type[CONSTRUCTOR_TYPES_SYMBOL] ?? (Reflect as any).getMetadata("design:paramtypes", type);
}

/** Constructor type params strategy without reflect-metadata */
function getConstructorParamTypesVanilla(type: ConstructorWithParamTypes) {
  return type[CONSTRUCTOR_TYPES_SYMBOL] ?? [];
}
