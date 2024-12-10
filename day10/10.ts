const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

class TopograhicMap {
  private map: number[][];
  private trailheads: { score: number; rating: number }[];

  constructor(map: number[][]) {
    this.map = map;
    this.trailheads = this.findTrailheads();
  }

  private isEvenGradualSlope(
    prevY: number,
    prevX: number,
    nextY: number,
    nextX: number
  ): boolean {
    const height = this.map.length;
    const width = this.map[0].length;

    // Check bounds
    if (nextY < 0 || nextX < 0 || nextY >= height || nextX >= width) {
      return false;
    }

    return this.map[prevY][prevX] - this.map[nextY][nextX] === -1;
  }

  private dfs(startY: number, startX: number) {
    const tops = new Set<string>();
    const paths: Set<string> = new Set();
    let currentPath: string[] = [];

    const explore = (y: number, x: number): void => {
      currentPath.push(`${y},${x}`);

      if (this.map[y][x] === 9) {
        tops.add(`${y},${x}`);
        paths.add(currentPath.join("-"));
      }

      if (this.map[y][x] === 0) {
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

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === 0) {
          newTrailheads.push(this.dfs(y, x));
        }
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
    const map = (await Deno.readTextFile(inputPath))
      .trim()
      .split("\n")
      .map((l) => l.split("").map(Number));

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
