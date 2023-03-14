import { isLeft } from "fp-ts/Either";

import { Type } from "io-ts";

/**
 * returns value if succeed and undefined otherwise
 **/
export function decode<I, O>(
  codec: Type<I, O, unknown>,
  value: unknown
): undefined | I {
  const v = codec.decode(value);
  if (isLeft(v)) {
    return undefined;
  }

  return v.right;
}
