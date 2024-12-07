const REGEX = /(\d+):([\d ]+)/;

type Operator = "+" | "*" | "||";

// Inline operation to avoid overhead of an extra function call
function applyOp(current: number, operator: Operator, token: number): number {
  switch (operator) {
    case "||": {
      // Numeric concatenation which is faster than a string concatenation
      const digits = token === 0 ? 1 : Math.floor(Math.log10(token)) + 1;
      return current * 10 ** digits + token;
    }
    case "+":
      return current + token;
    case "*":
      return current * token;
  }
}

// This function tries all operator combinations on the fly and returns true as soon as a match is found
function checkIfMatch(
  arr: number[],
  testValue: number,
  operators: Operator[],
  currentIndex: number,
  currentTotal: number,
  currentOperator: Operator | null
): boolean {
  // If we've placed operators between all numbers
  if (currentIndex === arr.length) {
    // Reached the end, check if total matches
    return currentTotal === testValue;
  }

  // Try all operators for arr[currentIndex]
  for (const op of operators) {
    // Apply the next number with this operator
    const newTotal =
      currentOperator === null
        ? arr[currentIndex] // First number, no operation
        : applyOp(currentTotal, currentOperator, arr[currentIndex]);

    // If match found downstream, short-circuit
    if (
      checkIfMatch(arr, testValue, operators, currentIndex + 1, newTotal, op)
    ) {
      return true;
    }
  }

  return false;
}

async function calculate(
  inputPath: string,
  useConcatenationOperator = false
): Promise<number> {
  const fileContent = await Deno.readTextFile(inputPath);
  const lines = fileContent.trim().split("\n");

  const baseOps: Operator[] = ["+", "*"];
  const operators = useConcatenationOperator
    ? [...baseOps, "||" as const]
    : baseOps;

  let finalTotal = 0;

  for (const line of lines) {
    const match = line.match(REGEX);
    if (!match) throw new Error("Invalid input format");

    const testValue = Number(match[1]);
    const numbers = match[2].split(" ").map(Number);

    // Check if any permutation can produce testValue
    // Start with the first number already applied, so currentOperator = null
    if (checkIfMatch(numbers, testValue, operators, 1, numbers[0], null)) {
      finalTotal += testValue;
    }
  }

  return finalTotal;
}

export function part1(inputPath: string): Promise<number> {
  return calculate(inputPath);
}

export function part2(inputPath: string): Promise<number> {
  return calculate(inputPath, true);
}
