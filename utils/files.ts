import { Matrix } from "./matrix.ts";

export function readInputContent(inputPath: string) {
  return Deno.readTextFile(inputPath).then((v) => v.trim());
}

export function readInputLines(inputPath: string) {
  return readInputContent(inputPath).then((v) => v.split("\n"));
}

export function readInputMatrix<T>(
  inputPath: string,
  transformer: (raw: string) => T
): Promise<Matrix<T>> {
  function transformerWithCast(v: string) {
    return transformer ? transformer(v) : v as T;
  }

  return readInputContent(inputPath)
    .then((v) => v.split("\n"))
    .then((v) => v.map((v) => v.split("").map(transformerWithCast)))
    .then((v) => Matrix.fromArray(v));
}
