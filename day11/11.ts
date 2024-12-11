function blink(data: number[], limit = 25): number[] {
  for (let iteration = 0; iteration < limit; iteration++) {
    const newData: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const datum = data[i];

      if (datum === 0) {
        // If datum is zero, push 1
        newData.push(1);
      } else {
        // Compute digit count using log10
        // digitCount = floor(log10(datum)) + 1
        const digitCount = Math.floor(Math.log10(datum)) + 1;

        if ((digitCount & 1) === 0) {
          // Even number of digits
          const halfDigits = digitCount >> 1; // digitCount/2
          const divisor = Math.pow(10, halfDigits);
          const partOne = Math.floor(datum / divisor);
          const partTwo = datum % divisor;
          newData.push(partOne, partTwo);
        } else {
          // Odd number of digits
          newData.push(datum * 2024);
        }
      }
    }
    data = newData;
  }
  return data;
}

export async function part1(inputPath: string) {
  const input = (await Deno.readTextFile(inputPath)).trim().split(" ").map(Number);
  return blink(input).length;
}

export async function part2(inputPath: string) {
  const input = (await Deno.readTextFile(inputPath)).trim().split(" ").map(Number);
  return blink(input, 75).length;
}
 