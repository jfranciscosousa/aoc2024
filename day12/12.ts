import { readInputLines } from "../utils/files.ts";

type InputType = string[][];

async function parseInput(inputPath: string): Promise<InputType> {
  const lines = await readInputLines(inputPath);
  return lines.map((line) => line.split(""));
}

function solvePart1(input: InputType): number {
  const maxY = input.length;
  const maxX = input[0].length;

  const visited = new Set<string>();
  const toVisit: [number, number][] = [[1, 1]];
  let totalPrice = 0;

  while (toVisit.length > 0) {
    let area = 0;
    let perimeter = 0;
    const [startX, startY] = toVisit.shift()!;
    const toVisitRegion: [number, number][] = [[startX, startY]];

    while (toVisitRegion.length > 0) {
      const [x, y] = toVisitRegion.shift()!;
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const current = input[y - 1][x - 1];
      area += 1;

      const neighbors: [number, number][] = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ];
      for (const [dx, dy] of neighbors) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX <= 0 || newY <= 0 || newX > maxX || newY > maxY) {
          perimeter += 1;
          continue;
        }
        if (input[newY - 1][newX - 1] === current) {
          toVisitRegion.push([newX, newY]);
        } else {
          perimeter += 1;
          toVisit.push([newX, newY]);
        }
      }
    }
    totalPrice += area * perimeter;
  }
  return totalPrice;
}

function solvePart2(input: InputType): number {
  const maxY = input.length;
  const maxX = input[0].length;

  const visited = new Set<string>();
  const toVisit: [number, number][] = [[1, 1]];
  let totalPrice = 0;

  while (toVisit.length > 0) {
    let area = 0;
    let edges = 0;
    const [startX, startY] = toVisit.shift()!;
    const toVisitRegion: [number, number][] = [[startX, startY]];

    while (toVisitRegion.length > 0) {
      const [x, y] = toVisitRegion.shift()!;
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const current = input[y - 1][x - 1];
      area += 1;

      const directionPairs: [[number, number], [number, number]][] = [
        [
          [0, -1],
          [1, 0],
        ],
        [
          [1, 0],
          [0, 1],
        ],
        [
          [0, 1],
          [-1, 0],
        ],
        [
          [-1, 0],
          [0, -1],
        ],
      ];

      // Checking corners, a corner can be considered a "side"
      for (const [[dx1, dy1], [dx2, dy2]] of directionPairs) {
        const newX1 = x + dx1,
          newY1 = y + dy1;
        const newX2 = x + dx2,
          newY2 = y + dy2;

        const isEdge1 =
          newX1 <= 0 ||
          newY1 <= 0 ||
          newX1 > maxX ||
          newY1 > maxY ||
          input[newY1 - 1][newX1 - 1] !== current;
        const isEdge2 =
          newX2 <= 0 ||
          newY2 <= 0 ||
          newX2 > maxX ||
          newY2 > maxY ||
          input[newY2 - 1][newX2 - 1] !== current;

        if (isEdge1 && isEdge2) {
          edges += 1;
        } else if (!isEdge1 && !isEdge2) {
          const newX3 = x + dx1 + dx2;
          const newY3 = y + dy1 + dy2;
          if (
            newX3 <= 0 ||
            newY3 <= 0 ||
            newX3 > maxX ||
            newY3 > maxY ||
            input[newY3 - 1][newX3 - 1] !== current
          ) {
            edges += 1;
          }
        }

        if (!(newX1 <= 0 || newY1 <= 0 || newX1 > maxX || newY1 > maxY)) {
          if (input[newY1 - 1][newX1 - 1] === current) {
            toVisitRegion.push([newX1, newY1]);
          } else {
            toVisit.push([newX1, newY1]);
          }
        }
      }
    }
    totalPrice += area * edges;
  }

  return totalPrice;
}

export async function part1(inputPath: string) {
  const input = await parseInput(inputPath);

  return solvePart1(input);
}

export async function part2(inputPath: string) {
  const input = await parseInput(inputPath);

  return solvePart2(input);
}
