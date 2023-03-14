import { Chain } from "fp-ts/Either";
import { Type, string, success, failure } from "io-ts";

import {
  DateTime,
  DateTimeOptions,
  LocaleOptions,
  ToSQLOptions,
  ToISOFormat,
  ToISOTimeOptions,
} from "luxon";

export interface DecodeOptions extends DateTimeOptions {
  format: string;
}

type DateTimeCodec = Type<DateTime, string, unknown>;

type ISOFormat = "ISO" | ToISOFormat;

type ISOEncodeOptions = ToISOTimeOptions & {
  format: ISOFormat;
};

interface SQLEncodeOptions extends ToSQLOptions {
  format: "SQL";
}

export interface FormatEncodeOptions extends LocaleOptions {
  format: string;
}

export interface ISODateEncoderOptions {
  format: "ISODate";
}

export function dateTimeFromFormat(
  decodeOptions?: DecodeOptions,
  encodeOptions?: ISOEncodeOptions
): DateTimeCodec;

export function dateTimeFromFormat(
  decodeOptions?: DecodeOptions,
  encodeOptions?: SQLEncodeOptions
): DateTimeCodec;

export function dateTimeFromFormat(
  decodeOptions?: DecodeOptions,
  encodeOptions?: FormatEncodeOptions
): DateTimeCodec;

export function dateTimeFromFormat(
  decodeOptions?: DecodeOptions,
  encodeOptions?: ISODateEncoderOptions
): DateTimeCodec;

export function dateTimeFromFormat(
  decodeOptions?: DecodeOptions,
  encodeOptions?:
    | ISODateEncoderOptions
    | ISOEncodeOptions
    | SQLEncodeOptions
    | FormatEncodeOptions
): DateTimeCodec {
  // decode
  const decodeFormat = decodeOptions?.format ?? "ISO";
  const decode = getDecode(decodeFormat, decodeOptions);

  // encode
  const encodeFormat = encodeOptions?.format ?? decodeFormat;
  const encode = getEncode(encodeFormat, encodeOptions);

  return new Type(
    `DateTime from ${decodeFormat} to ${encodeFormat}`,
    (u): u is DateTime => u instanceof DateTime && u.isValid,
    (u, c) =>
      Chain.chain(string.validate(u, c), (s: string) => {
        const d = decode(s);

        return d.isValid
          ? success(d)
          : failure(
              u,
              c,
              d.invalidExplanation ?? `Failed to decode from ${decodeFormat}`
            );
      }),
    encode
  );
}

function getDecode(
  format: string,
  decodeOptions?: DecodeOptions
): (date: string) => DateTime {
  switch (format.toLowerCase()) {
    case "iso":
      return (s) => DateTime.fromISO(s, decodeOptions);

    case "sql":
      return (s) => DateTime.fromSQL(s, decodeOptions);

    default:
      return (s) => DateTime.fromFormat(s, format, decodeOptions);
  }
}

function getEncode(
  format: string,
  encodeOptions?:
    | ISODateEncoderOptions
    | ISOEncodeOptions
    | SQLEncodeOptions
    | FormatEncodeOptions
): (date: DateTime) => string {
  switch (format.toLowerCase()) {
    case "isodate":
      return (date: DateTime) => date.toISODate();

    case "iso":
      // eslint-disable-next-line no-case-declarations
      const options: ISOEncodeOptions = {
        ...encodeOptions,
        format: "extended",
      };
      return (date: DateTime) => date.toISO(options);

    case "basic":
    case "extended":
      return (date: DateTime) => date.toISO(encodeOptions as ISOEncodeOptions);

    case "sql":
      return (date: DateTime) => date.toSQL(encodeOptions as SQLEncodeOptions);

    default:
      return (date: DateTime) =>
        date.toFormat(format, encodeOptions as FormatEncodeOptions);
  }
}
