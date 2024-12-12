import { assertEquals } from "@std/assert";
import { part1, part2 } from "./12.ts";

Deno.test("day12 part1", async () => {
  const part1ResultTest = await part1("./day12/test_input.txt");
  const part1Result = await part1("./day12/input.txt");

  assertEquals(part1ResultTest, 1930);
  assertEquals(part1Result, 1483212);
});

Deno.test("day12 part2", async () => {
  const part2ResultTest = await part2("./day12/test_input.txt");
  const part2Result = await part2("./day12/input.txt");

  assertEquals(part2ResultTest, 1206);
  assertEquals(part2Result, 897062);
});
