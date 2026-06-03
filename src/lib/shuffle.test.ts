import { describe, expect, it } from "vitest";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("returns a new array without mutating the input", () => {
    const input = [1, 2, 3, 4];
    const out = shuffle(input, () => 0);
    expect(input).toEqual([1, 2, 3, 4]);
    expect(out).not.toBe(input);
  });

  it("preserves all elements (is a permutation)", () => {
    const input = ["a", "b", "c", "d", "e"];
    const out = shuffle(input, makeSeqRng([0.1, 0.9, 0.4, 0.7]));
    expect([...out].sort()).toEqual([...input].sort());
    expect(out).toHaveLength(input.length);
  });

  it("is deterministic for a fixed rng", () => {
    const rng1 = makeSeqRng([0.2, 0.8, 0.5]);
    const rng2 = makeSeqRng([0.2, 0.8, 0.5]);
    expect(shuffle([1, 2, 3, 4], rng1)).toEqual(shuffle([1, 2, 3, 4], rng2));
  });
});

function makeSeqRng(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}
