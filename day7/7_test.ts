import { assertEquals } from "@std/assert";
import { part1, part2 } from "./7.ts";

Deno.test("day7 part1", async () => {
  const part1ResultTest = await part1("./day7/test_input.txt");
  const part1Result = await part1("./day7/input.txt");

  assertEquals(part1ResultTest, 3749);
  assertEquals(part1Result, 4555081946288);
});

Deno.test("day7 part2", async () => {
  const part2ResultTest = await part2("./day7/test_input.txt");
  const part2Result = await part2("./day7/input.txt");

  assertEquals(part2ResultTest, 11387);
  assertEquals(part2Result, 227921760109726);
});
