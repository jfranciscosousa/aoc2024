import { assertEquals } from "@std/assert";
import { part1, part2 } from "./5.ts";

Deno.test("day5 part1", async () => {
  const part1ResultTest = await part1("./day5/test_input.txt");
  const part1Result = await part1("./day5/input.txt");

  assertEquals(part1ResultTest, 143);
  assertEquals(part1Result, 5651);
});

Deno.test("day5 part2", async () => {
  const part2ResultTest = await part2("./day5/test_input.txt");
  const part2Result = await part2("./day5/input.txt");

  assertEquals(part2ResultTest, 123);
  assertEquals(part2Result, 4743);
});
