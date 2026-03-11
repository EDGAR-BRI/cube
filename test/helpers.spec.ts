import { SPEFFZ } from "../src/letterSchemes";
import {
  computeLetterSchemeMap,
  flipTargetEdgeLetter,
  resolveTargetFlipEdgeIds,
} from "../src/helpers";

describe("cube helpers", () => {
  test("resolveTargetFlipEdgeIds", () => {
    expect(resolveTargetFlipEdgeIds([3, 1])).toEqual([2, 3]); // UL/UB ids
    expect(resolveTargetFlipEdgeIds([2, 1])).toEqual([2, 3]); // direct id + scheme index
    expect(resolveTargetFlipEdgeIds([3])).toBeNull();
    expect(resolveTargetFlipEdgeIds([99, 1])).toBeNull();
  });

  test("flipTargetEdgeLetter", () => {
    const edgeMap = computeLetterSchemeMap(SPEFFZ, "edge");
    expect(
      flipTargetEdgeLetter({
        currentLetter: "U",
        targetLetter: "D",
        targetFlipEdgeIds: [2, 3],
        letterSchemeMap: edgeMap,
      }),
    ).toBe("A");
    expect(
      flipTargetEdgeLetter({
        currentLetter: "U",
        targetLetter: "J",
        targetFlipEdgeIds: [2, 3],
        letterSchemeMap: edgeMap,
      }),
    ).toBe("J");
    expect(
      flipTargetEdgeLetter({
        currentLetter: "A",
        targetLetter: "D",
        targetFlipEdgeIds: [2, 3],
        letterSchemeMap: edgeMap,
      }),
    ).toBe("D");
  });

  test("computeLetterSchemeMap", () => {
    expect(computeLetterSchemeMap(SPEFFZ, "edge")).toEqual({
      A: {
        id: 3,
        orientation: 0,
      },
      B: {
        id: 0,
        orientation: 0,
      },
      C: {
        id: 1,
        orientation: 0,
      },
      D: {
        id: 2,
        orientation: 0,
      },
      E: {
        id: 2,
        orientation: 1,
      },
      F: {
        id: 9,
        orientation: 1,
      },
      G: {
        id: 6,
        orientation: 1,
      },
      H: {
        id: 10,
        orientation: 1,
      },
      I: {
        id: 1,
        orientation: 1,
      },
      J: {
        id: 8,
        orientation: 0,
      },
      K: {
        id: 5,
        orientation: 1,
      },
      L: {
        id: 9,
        orientation: 0,
      },
      M: {
        id: 0,
        orientation: 1,
      },
      N: {
        id: 11,
        orientation: 1,
      },
      O: {
        id: 4,
        orientation: 1,
      },
      P: {
        id: 8,
        orientation: 1,
      },
      Q: {
        id: 3,
        orientation: 1,
      },
      R: {
        id: 10,
        orientation: 0,
      },
      S: {
        id: 7,
        orientation: 1,
      },
      T: {
        id: 11,
        orientation: 0,
      },
      U: {
        id: 5,
        orientation: 0,
      },
      V: {
        id: 4,
        orientation: 0,
      },
      W: {
        id: 7,
        orientation: 0,
      },
      X: {
        id: 6,
        orientation: 0,
      },
    });
    expect(computeLetterSchemeMap(SPEFFZ, "corner")).toEqual({
      A: {
        id: 2,
        orientation: 0,
      },
      B: {
        id: 3,
        orientation: 0,
      },
      D: {
        id: 1,
        orientation: 0,
      },
      C: {
        id: 0,
        orientation: 0,
      },
      E: {
        id: 2,
        orientation: 1,
      },
      F: {
        id: 1,
        orientation: 2,
      },
      H: {
        id: 6,
        orientation: 2,
      },
      G: {
        id: 5,
        orientation: 1,
      },
      I: {
        id: 1,
        orientation: 1,
      },
      J: {
        id: 0,
        orientation: 2,
      },
      L: {
        id: 5,
        orientation: 2,
      },
      K: {
        id: 4,
        orientation: 1,
      },
      M: {
        id: 0,
        orientation: 1,
      },
      N: {
        id: 3,
        orientation: 2,
      },
      P: {
        id: 4,
        orientation: 2,
      },
      O: {
        id: 7,
        orientation: 1,
      },
      Q: {
        id: 3,
        orientation: 1,
      },
      R: {
        id: 2,
        orientation: 2,
      },
      T: {
        id: 7,
        orientation: 2,
      },
      S: {
        id: 6,
        orientation: 1,
      },
      U: {
        id: 5,
        orientation: 0,
      },
      V: {
        id: 4,
        orientation: 0,
      },
      X: {
        id: 6,
        orientation: 0,
      },
      W: {
        id: 7,
        orientation: 0,
      },
    });
  });
});
