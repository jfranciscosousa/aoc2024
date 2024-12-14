import { chain } from "lodash";
// @deno-types="npm:@types/big.js@^6.2.2"
import Big from "npm:big.js";
import { readInputContent } from "../utils/files.ts";

const MACHINE_REGEX =
  /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g;

type Machine = {
  buttonA: [number, number];
  buttonB: [number, number];
  prize: [number, number];
};

function matchToMachine(match: RegExpExecArray): Machine | undefined {
  if (!match) return;

  const [_, machineAX, machineAY, machineBX, machineBY, prizeX, prizeY] = match;

  return {
    buttonA: [machineAX, machineAY].map(Number) as [number, number],
    buttonB: [machineBX, machineBY].map(Number) as [number, number],
    prize: [prizeX, prizeY].map(Number) as [number, number],
  };
}

function isWholeNumber(num: Big, precision: Big = new Big(1e-10)): boolean {
  // Round to the specified precision
  const roundedNum = num.div(precision).round().times(precision);

  // Check if the absolute difference from the integer is within the precision
  return roundedNum.minus(roundedNum.round()).abs().lt(precision.div(2));
}

function solveLargeNumberMatrix(
  A: [[number, number], [number, number]],
  B: [number, number]
): [Big, Big] {
  // Convert inputs to Big.js
  const matrix = [
    [new Big(A[0][0]), new Big(A[0][1])],
    [new Big(A[1][0]), new Big(A[1][1])],
  ];

  const vector = [new Big(B[0]), new Big(B[1])];

  // Calculate determinant
  const det = matrix[0][0]
    .times(matrix[1][1])
    .minus(matrix[0][1].times(matrix[1][0]));

  // Solve using Cramer's rule
  const x = vector[0]
    .times(matrix[1][1])
    .minus(vector[1].times(matrix[0][1]))
    .div(det);
  const y = matrix[0][0]
    .times(vector[1])
    .minus(matrix[1][0].times(vector[0]))
    .div(det);

  return [x, y];
}

/**
 *
 * Converted the problem to a system of linear equations.
 *
 * If the solution is "whole" (or close to it because fuck Javascript)
 * the system is "possible".
 */
function solveMachine(machine: Machine) {
  const A: [[number, number], [number, number]] = [
    [machine.buttonA[0], machine.buttonB[0]],
    [machine.buttonA[1], machine.buttonB[1]],
  ];
  const B: [number, number] = [machine.prize[0], machine.prize[1]];

  const solution = solveLargeNumberMatrix(A, B);
  const result = solution[0].mul(3).add(solution[1]);

  // if some of the matrix solutions are not whole return 0!!
  if (solution.some((b: Big) => !isWholeNumber(b))) return 0;

  return result.round().toNumber();
}

export async function part1(inputPath: string) {
  return chain(await readInputContent(inputPath))
    .thru((v) => Array.from(v.matchAll(MACHINE_REGEX)))
    .map(matchToMachine)
    .compact()
    .map(solveMachine)
    .sum()
    .value();
}

function incrementMachine(machine: Machine): Machine {
  return {
    ...machine,
    prize: [
      machine.prize[0] + 10000000000000,
      machine.prize[1] + 10000000000000,
    ],
  };
}

export async function part2(inputPath: string) {
  return chain(await readInputContent(inputPath))
    .thru((v) => Array.from(v.matchAll(MACHINE_REGEX)))
    .map(matchToMachine)
    .compact()
    .map(incrementMachine)
    .map(solveMachine)
    .sum()
    .value();
}
