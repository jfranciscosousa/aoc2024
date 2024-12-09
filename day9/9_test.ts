import { assertEquals } from "@std/assert";
import { part1, part2 } from "./9.ts";

Deno.test("day9 part1", async () => {
  const part1ResultTest = await part1("./day9/test_input.txt");
  const part1Result = await part1("./day9/input.txt");

  assertEquals(part1ResultTest, 1928);
  assertEquals(part1Result, 6360094256423);
});

Deno.test("day9 part2", async () => {
  const part2ResultTest = await part2("./day9/test_input.txt");
  const part2Result = await part2("./day9/input.txt");

  assertEquals(part2ResultTest, 2858);
  assertEquals(part2Result, 6379677752410);
});
