import { readInputContent } from "../utils/files.ts";
import { Matrix } from "../utils/matrix.ts";

function directionsMap(): Record<string, [number, number]> {
  return { "^": [-1, 0], ">": [0, 1], v: [1, 0], "<": [0, -1] };
}

function findRobot(grid: Matrix<number>): [number, number] {
  let py = 0,
    px = 0,
    f = false;
  for (let y = 0; y < grid.height && !f; y++) {
    for (let x = 0; x < grid.width && !f; x++) {
      if (grid.get(y, x) === "@".charCodeAt(0)) {
        py = y;
        px = x;
        f = true;
      }
    }
  }
  return [py, px];
}

function moveBoxes(
  grid: Matrix<number>,
  boxes: [number, number][],
  dRow: number,
  dCol: number
) {
  for (const [by, bx] of boxes) {
    const ty = by + dRow;
    const tx = bx + dCol;
    if (ty < 0 || ty >= grid.height || tx < 0 || tx >= grid.width) continue;
    grid.set(ty, tx, grid.get(by, bx));
    grid.set(by, bx, ".".charCodeAt(0));
  }
}

function boxesFromSeen(
  seen: Set<string>,
  robotRow: number,
  robotCol: number
): [number, number][] {
  const arr = Array.from(seen).map(
    (s) => s.split(",").map(Number) as [number, number]
  );
  arr.sort((a, b) => {
    const da = [Math.abs(robotCol - a[1]), Math.abs(robotRow - a[0])];
    const db = [Math.abs(robotCol - b[1]), Math.abs(robotRow - b[0])];
    return da[0] !== db[0] ? da[0] - db[0] : da[1] - db[1];
  });
  arr.reverse();
  return arr;
}

function applyInstructions(
  grid: Matrix<number>,
  instructions: string,
  initialrobotRow: number,
  initialrobotCol: number
): number {
  // Directions for each instruction character
  const directionMap = directionsMap();

  let robotRow = initialrobotRow;
  let robotCol = initialrobotCol;

  // Process each instruction in sequence
  outerLoop:
  for (const instruction of instructions) {
    const dirDelta = directionMap[instruction];
    if (!dirDelta) continue;
    const [dRow, dCol] = dirDelta;

    // We use a queue and a set to track which boxes can be moved forward
    const positionsToCheck: [number, number][] = [[robotRow, robotCol]];
    const visitedPositions = new Set<string>();

    // BFS-like process to determine all movable boxes
    while (positionsToCheck.length > 0) {
      const [currentRow, currentCol] = positionsToCheck.shift()!;
      const positionKey = `${currentRow},${currentCol}`;

      if (visitedPositions.has(positionKey)) continue;
      visitedPositions.add(positionKey);

      const nextRow = currentRow + dRow;
      const nextCol = currentCol + dCol;

      // Ignore out-of-bounds
      if (
        nextRow < 0 ||
        nextRow >= grid.height ||
        nextCol < 0 ||
        nextCol >= grid.width
      ) {
        continue;
      }

      const cellValue = grid.get(nextRow, nextCol);

      // If we hit a wall, we cannot move in this direction
      if (cellValue === "#".charCodeAt(0)) {
        // Abort this instruction; skip to the next one
        continue outerLoop;
      }

      // If it's an 'O', we can push this box forward
      if (cellValue === "O".charCodeAt(0)) {
        positionsToCheck.push([nextRow, nextCol]);
      } else if (cellValue === "[".charCodeAt(0)) {
        // '[' means we also consider the cell to the right
        positionsToCheck.push([nextRow, nextCol]);
        if (nextCol + 1 < grid.width) positionsToCheck.push([nextRow, nextCol + 1]);
      } else if (cellValue === "]".charCodeAt(0)) {
        // ']' means we also consider the cell to the left
        positionsToCheck.push([nextRow, nextCol]);
        if (nextCol - 1 >= 0) positionsToCheck.push([nextRow, nextCol - 1]);
      }
      // Other characters don't add new positions
    }

    // Determine the order in which to move boxes
    const boxesToMove = boxesFromSeen(visitedPositions, robotRow, robotCol);

    // Move the boxes in the determined order
    moveBoxes(grid, boxesToMove, dRow, dCol);

    // Update robot position after pushing boxes
    robotRow += dRow;
    robotCol += dCol;
  }

  // Compute final score after executing all instructions
  let score = 0;
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const ch = grid.get(y, x);
      if (ch === "O".charCodeAt(0) || ch === "[".charCodeAt(0)) {
        score += y * 100 + x;
      }
    }
  }

  return score;
}


function parseOriginalGrid(raw: string): Matrix<number> {
  return Matrix.fromArray(
    raw.split("\n").map((l) => l.split("").map((c) => c.charCodeAt(0)))
  );
}

function parseExpandedGrid(raw: string): Matrix<number> {
  const rows = raw.split("\n").map((line) => {
    const arr: number[] = [];
    for (const ch of line) {
      if (ch === "#") arr.push("#".charCodeAt(0), "#".charCodeAt(0));
      else if (ch === "O") arr.push("[".charCodeAt(0), "]".charCodeAt(0));
      else if (ch === ".") arr.push(".".charCodeAt(0), ".".charCodeAt(0));
      else if (ch === "@") arr.push("@".charCodeAt(0), ".".charCodeAt(0));
      else throw new Error("Unexpected character");
    }
    return arr;
  });
  return Matrix.fromArray(rows);
}

function solve(grid: Matrix<number>, instructions: string): number {
  const [py, px] = findRobot(grid);
  return applyInstructions(grid, instructions, py, px);
}

export async function part1(inputPath: string): Promise<number> {
  const input = await readInputContent(inputPath);
  const [r, inst] = input.split("\n\n");
  return solve(parseOriginalGrid(r), inst);
}

export async function part2(inputPath: string): Promise<number> {
  const input = await readInputContent(inputPath);
  const [r, inst] = input.split("\n\n");
  return solve(parseExpandedGrid(r), inst);
}
