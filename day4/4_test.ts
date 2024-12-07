import { assertEquals } from "@std/assert";
import { part1, part2 } from "./4.ts";

Deno.test("day4 part1", async () => {
  const part1ResultTest = await part1("./day4/test_input.txt");
  const part1Result = await part1("./day4/input.txt");

  assertEquals(part1ResultTest, 18);
  assertEquals(part1Result, 2534);
});

Deno.test("day4 part2", async () => {
  const part2ResultTest = await part2("./day4/test_input.txt");
  const part2Result = await part2("./day4/input.txt");

  assertEquals(part2ResultTest, 9);
  assertEquals(part2Result, 1866);
});
