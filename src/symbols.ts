export const CONSTRUCTOR_TYPES_SYMBOL = Symbol("c-inject:constructor-type");

export interface CInjectToken<TValue> extends Symbol {}

export type ConstructorWithParamTypes = { [CONSTRUCTOR_TYPES_SYMBOL]?: any[] } & (new (
  ...params: unknown[]
) => unknown);
