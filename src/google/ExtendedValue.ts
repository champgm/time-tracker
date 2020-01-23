import { ErrorValue } from "./ErrorValue";

export interface ExtendedValue {
  numberValue?: number,
  stringValue?: string,
  boolValue?: boolean,
  formulaValue?: string,
  errorValue?: ErrorValue,
}