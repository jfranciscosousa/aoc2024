import { assertEquals } from "@std/assert";
import { part1, part2 } from "./10.ts";

Deno.test("day10 part1", async () => {
  const part1ResultTest = await part1("./day10/test_input.txt");
  const part1Result = await part1("./day10/input.txt");

  assertEquals(part1ResultTest, 36);
  assertEquals(part1Result, 822);
});

Deno.test("day10 part2", async () => {
  const part2ResultTest = await part2("./day10/test_input.txt");
  const part2Result = await part2("./day10/input.txt");

  assertEquals(part2ResultTest, 81);
  assertEquals(part2Result, 1801);
});
