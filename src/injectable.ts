import { CONSTRUCTOR_TYPES_SYMBOL } from "./symbols";

export const injectable = (types?: any[]) => (ctor: Function & { [CONSTRUCTOR_TYPES_SYMBOL]?: any[] }) => {
  ctor[CONSTRUCTOR_TYPES_SYMBOL] = types;
};
