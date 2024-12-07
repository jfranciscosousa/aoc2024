const GUARD_CHAR = "^";
const OBSTACLE_CHAR = "#";
const REGULAR_CHAR = ".";

const directions = ["UP", "RIGHT", "DOWN", "LEFT"] as const;
const directionsToDistance = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1],
};

const turnRight = (d: number) => (d + 1) % 4;

async function processMap(inputPath: string) {
  const input = await Deno.readTextFile(inputPath);
  const matrix = input.split("\n").map((line) => line.split(""));
  let guard: [number, number] | undefined = undefined;

  for (let y = 0; y < matrix.length && !guard; y++) {
    for (let x = 0; x < matrix[y].length && !guard; x++) {
      if (matrix[y][x] === GUARD_CHAR) guard = [y, x];
    }
  }

  if (!guard) throw new Error("where_is_the_guard????");

  let direction = 0;
  let y = guard[0];
  let x = guard[1];
  const visitedPositions = new Set<string>();
  visitedPositions.add(`${y},${x}`);

  while (true) {
    const delta = directionsToDistance[directions[direction]];
    y += delta[0];
    x += delta[1];

    const current = matrix[y]?.[x];

    if (!current) break;

    if (current === REGULAR_CHAR || current === GUARD_CHAR) {
      visitedPositions.add(`${y},${x}`);
    } else {
      y -= delta[0];
      x -= delta[1];

      direction = turnRight(direction);
    }
  }

  return { matrix, guard, visitedPositions };
}

export async function part1(inputPath: string): Promise<number> {
  const { visitedPositions } = await processMap(inputPath);

  return visitedPositions.size;
}

function hash(y: number, x: number, direction: number, width: number): number {
  return ((y * width + x) << 2) | direction;
}

export async function part2(inputPath: string): Promise<number> {
  const { matrix, guard, visitedPositions } = await processMap(inputPath);

  function canHaveObstacle(oy: number, ox: number) {
    if (matrix[oy][ox] === OBSTACLE_CHAR) return false;

    matrix[oy][ox] = OBSTACLE_CHAR;
    let y = guard[0];
    let x = guard[1];
    let direction = 0;
    const visited = new Set();

    while (true) {
      const stringifiedPos = hash(y, x, direction, matrix[0].length);

      if (visited.has(stringifiedPos)) {
        matrix[oy][ox] = REGULAR_CHAR;
        return true;
      }

      visited.add(stringifiedPos);

      const [deltay, deltax] = directionsToDistance[directions[direction]];
      const nexty = y + deltay;
      const nextx = x + deltax;

      if (!matrix[nexty]?.[nextx]) {
        matrix[oy][ox] = REGULAR_CHAR;
        break;
      }

      if (matrix[nexty][nextx] === OBSTACLE_CHAR) {
        direction = turnRight(direction);
      } else {
        y = nexty;
        x = nextx;
      }
    }
  }

  const total = visitedPositions.values().reduce((memo, pos) => {
    const [y, x] = pos.split(",").map(Number);

    if (canHaveObstacle(y, x)) {
      memo++;
    }

    return memo;
  }, 0);

  return total;
}
