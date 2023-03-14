import { decode } from "../lib/helpers";
import { DateTime, dateTimeFromFormat } from "../lib";

describe("dateTimeFromFormat", () => {
  const now = DateTime.now();

  test("decode/encode ISO (defaults)", () => {
    const codec = dateTimeFromFormat();
    const isoDate = now.toISO();
    console.log(isoDate);

    expect(decode(codec, isoDate)).toEqual(now);
    expect(codec.encode(now)).toEqual(isoDate);
  });

  test("decode ISO / encode SQL", () => {
    const codec = dateTimeFromFormat({ format: "ISO" }, { format: "SQL" });
    const isoDate = now.toISO();
    const sqlDate = now.toSQL();

    expect(decode(codec, isoDate)).toEqual(now);
    expect(codec.encode(now)).toEqual(sqlDate);
  });

  test("decode ISO / encode SQL without TZ", () => {
    const codec = dateTimeFromFormat(
      { format: "ISO" },
      { format: "SQL", includeZone: false }
    );
    const isoDate = now.toISO();
    const sqlDate = now.toSQL({ includeZone: false });

    expect(decode(codec, isoDate)).toEqual(now);
    expect(codec.encode(now)).toEqual(sqlDate);
  });

  test("decode SQL / encode ISO Date", () => {
    const codec = dateTimeFromFormat({ format: "SQL" }, { format: "ISODate" });
    const sqlDate = now.toSQL();
    const isoDate = now.toISODate();

    expect(decode(codec, sqlDate)).toEqual(now);
    expect(codec.encode(now)).toEqual(isoDate);
  });
});
