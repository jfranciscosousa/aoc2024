import { assertEquals } from "@std/assert";
import { part1, part2 } from "./14.ts";

Deno.test("day14 part1", async () => {
  const part1ResultTest = await part1("./day14/test_input.txt", 7, 11);
  const part1Result = await part1("./day14/input.txt", 103, 101);

  assertEquals(part1ResultTest, 12);
  assertEquals(part1Result, 231019008);
});

Deno.test("day14 part2", async () => {
  const part2Result = await part2("./day14/input.txt", 103, 101);

  assertEquals(part2Result, 8280);
});
