import { assertEquals } from "@std/assert";
import { part1, part2 } from "./13.ts";

Deno.test("day13 part1", async () => {
  const part1ResultTest = await part1("./day13/test_input.txt");
  const part1Result = await part1("./day13/input.txt");

  assertEquals(part1ResultTest, 480);
  assertEquals(part1Result, 25629);
});

Deno.test("day13 part2", async () => {
  const part2ResultTest = await part2("./day13/test_input.txt");
  const part2Result = await part2("./day13/input.txt");

  assertEquals(part2ResultTest, 875318608908);
  assertEquals(part2Result, 107487112929999);
});
