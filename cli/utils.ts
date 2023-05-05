import { Buffer } from "buffer";

// PACK

export const packOption = (
  buf: Buffer,
  data: any,
  packF: (buf: Buffer, data: any) => Buffer
): Buffer => {
  if (data) {
    buf = packBool(buf, true);
    console.log(buf);
    buf = packF(buf, data);
    console.log(buf);
    return buf;
  } else {
    buf = packBool(buf, false);
    console.log(buf);
    return buf;
  }
};

export const packVec = (
  buf: Buffer,
  cap: number,
  data: any[],
  packF: (buf: Buffer, data: any) => Buffer
): Buffer => {
  buf = packUInt32(buf, data.length);
  for (let i = 0; i < data.length; i++) {
    buf = packF(buf, data[i]);
  }
  return buf;
};

export const packString = (buf: Buffer, data: string): Buffer => {
  let dataBytes = new TextEncoder().encode(data);
  buf = packUInt32(buf, dataBytes.length);
  let newArrayBuffer = new ArrayBuffer(buf.length + dataBytes.length);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.set(dataBytes, buf.length);

  return newBuffer;
};

export const packBool = (buf: Buffer, data: boolean): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 1);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  data
    ? newBuffer.writeUInt8(1, buf.length)
    : newBuffer.writeUInt8(0, buf.length);
  return newBuffer;
};

export const packUInt8 = (buf: Buffer, data: number): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 1);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.writeUInt8(data, buf.length);
  return newBuffer;
};

export const packInt8 = (buf: Buffer, data: number): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 1);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.writeInt8(data, buf.length);
  return newBuffer;
};

export const packUInt16 = (buf: Buffer, data: number): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 2);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.writeUInt16LE(data, buf.length);
  return newBuffer;
};

export const packInt16 = (buf: Buffer, data: number): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 2);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.writeInt16LE(data, buf.length);
  return newBuffer;
};

export const packUInt32 = (buf: Buffer, data: number): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 4);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.writeUInt32LE(data, buf.length);
  return newBuffer;
};

export const packInt32 = (buf: Buffer, data: number): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 4);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.writeInt32LE(data, buf.length);
  return newBuffer;
};

export const packUInt64 = (buf: Buffer, data: bigint): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 8);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.writeBigUInt64LE(data, buf.length);
  return newBuffer;
};

export const packInt64 = (buf: Buffer, data: bigint): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length + 8);
  let newBuffer = Buffer.from(newArrayBuffer);
  newBuffer.set(buf);
  newBuffer.writeBigInt64LE(data, buf.length);
  return newBuffer;
};

// export const packUInt128 = (buf: Buffer, data: number): Buffer => {
//   pointer = buf.writeBigUInt128LE(BigInt(data), pointer);
//   return newBuffer;
// }

// export const packInt128 = (buf: Buffer, data: number, ): Buffer => {
//   pointer = buf.writeBigInt128LE(BigInt(data), pointer);
//   return newBuffer;
// }

// UNPACK

export const unpackOption = (
  buf: Buffer,
  unpackF: (buffer: Buffer) => [any, Buffer]
): [any, Buffer] => {
  let isSome, data;
  [isSome, buf] = unpackBool(buf);
  if (isSome) {
    [data, buf] = unpackF(buf);
    return [data, buf];
  } else {
    return [null, buf];
  }
};

export const unpackVec = (
  buf: Buffer,
  unpackF: (buffer: Buffer) => [any, Buffer]
): [any, Buffer] => {
  let vecLength, element;
  [vecLength, buf] = unpackUInt32(buf);
  let array = [];
  for (let i = 0; i < vecLength; i++) {
    [element, buf] = unpackF(buf);
    array.push(element);
  }
  return [array, buf];
};

export const unpackString = (
  buf: Buffer,
  fieldSize: number
): [string, Buffer] => {
  let strLen = buf.readUInt32LE(0);
  let str = buf.subarray(4, 4 + strLen).toString();

  let newBuf = trimBuffer(buf, fieldSize);

  return [str, newBuf];
};

export const unpackUInt8 = (buf: Buffer): [number, Buffer] => {
  let uint8 = buf.readUInt8(0);
  let newBuf = trimBuffer(buf, 1);

  return [uint8, newBuf];
};

export const unpackBool = (buf: Buffer): [boolean, Buffer] => {
  check_valid_bool_value(buf);
  let newBuf = trimBuffer(buf, 1);

  return [buf[0] == 0x01, newBuf];
};

export const unpackInt8 = (buf: Buffer): [number, Buffer] => {
  let int8 = buf.readInt8(0);
  let newBuf = trimBuffer(buf, 1);

  return [int8, newBuf];
};

export const unpackUInt16 = (buf: Buffer): [number, Buffer] => {
  let uint16 = buf.readUInt16LE(0);
  let newBuf = trimBuffer(buf, 2);

  return [uint16, newBuf];
};

export const unpackInt16 = (buf: Buffer): [number, Buffer] => {
  let int16 = buf.readInt16LE(0);
  let newBuf = trimBuffer(buf, 2);

  return [int16, newBuf];
};

export const unpackUInt32 = (buf: Buffer): [number, Buffer] => {
  let uint32 = buf.readUInt32LE(0);
  let newBuf = trimBuffer(buf, 4);

  return [uint32, newBuf];
};

export const unpackInt32 = (buf: Buffer): [number, Buffer] => {
  let int32 = buf.readInt32LE(0);
  let newBuf = trimBuffer(buf, 4);

  return [int32, newBuf];
};

export const unpackUInt64 = (buf: Buffer): [bigint, Buffer] => {
  let uint64 = buf.readBigUInt64LE(0);
  let newBuf = trimBuffer(buf, 8);

  return [uint64, newBuf];
};

export const unpackInt64 = (buf: Buffer): [bigint, Buffer] => {
  let int64 = buf.readBigInt64LE(0);

  let newBuf = trimBuffer(buf, 8);

  return [int64, newBuf];
};

//////////////////////// Generics

// Creates a copy of a subarray of the original Buffer and returns it
const trimBuffer = (buf: Buffer, startIndex: number): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length - startIndex);
  let newBuf = Buffer.from(newArrayBuffer);
  newBuf.set(buf.subarray(startIndex));

  return newBuf;
};

export const copyBuffer = (buf: Buffer): Buffer => {
  let newArrayBuffer = new ArrayBuffer(buf.length);
  let newBuf = Buffer.from(newArrayBuffer);

  newBuf.set(buf);

  return newBuf;
};

const check_valid_bool_value = (buf: Buffer) => {
  let [number, _] = unpackUInt8(buf);
  if (number > 1) throw new Error(`${buf}: Invalid boolean value`);
};
