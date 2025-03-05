import { assertEquals } from "jsr:@std/assert";

import { normalize } from "./engine/lib/Vector.ts";

Deno.bench("a", () => {
  for (let i = 0; i < 1000; i++) {
    normalize({ x: 1, y: 1 });
  }
});

// Deno.bench("b", () => {
//   for (let i = 0; i < 1000; i++) {
//     normalizeFast({ x: 1, y: 1 });
//   }
// });

Deno.test("test", () => {
  const vector = { x: 2, y: 3 };

  assertEquals(normalize(vector), normalizeFast(vector));
});
