import { assertEquals } from "@std/assert";
import { part1, part2 } from "./11.ts";

Deno.test("day11 part1", async () => {
  const part1ResultTest = await part1("./day11/test_input.txt");
  const part1Result = await part1("./day11/input.txt");

  assertEquals(part1ResultTest, 55312n);
  assertEquals(part1Result, 186424n);
});

Deno.test("day11 part2", async () => {
  const part2ResultTest = await part2("./day11/test_input.txt");
  const part2Result = await part2("./day11/input.txt");

  assertEquals(part2ResultTest, 65601038650482n);
  assertEquals(part2Result, 219838428124832n);
});
