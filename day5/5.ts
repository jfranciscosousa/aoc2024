import { compact } from "lodash";

const ORDERING_RULE_REGEX = /(\d+)\|(\d+)/;
const UPDATE_REGEX = /[0-9]+(,[0-9]+)+/;

function isValidUpdate(
  update: number[],
  orderingRules: Map<number, Set<number>>
) {
  return update.every((value, index) => {
    const restBackwards = update.slice(0, index);
    const restForward = update.slice(index + 1);
    const rule = orderingRules.get(value);

    if (!rule) return true;

    return (
      restBackwards.every((restValue) => !rule.has(restValue)) &&
      restForward.every((restValue) => rule.has(restValue))
    );
  });
}

async function getRulesAndUpdates(inputPath: string) {
  const orderingRules = new Map<number, Set<number>>();
  const updates: number[][] = [];
  const input = await Deno.readTextFile(inputPath);
  input.split("\n").forEach((line) => {
    const orderingMatch = line.match(ORDERING_RULE_REGEX);
    const updateMatch = line.match(UPDATE_REGEX);

    if (orderingMatch) {
      const existingRules = orderingRules.get(Number(orderingMatch[1]));

      if (existingRules) {
        orderingRules.set(
          Number(orderingMatch[1]),
          existingRules.add(Number(orderingMatch[2]))
        );
      } else {
        orderingRules.set(
          Number(orderingMatch[1]),
          new Set([Number(orderingMatch[2])])
        );
      }
    } else if (updateMatch) {
      updates.push(line.split(",").map(Number));
    }
  });

  const validUpdates = updates.filter((update) =>
    isValidUpdate(update, orderingRules)
  );
  const invalidUpdates = updates.filter(
    (update) => !isValidUpdate(update, orderingRules)
  );

  return { orderingRules, updates, validUpdates, invalidUpdates };
}

function calculateScore(updates: number[][]): number {
  return updates.reduce((memo, update) => {
    const middle = Math.floor(update.length / 2);

    return memo + update[middle];
  }, 0);
}

export async function part1(inputPath: string): Promise<number> {
  const { validUpdates } = await getRulesAndUpdates(inputPath);

  return calculateScore(validUpdates);
}

export async function part2(inputPath: string): Promise<number> {
  const { orderingRules, invalidUpdates } = await getRulesAndUpdates(inputPath);

  const sortedUpdates = invalidUpdates.map((update) =>
    update.toSorted((a, b) => {
      if (a === b) return 0;

      const aRules = orderingRules.get(a);
      const bRules = orderingRules.get(b);

      if (aRules?.has(b)) return -1;
      if (bRules?.has(a)) return 1;

      return 0;
    })
  );

  return calculateScore(sortedUpdates);
}
