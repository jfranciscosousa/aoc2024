import { compact } from "lodash";

function findXMASCount(matrix: string[][], y: number, x: number) {
  const horizontalForward = compact([
    matrix[y][x],
    matrix[y][x + 1],
    matrix[y][x + 2],
    matrix[y][x + 3],
  ]).join("");
  const horizontalBackwards = compact([
    matrix[y][x],
    matrix[y][x - 1],
    matrix[y][x - 2],
    matrix[y][x - 3],
  ]).join("");

  const verticalUp = compact([
    matrix[y][x],
    matrix[y + 1]?.[x],
    matrix[y + 2]?.[x],
    matrix[y + 3]?.[x],
  ]).join("");
  const verticalDown = compact([
    matrix[y][x],
    matrix[y - 1]?.[x],
    matrix[y - 2]?.[x],
    matrix[y - 3]?.[x],
  ]).join("");

  const diagTopLeft = compact([
    matrix[y][x],
    matrix[y + 1]?.[x - 1],
    matrix[y + 2]?.[x - 2],
    matrix[y + 3]?.[x - 3],
  ]).join("");
  const diagTopRight = compact([
    matrix[y][x],
    matrix[y + 1]?.[x + 1],
    matrix[y + 2]?.[x + 2],
    matrix[y + 3]?.[x + 3],
  ]).join("");

  const diagBottomLeft = compact([
    matrix[y][x],
    matrix[y - 1]?.[x - 1],
    matrix[y - 2]?.[x - 2],
    matrix[y - 3]?.[x - 3],
  ]).join("");
  const diagBottomRight = compact([
    matrix[y][x],
    matrix[y - 1]?.[x + 1],
    matrix[y - 2]?.[x + 2],
    matrix[y - 3]?.[x + 3],
  ]).join("");

  return [
    horizontalForward,
    horizontalBackwards,
    verticalUp,
    verticalDown,
    diagTopLeft,
    diagTopRight,
    diagBottomLeft,
    diagBottomRight,
  ].filter((word) => ["XMAS", "SAMX"].includes(word)).length;
}

export async function part1(inputPath: string): Promise<number> {
  const input = await Deno.readTextFile(inputPath);
  const matrix = input.split("\n").map((line) => line.split(""));
  let total = 0;

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === "X") total += findXMASCount(matrix, y, x);
    }
  }

  return total;
}

function checkIfDiagonalMAS(matrix: string[][], y: number, x: number) {
  const diagTopLeft = matrix[y + 1]?.[x - 1];
  const diagTopRight = matrix[y + 1]?.[x + 1];
  const diagBottomLeft = matrix[y - 1]?.[x - 1];
  const diagBottomRight = matrix[y - 1]?.[x + 1];

  const cross1 = [diagTopLeft, matrix[y][x], diagBottomRight].join("");
  const cross2 = [diagTopRight, matrix[y][x], diagBottomLeft].join("");

  return (
    [cross1, cross2].filter((word) => ["MAS", "SAM"].includes(word)).length > 1
  );
}

export async function part2(inputPath: string): Promise<number> {
  const input = await Deno.readTextFile(inputPath);
  const matrix = input.split("\n").map((line) => line.split(""));
  let total = 0;

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === "A" && checkIfDiagonalMAS(matrix, y, x)) total++;
    }
  }

  return total;
}
