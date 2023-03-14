# io-ts-datetime

[![NPM Version](https://img.shields.io/npm/v/io-ts-datetime.svg?style=flat-square)](https://www.npmjs.com/package/io-ts-datetime)
[![NPM Downloads](https://img.shields.io/npm/dt/io-ts-datetime.svg?style=flat-square)](https://www.npmjs.com/package/io-ts-datetime)

io-ts codec types for dates, datetimes using [luxon](https://moment.github.io/luxon) date time library

# Install

`npm i io-ts-datetime`

**Note**. [`luxon`](https://moment.github.io/luxon), [`fp-ts`](https://github.com/gcanti/fp-ts), and [`io-ts`](https://github.com/gcanti/io-ts) are peer dependencies for `io-ts-datetime`

# Usage

## dateTimeFromFormat(decodeOptions, encodeOptions)

returns a codec that decodes `DateTime` from a string and encodes back to a string.
When `decodeOptions` or `encodeOptions` are ommited the ISO DateTime format will be used.

### decodeOptions

- format - "ISO", "SQL", string format. For format tokens look into [table of tokens](https://moment.github.io/luxon/#/parsing?id=table-of-tokens)
- zone - (string | Zone) (default 'local') use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
- setZone - boolean (default false) override the zone with a fixed-offset zone specified in the string itself, if it specifies one
- locale - string (default 'system'slocale') a locale to set on the resulting DateTime instance
- outputCalendar - string the output calendar to set on the resulting DateTime instance
- numberingSystem - string the numbering system to set on the resulting DateTime instance

### encodeOptions

- format - "ISODate", "ISO", "Basic", "Extended", "SQL", string format. For format tokens look into [table of tokens](https://moment.github.io/luxon/#/parsing?id=table-of-tokens)
  - "Extended" is the same as "ISO"
  - "Basic" is ISO format without `-` and `:` delimeters

Other encode options depend on the format.

- `ISODate` - there is no additional options
- `ISO`, `Basic`, `Extended` - accepts all `toISO` method options
  - suppressSeconds - boolean (default false) exclude seconds from the format if they're 0
  - suppressMilliseconds - boolean (default false) exclude milliseconds from the format if they're 0
  - includeOffset - boolean (default true) include the offset, such as 'Z' or '-04:00'
  - extendedZone - boolean (default false) add the time zone format extension
- `SQL` - accepts all `toSQL` method options
  - includeZone - boolean (default false) include the zone, such as 'America/New_York'. Overrides includeOffset.
  - includeOffset - boolean (default true) include the offset, such as 'Z' or '-04:00'
  - includeOffsetSpace - boolean (default true) include the space between the time and the offset, such as '05:15:16.345 -04:00'
- Custom format - accepts all `toFormat` method options to override the configuration options on this DateTime

## Example

```ts
const ISOCodec = dateTimeFromFormat();
const dateTime = ISOCodec.decode("2023-03-14T14:25:22.663-04:00").right;
const isoString = ISOCodec.encode(dateTime);
// "2023-03-14T14:25:22.663-04:00"

const codec = dateTimeFromFormat({ format: "SQL" }, { format: "ISODate" });
const dateTime = ISOCodec.decode("2023-03-14 14:25:22").right;
const isoDateString = ISOCodec.encode(dateTime);
// "2023-03-14"
```

License

[MIT](LICENSE)
