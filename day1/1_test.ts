import { assertEquals } from "@std/assert";
import { part1, part2 } from "./1.ts";

Deno.test("day1 part1", async () => {
  const part1ResultTest = await part1("./day1/test_input.txt");
  const part1Result = await part1("./day1/input.txt");

  console.log("Result of part1: ", part1Result);

  assertEquals(part1ResultTest, 11);
  assertEquals(part1Result, 2375403);
});

Deno.test("day1 part2", async () => {
  const part2ResultTest = await part2("./day1/test_input.txt");
  const part2Result = await part2("./day1/input.txt");

  console.log("Result of part2: ", part2Result);

  assertEquals(part2ResultTest, 31);
  assertEquals(part2Result, 23082277);
});
