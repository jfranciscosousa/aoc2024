import { chain, range } from "lodash";
import { readInputContent } from "../utils/files.ts";
import { Matrix } from "../utils/matrix.ts";

const SECONDS = 100;
const ROBOT_REGEX = /p=([-\d]+),([-\d]+)[ ]+v=([-\d]+),([-\d]+)/g;

type Robot = {
  startingX: number;
  startingY: number;
  velocityX: number;
  velocityY: number;
};

function matchToRobot(match: RegExpExecArray): Robot | undefined {
  if (!match) return;

  const [_, startingX, startingY, velocityX, velocityY] = match;

  return {
    startingX: Number(startingX),
    startingY: Number(startingY),
    velocityX: Number(velocityX),
    velocityY: Number(velocityY),
  };
}

function remEuclid(a: number, b: number): number {
  const r = a % Math.abs(b);

  return r >= 0 ? r : r + Math.abs(b);
}

function walkRobot(robot: Robot, matrix: Matrix<unknown>, seconds = SECONDS) {
  const positionY = remEuclid(
    robot.startingY + seconds * robot.velocityY,
    matrix.height
  );
  const positionX = remEuclid(
    robot.startingX + seconds * robot.velocityX,
    matrix.width
  );

  return [positionY, positionX];
}

function getQuadIndex(py: number, px: number, matrix: Matrix<number>) {
  const xMid = Math.floor(matrix.width / 2);
  const yMid = Math.floor(matrix.height / 2);

  if (px < xMid) {
    if (py > yMid) {
      return "bl"; // Bottom-left quadrant
    }
    if (py < yMid) {
      return "tl"; // Top-left quadrant
    }
  } else if (px > xMid) {
    if (py > yMid) {
      return "br"; // Bottom-right quadrant
    }
    if (py < yMid) {
      return "tr"; // Top-right quadrant
    }
  }

  return undefined;
}

export async function part1(inputPath: string, height: number, width: number) {
  const matrix = Matrix.fromDimensions(height, width, 0);
  const robots = chain(await readInputContent(inputPath))
    .thru((v) => Array.from(v.matchAll(ROBOT_REGEX)))
    .map(matchToRobot)
    .compact()
    .value();
  const quadrants: Record<"bl" | "tl" | "br" | "tr", number> = {
    bl: 0,
    br: 0,
    tl: 0,
    tr: 0,
  };

  robots.forEach((robot) => {
    const [y, x] = walkRobot(robot, matrix);
    const quadIndex = getQuadIndex(y, x, matrix);
    if (quadIndex) quadrants[quadIndex]++;
  });

  return Object.values(quadrants)
    .filter((v) => v > 0)
    .reduce((memo, v) => memo * v, 1);
}

function hasBigRow(matrix: string[][]): boolean {
  const targetSequence = "1".repeat(9);

  for (const row of matrix) {
    const rowString = row.join("");

    // Check if target sequence exists in the row
    if (rowString.includes(targetSequence)) {
      return true;
    }
  }

  return false;
}

export async function part2(inputPath: string, height: number, width: number) {
  const robots = chain(await readInputContent(inputPath))
    .thru((v) => Array.from(v.matchAll(ROBOT_REGEX)))
    .map(matchToRobot)
    .compact()
    .value();

  for (let t = 0; t < 100_000; t++) {
    const matrix = Matrix.fromDimensions(height, width, ".");

    robots.forEach((robot) => {
      const [y, x] = walkRobot(robot, matrix, t);

      matrix.set(y, x, "1");
    });

    // I am so fucking smart
    if (hasBigRow(matrix.data)) {
      return t;
    }
  }

  throw new Error("stupid stupid stupid");
}
