import { assertEquals } from "@std/assert";
import { part1, part2 } from "./3.ts";

Deno.test("day3 part1", async () => {
  const part1ResultTest = await part1("./day3/test_input.txt");
  const part1Result = await part1("./day3/input.txt");

  assertEquals(part1ResultTest, 161);
  assertEquals(part1Result, 169021493);
});

Deno.test("day3 part2", async () => {
  const part2ResultTest = await part2("./day3/test_input.txt");
  const part2Result = await part2("./day3/input.txt");

  assertEquals(part2ResultTest, 48);
  assertEquals(part2Result, 111762583);
});
