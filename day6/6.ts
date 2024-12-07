const GUARD_CHAR = "^";
const OBSTACLE_CHAR = "#";
const REGULAR_CHAR = ".";

// Use direct indexing for directions:
const deltas = [
  [-1, 0], // UP
  [0, 1], // RIGHT
  [1, 0], // DOWN
  [0, -1], // LEFT
];

function turnRight(d: number): number {
  return (d + 1) & 3; // Equivalent to (d + 1) % 4, but slightly faster bitwise
}

async function processMap(inputPath: string) {
  const input = await Deno.readTextFile(inputPath);
  const rows = input.split("\n");
  const matrix = rows.map((line) => line.split(""));

  const height = matrix.length;
  const width = matrix[0].length;

  let guardY = -1;
  let guardX = -1;

  // Find the guard efficiently
  outer: for (let y = 0; y < height; y++) {
    const row = matrix[y];
    for (let x = 0; x < width; x++) {
      if (row[x] === GUARD_CHAR) {
        guardY = y;
        guardX = x;
        break outer;
      }
    }
  }

  if (guardY === -1 || guardX === -1) throw new Error("where_is_the_guard????");

  let direction = 0;
  let y = guardY;
  let x = guardX;

  // Use a numeric hash for visited positions instead of strings
  // hashPos = y * width + x
  const visitedPositions = new Set<number>();
  visitedPositions.add(y * width + x);

  while (true) {
    const [deltay, deltax] = deltas[direction];
    y += deltay;
    x += deltax;

    if (y < 0 || x < 0 || y >= height || x >= width) break;

    const current = matrix[y][x];
    if (current === REGULAR_CHAR || current === GUARD_CHAR) {
      visitedPositions.add(y * width + x);
    } else {
      // Revert to old position and turn right
      y -= deltay;
      x -= deltax;
      direction = turnRight(direction);
    }
  }

  return {
    matrix,
    guard: [guardY, guardX] as [number, number],
    visitedPositions,
    width,
    height,
  };
}

export async function part1(inputPath: string): Promise<number> {
  const { visitedPositions } = await processMap(inputPath);
  return visitedPositions.size;
}

// Simplify hash function (shift might be fine, but multiplication is simpler)
function stateHash(
  y: number,
  x: number,
  direction: number,
  width: number
): number {
  return (y * width + x) * 4 + direction;
}

export async function part2(inputPath: string): Promise<number> {
  const { matrix, guard, visitedPositions, width, height } = await processMap(
    inputPath
  );

  function canHaveObstacle(oy: number, ox: number) {
    const originalChar = matrix[oy][ox];
    if (originalChar === OBSTACLE_CHAR) return false;

    matrix[oy][ox] = OBSTACLE_CHAR;
    let y = guard[0];
    let x = guard[1];
    let direction = 0;
    const visited = new Set<number>();

    while (true) {
      const pos = stateHash(y, x, direction, width);
      if (visited.has(pos)) {
        matrix[oy][ox] = originalChar;
        return true;
      }
      visited.add(pos);

      const [deltay, deltax] = deltas[direction];
      const nexty = y + deltay;
      const nextx = x + deltax;

      if (nexty < 0 || nextx < 0 || nexty >= height || nextx >= width) {
        matrix[oy][ox] = originalChar;
        break;
      }

      const cell = matrix[nexty][nextx];
      if (cell === OBSTACLE_CHAR) {
        direction = turnRight(direction);
      } else {
        y = nexty;
        x = nextx;
      }
    }

    // Restore original char
    matrix[oy][ox] = originalChar;
    return false;
  }

  let total = 0;
  for (const pos of visitedPositions) {
    const y = (pos / width) | 0;
    const x = pos % width;
    if (canHaveObstacle(y, x)) {
      total++;
    }
  }

  return total;
}
