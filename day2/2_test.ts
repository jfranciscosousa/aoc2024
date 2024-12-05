import { assertEquals } from "@std/assert";
import { part1, part2 } from "./2.ts";

Deno.test("day2 part1", async () => {
  const part1ResultTest = await part1("./day2/test_input.txt");
  const part1Result = await part1("./day2/input.txt");

  console.log("Result of part1: ", part1Result);

  assertEquals(part1ResultTest, 2);
  assertEquals(part1Result, 218);
});

Deno.test("day2 part2", async () => {
  const part2ResultTest = await part2("./day2/test_input.txt");
  const part2Result = await part2("./day2/input.txt");

  console.log("Result of part2: ", part2Result);

  assertEquals(part2ResultTest, 4);
  assertEquals(part2Result, 290);
});
