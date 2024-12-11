import { readInputMatrix } from "../utils/files.ts";
import { Matrix } from "../utils/matrix.ts";

const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

class TopograhicMap {
  private map: Matrix<number>;
  private trailheads: { score: number; rating: number }[];

  constructor(map: Matrix<number>) {
    this.map = map;
    this.trailheads = this.findTrailheads();
  }

  private isEvenGradualSlope(
    prevY: number,
    prevX: number,
    nextY: number,
    nextX: number
  ): boolean {
    const { height, width } = this.map;

    // Check bounds
    if (nextY < 0 || nextX < 0 || nextY >= height || nextX >= width) {
      return false;
    }

    return this.map.get(prevY, prevX) - this.map.get(nextY, nextX) === -1;
  }

  private dfs(startY: number, startX: number) {
    const tops = new Set<string>();
    const paths: Set<string> = new Set();
    let currentPath: string[] = [];

    const explore = (y: number, x: number): void => {
      currentPath.push(`${y},${x}`);

      if (this.map.get(y, x) === 9) {
        tops.add(`${y},${x}`);
        paths.add(currentPath.join("-"));
      }

      if (this.map.get(y, x) === 0) {
        currentPath = [];
      }

      for (const [dy, dx] of DIRECTIONS) {
        const ny = y + dy;
        const nx = x + dx;

        if (this.isEvenGradualSlope(y, x, ny, nx)) {
          explore(ny, nx);
        }
      }
    };

    explore(startY, startX);

    return { score: tops.size, rating: paths.size };
  }

  private findTrailheads() {
    const newTrailheads: { score: number; rating: number }[] = [];

    for (const [value, y, x] of this.map) {
      if (value === 0) {
        newTrailheads.push(this.dfs(y, x));
      }
    }

    return newTrailheads;
  }

  get score() {
    return this.trailheads.reduce((prev, t) => prev + t.score, 0);
  }

  get rating() {
    return this.trailheads.reduce((prev, t) => prev + t.rating, 0);
  }

  static async buildFromFile(inputPath: string) {
    const map = await readInputMatrix(inputPath, Number);

    return new TopograhicMap(map);
  }
}

export async function part1(inputPath: string) {
  const topograhicMap = await TopograhicMap.buildFromFile(inputPath);

  return topograhicMap.score;
}

export async function part2(inputPath: string) {
  const topograhicMap = await TopograhicMap.buildFromFile(inputPath);

  return topograhicMap.rating;
}
