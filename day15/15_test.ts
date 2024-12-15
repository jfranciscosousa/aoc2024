import { assertEquals } from "@std/assert";
import { part1, part2 } from "./15.ts";

Deno.test("day15 part1", async () => {
  const part1ResultTest = await part1("./day15/test_input.txt");
  const part1Result = await part1("./day15/input.txt");

  assertEquals(part1ResultTest, 10092);
  assertEquals(part1Result, 1465523);
});

Deno.test("day15 part2", async () => {
  const part2ResultTest = await part2("./day15/test_input.txt");
  const part2Result = await part2("./day15/input.txt");

  assertEquals(part2ResultTest, 9021);
  assertEquals(part2Result, 1471049);
});
