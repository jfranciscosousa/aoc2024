function isLevelSafe(level: number[]) {
  let order: "asc" | "desc";

  return !level.find((value, index) => {
    const prev = level[index - 1];

    if (!prev) return false;

    const newOrder = value > prev ? "asc" : ("desc" as const);

    if (!order) order = newOrder;
    else if (newOrder !== order) return true;

    const diff = Math.abs(value - prev);

    if (diff <= 0 || diff > 3) return true;
  });
}

export async function part1(inputPath: string): Promise<number> {
  const input = await Deno.readTextFile(inputPath);
  const levels = input.split("\n").map((line) => line.split(" ").map(Number));
  const safeLevels = levels.filter(isLevelSafe);

  return safeLevels.length;
}

function isLevelSafeWithDampener(level: number[]) {
  if (isLevelSafe(level)) return true;

  let indexToRemove = 0;
  let safe = false;

  while (indexToRemove < level.length && !safe) {
    const levelDup = [...level];

    levelDup.splice(indexToRemove, 1);
    safe = isLevelSafe(levelDup);
    indexToRemove++;
  }

  return safe;
}

export async function part2(inputPath: string): Promise<number> {
  const input = await Deno.readTextFile(inputPath);
  const levels = input.split("\n").map((line) => line.split(" ").map(Number));
  const safeLevels = levels.filter(isLevelSafeWithDampener);

  return safeLevels.length;
}
