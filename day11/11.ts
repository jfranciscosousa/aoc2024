import { readInputContent } from "../utils/files.ts";
import { Multiset } from "../utils/multiset.ts";

function blink(data: Multiset<number>, limit = 25): Multiset<number> {
  for (let iteration = 0; iteration < limit; iteration++) {
    const newData = new Multiset<number>();

    // Iterate over the multiset
    for (const [datum, count] of data) {
      if (datum === 0) {
        // If datum is zero, push 1
        newData.add(1, count);
      } else {
        // Compute digit count using log10
        const digitCount = Math.floor(Math.log10(datum)) + 1;

        if ((digitCount & 1) === 0) {
          // Even number of digits
          const halfDigits = digitCount >> 1; // digitCount/2
          const divisor = 10 ** halfDigits;

          const partOne = Math.floor(datum / divisor);
          const partTwo = datum % divisor;

          newData.add(partOne, count);
          newData.add(partTwo, count);
        } else {
          // Odd number of digits
          newData.add(datum * 2024, count);
        }
      }
    }

    data = newData;
  }
  return data;
}

function prepareInput(inputPath: string): Promise<Multiset<number>> {
  return readInputContent(inputPath)
    .then((i) => i.split(" "))
    .then((i) => i.map(Number))
    .then((i) => Multiset.fromArray(i));
}

export function part1(inputPath: string) {
  return prepareInput(inputPath)
    .then((i) => blink(i))
    .then((i) => i.size());
}

export function part2(inputPath: string) {
  return prepareInput(inputPath)
    .then((i) => blink(i, 75))
    .then((i) => i.size());
}
