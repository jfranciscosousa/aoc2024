import { assertEquals } from "@std/assert";
import { part1, part2 } from "./6.ts";

Deno.test("day6 part1", async () => {
  const part1ResultTest = await part1("./day6/test_input.txt");
  const part1Result = await part1("./day6/input.txt");

  assertEquals(part1ResultTest, 41);
  assertEquals(part1Result, 4722);
});

Deno.test("day6 part2", async () => {
  const part2ResultTest = await part2("./day6/test_input.txt");
  const part2Result = await part2("./day6/input.txt");

  assertEquals(part2ResultTest, 6);
  assertEquals(part2Result, 1602);
});
