const REGEX = /(\d+):([\d ]+)/;

type Operator = "+" | "*" | "||";

function generateOperationPermutations(
  arr: number[],
  useConcatenationOperator = false
): (number | Operator)[][] {
  if (arr.length < 2) return [arr];

  const operators: Operator[] = ["+", "*"];
  if (useConcatenationOperator) operators.push("||");
  const results: (number | Operator)[][] = [];

  function backtrack(
    current: (number | Operator)[],
    index: number,
    depth = 0
  ) {
    if (depth === arr.length - 1) {
      results.push(current);
      return;
    }

    for (const operator of operators) {
      const nextCurrent = current.length === 0
        ? [arr[0], operator, arr[1]]
        : [...current, operator, arr[index + 1]];

      backtrack(nextCurrent, index + 1, depth + 1);
    }
  }

  backtrack([], 0);

  return results;
}

function applyOperation(
  current: number,
  operator: Operator | undefined,
  token: number
): number {
  switch (operator) {
    case "||":
      return Number(`${current}${token}`);
    case "+":
      return current + token;
    case "*":
      return current * token;
    default:
      return token;
  }
}

async function calculate(
  inputPath: string,
  useConcatenationOperator = false
): Promise<number> {
  const fileContent = await Deno.readTextFile(inputPath);

  return fileContent
    .trim()
    .split("\n")
    .reduce((total, line) => {
      const match = line.trim().match(REGEX);
      if (!match) throw new Error("Invalid input format");

      const [_, testValueUnparsed, numbersUnparsed] = match;
      const testValue = Number(testValueUnparsed);
      const numbers = numbersUnparsed.trim().split(" ").map(Number);

      const operations = generateOperationPermutations(
        numbers,
        useConcatenationOperator
      );

      const isMatch = operations.some(operation => {
        let total = 0;
        let currentOperator: Operator | undefined;

        for (const token of operation) {
          if (typeof token === 'string') {
            currentOperator = token as Operator;
          } else {
            total = applyOperation(total, currentOperator, token);
          }
        }

        return total === testValue;
      });

      return isMatch ? total + testValue : total;
    }, 0);
}

export function part1(inputPath: string): Promise<number> {
  return calculate(inputPath);
}

export function part2(inputPath: string): Promise<number> {
  return calculate(inputPath, true);
}