import { assertEquals } from "@std/assert";
import { part1, part2 } from "./8.ts";

Deno.test("day8 part1", async () => {
  const part1ResultTest = await part1("./day8/test_input.txt");
  const part1Result = await part1("./day8/input.txt");

  assertEquals(part1ResultTest, 14);
  assertEquals(part1Result, 359);
});

Deno.test("day8 part2", async () => {
  const part2ResultTest = await part2("./day8/test_input.txt");
  const part2Result = await part2("./day8/input.txt");

  assertEquals(part2ResultTest, 34);
  assertEquals(part2Result, 1293);
});
