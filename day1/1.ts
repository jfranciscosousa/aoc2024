import { orderBy } from "lodash";

export async function part1(inputPath: string): Promise<number> {
  const input = await Deno.readTextFile(inputPath);
  const lines = input.split("\n");
  const pairs = lines.map((line) => {
    const regex = new RegExp(/(\d+)[ ]+(\d+)/);
    const matches = regex.exec(line);

    if (!matches) {
      console.error(line);
      throw new Error("bad_input");
    }

    return [Number(matches[1]), Number(matches[2])];
  });
  const firstPairs = orderBy(pairs.map(([a, b]) => a)).toReversed();
  const secondPairs = orderBy(pairs.map(([a, b]) => b)).toReversed();
  let differences = 0;

  while (firstPairs.length > 0) {
    const firstPair = firstPairs.pop();
    const secondPair = secondPairs.pop();

    if (!firstPair || !secondPair) throw new Error("bad pair");

    differences += Math.abs(firstPair - secondPair);
  }

  return differences;
}

function countOccurrences(numbers: number[]): Map<number, number> {
  const occurrencesMap = new Map<number, number>();

  for (const num of numbers) {
    if (occurrencesMap.has(num)) {
      occurrencesMap.set(num, occurrencesMap.get(num)! + 1);
    } else {
      occurrencesMap.set(num, 1);
    }
  }

  return occurrencesMap;
}

export async function part2(inputPath: string): Promise<number> {
  const input = await Deno.readTextFile(inputPath);
  const lines = input.split("\n");
  const pairs = lines.map((line) => {
    const regex = new RegExp(/(\d+)[ ]+(\d+)/);
    const matches = regex.exec(line);

    if (!matches) {
      console.error(line);
      throw new Error("bad_input");
    }

    return [Number(matches[1]), Number(matches[2])];
  });
  const firstPairs = pairs.map(([a, b]) => a);
  const secondPairs = pairs.map(([a, b]) => b);
  const secondOcurrences = countOccurrences(secondPairs);

  let similarityScore = 0;

  while (firstPairs.length > 0) {
    const firstPair = firstPairs.pop();

    if (!firstPair) throw new Error("bad pair");

    const ocurrences = secondOcurrences.get(firstPair) || 0;

    similarityScore += firstPair * ocurrences;
  }

  return similarityScore;
}
