const MUL_REGEX = /mul\((\d{1,3}),(\d{1,3})\)/g;
const MUL_REGEX_DO_OR_DONT = /(mul\((\d{1,3}),(\d{1,3})\))|(do|don't)\(\)/g;

export async function part1(inputPath: string): Promise<number> {
  const input = await Deno.readTextFile(inputPath);
  const matches = input.matchAll(MUL_REGEX);
  const total = matches.reduce(
    (memo, match) => (memo += Number(match[1]) * Number(match[2])),
    0
  );

  return total;
}

export async function part2(inputPath: string): Promise<number> {
  const input = await Deno.readTextFile(inputPath);
  const matches = input.matchAll(MUL_REGEX_DO_OR_DONT);
  let lastInstruction: "do" | "don't" | undefined = undefined;
  const total = matches.reduce((memo, match) => {
    lastInstruction =
      match[4] === "do" || match[4] === "don't" ? match[4] : lastInstruction;

    if (lastInstruction === "don't") return memo;

    if (match[0].startsWith("mul")) {
      return (memo += Number(match[2]) * Number(match[3]));
    }

    return memo;
  }, 0);

  return total;
}
