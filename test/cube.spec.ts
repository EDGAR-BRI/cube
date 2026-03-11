import { CHS, SPEFCZ } from "../src/letterSchemes";
import { Cube, type CubeState } from "../src/cube";

const state: CubeState = {
  center: [2, 1, 0, 3, 4, 5],
  cp: [1, 0, 2, 3, 4, 5, 6, 7],
  co: [0, 1, 0, 0, 0, 0, 0, 0],
  ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const identityState: CubeState = {
  center: [0, 1, 2, 3, 4, 5],
  cp: [0, 1, 2, 3, 4, 5, 6, 7],
  co: [0, 0, 0, 0, 0, 0, 0, 0],
  ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const identityCube = new Cube();
const scrambledCube = new Cube(state);

const solvedCubeString =
  "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";
const sexyMove = "R U R' U'";

const alg = "f R U R' U' f' R2 U2";
const algNumeric = [42, 3, 0, 5, 2, 44, 4, 1];
const inverse = "U2 R2 f U R U' R' f'";
const inverseNumeric = [1, 4, 42, 0, 3, 2, 5, 44];

describe("Cube", () => {
  test("move", () => {
    expect(new Cube(identityCube).move("U").toString()).toBe(
      "UUUUUUUUUBBBRRRRRRRRRFFFFFFDDDDDDDDDFFFLLLLLLLLLBBBBBB",
    );
    // t perm
    const tPerm = new Cube(identityCube).move(
      "R U R' U' R' F R2 U' R' U' R U R' F'",
    );
    expect(tPerm.toString()).toBe(
      "UUUUUUUUUBLFRRRRRRFFRFFFFFFDDDDDDDDDLRLLLLLLLRBBBBBBBB",
    );
    expect(
      tPerm.move("S' R U R' U' R' F R2 U' R' U' R U R' F' U2 S U2").toString(),
    ).toBe(solvedCubeString);

    const sexyPrime = new Cube(identityCube)
      .move(sexyMove)
      .move(sexyMove)
      .move(sexyMove)
      .move(sexyMove)
      .move(sexyMove)
      .move(sexyMove);
    expect(sexyPrime.toString()).toBe(solvedCubeString);
    const upsideDown = new Cube(identityCube).move("x2");
    expect(upsideDown.toString()).toBe(
      "DDDDDDDDDRRRRRRRRRBBBBBBBBBUUUUUUUUULLLLLLLLLFFFFFFFFF",
    );
    const rotatedCube = new Cube(identityCube).move(
      "r f l u d b x y z x2 y2 z2 x y z b' d' u' l' f' r'",
    );
    // x' z' y' not implemented but x' = x2 x etc
    expect(rotatedCube.toString()).toBe(solvedCubeString);
  });

  describe("3bld solver", () => {
    test("nextCornerLetter", () => {
      expect(identityCube.nextCornerLetter({ corner: "E", buffer: "E" })).toBe(
        "",
      );
      const cube = new Cube(identityCube).move("B'");
      let visitedCorners: Set<number> = new Set();
      expect(
        cube.nextCornerLetter({ corner: "E", buffer: "E", visitedCorners }),
      ).toBe("X");
      expect(Array.from(visitedCorners)).toEqual([2]);
      expect(
        cube.nextCornerLetter({ corner: "X", buffer: "E", visitedCorners }),
      ).toBe("O");
      expect(Array.from(visitedCorners)).toEqual([2, 6]);
      expect(
        cube.nextCornerLetter({ corner: "O", buffer: "E", visitedCorners }),
      ).toBe("B");
      expect(Array.from(visitedCorners)).toEqual([2, 6, 7]);
      expect(
        cube.nextCornerLetter({ corner: "B", buffer: "E", visitedCorners }),
      ).toBe("");
      const cube2 = new Cube(identityCube).move("F");
      visitedCorners = new Set();
      expect(
        cube2.nextCornerLetter({ corner: "E", buffer: "E", visitedCorners }),
      ).toBe("C");
      expect(
        cube2.nextCornerLetter({ corner: "C", buffer: "E", visitedCorners }),
      ).toBe("F");
      expect(
        cube2.nextCornerLetter({ corner: "F", buffer: "E", visitedCorners }),
      ).toBe("U");
      expect(
        cube2.nextCornerLetter({ corner: "U", buffer: "E", visitedCorners }),
      ).toBe("P");
      expect(
        cube2.nextCornerLetter({ corner: "P", buffer: "E", visitedCorners }),
      ).toBe("C");
      expect(
        cube2.nextCornerLetter({ corner: "C", buffer: "E", visitedCorners }),
      ).toBe("");
      expect(Array.from(visitedCorners)).toEqual([0, 1, 5, 4]);
    });

    test("to3bldCornerPath", () => {
      expect(identityCube.to3bldCornerPath({ buffer: "E" })).toBe("");
      const cube = new Cube(identityCube).move(
        "L2 U L2 B D' R2 F2 L B R2 D L2 U' F2 U L2 U2 F2 L2 U' B2",
      );
      expect(cube.to3bldCornerPath({ buffer: "E" })).toBe("NSWGCMDVD");
      const cube2 = new Cube(identityCube).move(
        "R2 D R2 D F2 L2 U' L2 D' F2 R' D' B F2 U' F' D2 L2 R'",
      );
      expect(cube2.to3bldCornerPath({ buffer: "E" })).toBe("WCDJBNVKUGXH");
      const cube3 = new Cube(identityCube).move("E2");
      expect(cube3.to3bldCornerPath({ buffer: "E" })).toBe("");
    });

    test("to3bldEdgePath", () => {
      expect(identityCube.to3bldEdgePath({ buffer: "U" })).toBe("");
      expect(
        identityCube.to3bldEdgePath({
          buffer: "U",
          targetFlip: [3, 1],
        }),
      ).toBe("");
      const cube = new Cube(identityCube).move(
        "D2 L' D' B2 U2 B2 L' R' D2 L' U2 L' B2 R2 B U R' F2 L' B' F",
      );
      expect(cube.to3bldEdgePath({ buffer: "U" })).toBe("MRCONJIDFDAQXGWS");
      expect(cube.to3bldEdgePath({ buffer: "U", letterScheme: SPEFCZ })).toBe(
        "MRCONJIDFDAQXGZS",
      ); // M2
      expect(
        cube.to3bldEdgePath({
          buffer: "U",
          letterScheme: SPEFCZ,
          targetFlip: [3, 1],
        }),
      ).toBe("MRCONJIAELQXGZS");
      expect(cube.to3bldEdgePath({ buffer: "B", letterScheme: SPEFCZ })).toBe(
        "HKCONJIDFDAQXGZS",
      ); // OP
      expect(cube.to3bldEdgePath({ buffer: "U", letterScheme: CHS })).toBe("");
      expect(cube.to3bldEdgePath({ buffer: "I", letterScheme: CHS })).toBe(
        "HWAPZQBCTCEFKLMN",
      );
      const cube2 = new Cube(identityCube).move(
        "U2 B2 U' R' L F2 R' D R' D' B' U2 R2 L' R2 D2 U' L B U' D2 L' U2 D' U",
      );
      expect(cube2.to3bldEdgePath({ buffer: "U", letterScheme: SPEFCZ })).toBe(
        "LIBJVMDGZNRD",
      );
      const cube3 = new Cube(identityCube).move(
        "L U D R' U D2 U F R D F2 D2 B2 L2 U R' L2 D2 B D2 F2 L2 D' B R",
      );
      expect(
        cube3.to3bldEdgePath({
          buffer: "U",
          letterScheme: SPEFCZ,
        }),
      ).toBe("OTXHFQBZDJBCI");
      expect(
        cube3.to3bldEdgePath({
          buffer: "U",
          letterScheme: SPEFCZ,
          targetFlip: [3, 1],
        }),
      ).toBe("OTXHFEPMSQCI");
      expect(
        cube3.to3bldEdgePath({
          buffer: "U",
          letterScheme: SPEFCZ,
          targetFlip: [5, 7],
        }),
      ).toBe("OTXHFQCMSEPI");
      const cube4 = new Cube(identityCube).move(
        "L2 R2 B' D' B D' F U2 B2 L2 R' F2 B2 R' D L F2 B2 L R2 B' U' L2 R2 B",
      );
      expect(
        cube4.to3bldEdgePath({
          buffer: "U",
          letterScheme: SPEFCZ,
          targetFlip: [3, 1],
        }),
      ).toBe("NMPQCIDLREXGZS");
    });

    test("nextEdgeLetter", () => {
      expect(identityCube.nextEdgeLetter({ edge: "U", buffer: "U" })).toBe("");
      expect(() =>
        identityCube.nextEdgeLetter({
          edge: "U",
          buffer: "D", // A, D cannot be buffer
          targetFlip: [3, 1],
        }),
      ).toThrow("dont flip the buffer");
      const cube = new Cube(identityCube).move(
        "D2 L' D' B2 U2 B2 L' R' D2 L' U2 L' B2 R2 B U R' F2 L' B' F",
      );
      const visitedEdges: Set<number> = new Set();
      expect(
        cube.nextEdgeLetter({ edge: "U", buffer: "U", visitedEdges }),
      ).toBe("M");
      expect(Array.from(visitedEdges)).toEqual([5]);
      expect(
        cube.nextEdgeLetter({ edge: "M", buffer: "U", visitedEdges }),
      ).toBe(
        "R", // r = buffer
      );
      expect(Array.from(visitedEdges)).toEqual([5, 0]);
      expect(
        cube.nextEdgeLetter({ edge: "R", buffer: "U", visitedEdges }),
      ).toBe("C");
      expect(
        cube.nextEdgeLetter({ edge: "C", buffer: "U", visitedEdges }),
      ).toBe("O");
      expect(
        cube.nextEdgeLetter({ edge: "O", buffer: "U", visitedEdges }),
      ).toBe("N");
      expect(
        cube.nextEdgeLetter({ edge: "N", buffer: "U", visitedEdges }),
      ).toBe("J");
      expect(Array.from(visitedEdges)).toEqual([5, 0, 1, 4, 11]);
      expect(
        cube.nextEdgeLetter({ edge: "J", buffer: "U", visitedEdges }),
      ).toBe("I"); // here should cycle end
      expect(
        cube.nextEdgeLetter({ edge: "I", buffer: "U", visitedEdges }),
      ).toBe("D");
      expect(
        cube.nextEdgeLetter({ edge: "D", buffer: "U", visitedEdges }),
      ).toBe("F");
      expect(
        cube.nextEdgeLetter({ edge: "F", buffer: "U", visitedEdges }),
      ).toBe("D");
      expect(
        cube.nextEdgeLetter({ edge: "D", buffer: "U", visitedEdges }),
      ).toBe("A");
      expect(
        cube.nextEdgeLetter({ edge: "A", buffer: "U", visitedEdges }),
      ).toBe("Q");
      expect(
        cube.nextEdgeLetter({ edge: "Q", buffer: "U", visitedEdges }),
      ).toBe("X");
      expect(
        cube.nextEdgeLetter({ edge: "X", buffer: "U", visitedEdges }),
      ).toBe("G");
      expect(
        cube.nextEdgeLetter({ edge: "X", buffer: "U", visitedEdges }),
      ).toBe("W");
      expect(
        cube.nextEdgeLetter({ edge: "W", buffer: "U", visitedEdges }),
      ).toBe("S");
      expect(Array.from(visitedEdges)).toEqual([
        5, 0, 1, 4, 11, 8, 2, 9, 3, 6, 7,
      ]);
      expect(
        cube.nextEdgeLetter({ edge: "S", buffer: "U", visitedEdges }),
      ).toBe(
        "", // no more edges to visit
      );
      expect(Array.from(visitedEdges)).toEqual([
        5, 0, 1, 4, 11, 8, 2, 9, 3, 6, 7,
      ]);
    });
  });

  test("upright", () => {
    expect(identityCube.upright()).toBe("");
    // U is in front F is on top
    expect(scrambledCube.upright()).toBe("x' z2");
  });

  test("isSolved", () => {
    expect(identityCube.isSolved()).toBe(true);
    expect(scrambledCube.isSolved()).toBe(false);
  });

  test("parseAlg", () => {
    expect(Cube.parseAlg(alg)).toEqual(algNumeric);
    expect(Cube.parseAlg(inverse)).toEqual(inverseNumeric);
    expect(() => Cube.parseAlg("S E X Y M O V E")).toThrow("Invalid move: X");
    expect(Cube.parseAlg([3, 0, 5, 2])).toEqual([3, 0, 5, 2]);
  });

  test("inverse", () => {
    expect(Cube.inverse(alg).toString()).toBe(inverse);
    expect(Cube.inverse(algNumeric).toString()).toBe(inverseNumeric.join(","));
  });

  describe("constructor", () => {
    it("creates solved cube with identity state", () => {
      expect(identityCube.center).toEqual([0, 1, 2, 3, 4, 5]);
      expect(identityCube.cp).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
      expect(identityCube.co).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
      expect(identityCube.ep).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      expect(identityCube.eo).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(identityCube.toString()).toBe(solvedCubeString);
    });

    it("initializes from existing state", () => {
      expect(scrambledCube.center).toEqual(state.center);
      expect(scrambledCube.cp).toEqual(state.cp);
      expect(scrambledCube.co).toEqual(state.co);
      expect(scrambledCube.ep).toEqual(state.ep);
      expect(scrambledCube.eo).toEqual(state.eo);
      expect(scrambledCube.toString()).toBe(
        "UUUUFUFUUFRRRRRRRRUFLFUFFFFDDDDDDDDDLLRLLLLLLBBBBBBBBB",
      );
    });

    it("allocates temp arrays for moves", () => {
      expect(identityCube.newCenter.length).toBe(6);
      expect(identityCube.newCp.length).toBe(8);
      expect(identityCube.newEp.length).toBe(12);
      expect(identityCube.newCo.length).toBe(8);
      expect(identityCube.newEo.length).toBe(12);
    });
  });

  describe("orientation", () => {
    it("twist URF corner", () => {
      const flippedCubeState: CubeState = {
        ...identityState,
        co: [1, 0, 0, 0, 0, 0, 0, 0],
      };
      let flippedCube = new Cube(flippedCubeState);
      expect(flippedCube.toString()).toBe(
        "UUUUUUUUFURRRRRRRRFFRFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
      );
      flippedCubeState.co[0] = 2;
      flippedCube = new Cube(flippedCubeState);
      expect(flippedCube.toString()).toBe(
        "UUUUUUUURFRRRRRRRRFFUFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
      );
    });

    it("twist BR edge", () => {
      const flippedCubeState: CubeState = {
        ...identityState,
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      };
      let flippedCube = new Cube(flippedCubeState);
      expect(flippedCube.toString()).toBe(
        "UUUUUUUUURRRRRBRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBRBBBBB",
      );
      flippedCubeState.eo[11] = 2; // mod 2 => 0 back to default
      flippedCube = new Cube(flippedCubeState);
      expect(flippedCube.toString()).toBe(solvedCubeString);
    });
  });

  test("fromString", () => {
    expect(Cube.fromString(identityCube.toString())).toEqual(identityCube);
    expect(Cube.fromString(scrambledCube.toString())).toEqual(scrambledCube);
  });
});
