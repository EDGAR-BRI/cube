// center IDs
const [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5];
// after y rotation => 0, 5, 1, 3, 2, 4
// after x rotation => 2, 1, 3, 5, 4, 0
// after x' rotation => 5, 1, 0, 2, 4, 3
// after z rotation => 4, 0, 2, 1, 3, 5

// corner IDs
const [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0, 1, 2, 3, 4, 5, 6, 7];

// edge IDs
const [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
];

type PieceType = "corner" | "edge" | "center";
type Orientation = 0 | 1 | 2;

const LETTER_SCHEME_MAP: { type: PieceType; id: number; orientation: Orientation }[] = [
  { type: "corner", id: ULB, orientation: 0 }, // A
  { type: "edge", id: UB, orientation: 0 }, // A
  { type: "corner", id: UBR, orientation: 0 }, // B
  { type: "edge", id: UL, orientation: 0 }, // D
  { type: "center", id: U, orientation: 0 },
  { type: "edge", id: UR, orientation: 0 }, // B
  { type: "corner", id: UFL, orientation: 0 }, // D
  { type: "edge", id: UF, orientation: 0 }, // C
  { type: "corner", id: URF, orientation: 0 }, // C
  { type: "corner", id: ULB, orientation: 1 }, // E
  { type: "edge", id: UL, orientation: 1 }, // E
  { type: "corner", id: UFL, orientation: 2 }, // F
  { type: "edge", id: BL, orientation: 1 }, // H
  { type: "center", id: L, orientation: 0 },
  { type: "edge", id: FL, orientation: 1 }, // F
  { type: "corner", id: DBL, orientation: 2 }, // H
  { type: "edge", id: DL, orientation: 1 }, // G
  { type: "corner", id: DLF, orientation: 1 }, // G
  { type: "corner", id: UFL, orientation: 1 }, // I
  { type: "edge", id: UF, orientation: 1 }, // I
  { type: "corner", id: URF, orientation: 2 }, // J
  { type: "edge", id: FL, orientation: 0 }, // L
  { type: "center", id: F, orientation: 0 },
  { type: "edge", id: FR, orientation: 0 }, // J
  { type: "corner", id: DLF, orientation: 2 }, // L
  { type: "edge", id: DF, orientation: 1 }, // K
  { type: "corner", id: DFR, orientation: 1 }, // K
  { type: "corner", id: URF, orientation: 1 }, // M
  { type: "edge", id: UR, orientation: 1 }, // M
  { type: "corner", id: UBR, orientation: 2 }, // N
  { type: "edge", id: FR, orientation: 1 }, // P
  { type: "center", id: R, orientation: 0 },
  { type: "edge", id: BR, orientation: 1 }, // N
  { type: "corner", id: DFR, orientation: 2 }, // P
  { type: "edge", id: DR, orientation: 1 }, // O
  { type: "corner", id: DRB, orientation: 1 }, // O
  { type: "corner", id: UBR, orientation: 1 }, // Q
  { type: "edge", id: UB, orientation: 1 }, // Q
  { type: "corner", id: ULB, orientation: 2 }, // R
  { type: "edge", id: BR, orientation: 0 }, // T
  { type: "center", id: B, orientation: 0 },
  { type: "edge", id: BL, orientation: 0 }, // R
  { type: "corner", id: DRB, orientation: 2 }, // T
  { type: "edge", id: DB, orientation: 1 }, // S
  { type: "corner", id: DBL, orientation: 1 }, // S
  { type: "corner", id: DLF, orientation: 0 }, // U
  { type: "edge", id: DF, orientation: 0 }, // U
  { type: "corner", id: DFR, orientation: 0 }, // V
  { type: "edge", id: DL, orientation: 0 }, // X
  { type: "center", id: D, orientation: 0 },
  { type: "edge", id: DR, orientation: 0 }, // V
  { type: "corner", id: DBL, orientation: 0 }, // X
  { type: "edge", id: DB, orientation: 0 }, // W
  { type: "corner", id: DRB, orientation: 0 }, // W
];

const centerColor = ["U", "R", "F", "D", "L", "B"];

const cornerColor = [
  ["U", "R", "F"],
  ["U", "F", "L"],
  ["U", "L", "B"],
  ["U", "B", "R"],
  ["D", "F", "R"],
  ["D", "L", "F"],
  ["D", "B", "L"],
  ["D", "R", "B"],
];

const edgeColor = [
  ["U", "R"],
  ["U", "F"],
  ["U", "L"],
  ["U", "B"],
  ["D", "R"],
  ["D", "F"],
  ["D", "L"],
  ["D", "B"],
  ["F", "R"],
  ["F", "L"],
  ["B", "L"],
  ["B", "R"],
];

// 9x6=54 stickers on 3x3
const [centerFacelet, cornerFacelet, edgeFacelet] = (function () {
  // helper to get global index
  const _U = (x: number) => x - 1;
  const _R = (x: number) => _U(9) + x; // 8 + x
  const _F = (x: number) => _R(9) + x; // 17 + x
  const _D = (x: number) => _F(9) + x; // 26 + x
  const _L = (x: number) => _D(9) + x; // 35 + x
  const _B = (x: number) => _L(9) + x; // 44 + x (_B(9) = 53 last sticker)

  return [
    // Centers
    [4, 13, 22, 31, 40, 49], // 4 + 9n (for n = 0 to 5)
    // Corners
    [
      [_U(9), _R(1), _F(3)], // 8, 9, 20
      [_U(7), _F(1), _L(3)], // 6, 18, 38
      [_U(1), _L(1), _B(3)],
      [_U(3), _B(1), _R(3)],
      [_D(3), _F(9), _R(7)],
      [_D(1), _L(9), _F(7)],
      [_D(7), _B(9), _L(7)],
      [_D(9), _R(9), _B(7)],
    ],
    // Edges
    [
      [_U(6), _R(2)], // 5, 10
      [_U(8), _F(2)], // 7, 19
      [_U(4), _L(2)],
      [_U(2), _B(2)],
      [_D(6), _R(8)],
      [_D(2), _F(8)],
      [_D(4), _L(8)],
      [_D(8), _B(8)],
      [_F(6), _R(4)],
      [_F(4), _L(6)],
      [_B(6), _L(4)],
      [_B(4), _R(6)],
    ],
  ];
})();

const faceNums: Record<string, number> = {
  U: 0,
  R: 1,
  F: 2,
  D: 3,
  L: 4,
  B: 5,
  E: 6,
  M: 7,
  S: 8,
  x: 9,
  y: 10,
  z: 11,
  u: 12,
  r: 13,
  f: 14,
  d: 15,
  l: 16,
  b: 17,
};

const faceNames: Record<number, string> = {
  0: "U",
  1: "R",
  2: "F",
  3: "D",
  4: "L",
  5: "B",
  6: "E",
  7: "M",
  8: "S",
  9: "x",
  10: "y",
  11: "z",
  12: "u",
  13: "r",
  14: "f",
  15: "d",
  16: "l",
  17: "b",
};

const MOVES: MoveDefinition[] = [
  {
    // U
    center: [U, R, F, D, L, B],
    cp: [UBR, URF, UFL, ULB, DFR, DLF, DBL, DRB],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [UB, UR, UF, UL, DR, DF, DL, DB, FR, FL, BL, BR],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    // R
    center: [U, R, F, D, L, B],
    cp: [DFR, UFL, ULB, URF, DRB, DLF, DBL, UBR],
    co: [2, 0, 0, 1, 1, 0, 0, 2],
    ep: [FR, UF, UL, UB, BR, DF, DL, DB, DR, FL, BL, UR],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    // F
    center: [U, R, F, D, L, B],
    cp: [UFL, DLF, ULB, UBR, URF, DFR, DBL, DRB],
    co: [1, 2, 0, 0, 2, 1, 0, 0],
    ep: [UR, FL, UL, UB, DR, FR, DL, DB, UF, DF, BL, BR],
    eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
  },
  {
    // D
    center: [U, R, F, D, L, B],
    cp: [URF, UFL, ULB, UBR, DLF, DBL, DRB, DFR],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [UR, UF, UL, UB, DF, DL, DB, DR, FR, FL, BL, BR],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    // L
    center: [U, R, F, D, L, B],
    cp: [URF, ULB, DBL, UBR, DFR, UFL, DLF, DRB],
    co: [0, 1, 2, 0, 0, 2, 1, 0],
    ep: [UR, UF, BL, UB, DR, DF, FL, DB, FR, UL, DL, BR],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    // B
    center: [U, R, F, D, L, B],
    cp: [URF, UFL, UBR, DRB, DFR, DLF, ULB, DBL],
    co: [0, 0, 1, 2, 0, 0, 2, 1],
    ep: [UR, UF, UL, BR, DR, DF, DL, BL, FR, FL, UB, DB],
    eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
  },
  {
    // E
    center: [U, F, L, D, B, R],
    cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FL, BL, BR, FR],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  },
  {
    // M
    center: [B, R, U, F, L, D],
    cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [UR, UB, UL, DB, DR, UF, DL, DF, FR, FL, BL, BR],
    eo: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
  },
  {
    // S
    center: [L, U, F, R, D, B],
    cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    ep: [UL, UF, DL, UB, UR, DF, DR, DB, FR, FL, BL, BR],
    eo: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  },
  {
    // x => R M' L'
    center: [F, R, D, B, L, U],
    co: [2, 1, 2, 1, 1, 2, 1, 2],
    cp: [4, 5, 1, 0, 7, 6, 2, 3],
    eo: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    ep: [8, 5, 9, 1, 11, 7, 10, 3, 4, 6, 2, 0],
  },
  {
    // y => U E' D'
    center: [U, B, R, D, F, L],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    cp: [UBR, URF, UFL, ULB, DRB, DFR, DLF, DBL],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    ep: [UB, UR, UF, UL, DB, DR, DF, DL, BR, FR, FL, BL],
  },
  {
    // z => F S B'
    center: [L, U, F, R, D, B],
    co: [1, 2, 1, 2, 2, 1, 2, 1],
    cp: [1, 5, 6, 2, 0, 4, 7, 3],
    eo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ep: [2, 9, 6, 10, 0, 8, 4, 11, 1, 5, 7, 3],
  },
  {
    // u => U E'
    center: [U, B, R, D, F, L],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    cp: [UBR, URF, UFL, ULB, DFR, DLF, DBL, DRB],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    ep: [UB, UR, UF, UL, DR, DF, DL, DB, BR, FR, FL, BL],
  },
  {
    // r => R M'
    center: [F, R, D, B, L, U],
    co: [2, 0, 0, 1, 1, 0, 0, 2],
    cp: [DFR, UFL, ULB, URF, DRB, DLF, DBL, UBR],
    eo: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    ep: [FR, DF, UL, UF, BR, DB, DL, UB, DR, FL, BL, UR],
  },
  {
    // f => F S
    center: [L, U, F, R, D, B],
    co: [1, 2, 0, 0, 2, 1, 0, 0],
    cp: [UFL, DLF, ULB, UBR, URF, DFR, DBL, DRB],
    eo: [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0],
    ep: [UL, FL, DL, UB, UR, FR, DR, DB, UF, DF, BL, BR],
  },
  {
    // d => D E
    center: [U, F, L, D, B, R],
    co: [0, 0, 0, 0, 0, 0, 0, 0],
    cp: [URF, UFL, ULB, UBR, DLF, DBL, DRB, DFR],
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    ep: [UR, UF, UL, UB, DF, DL, DB, DR, FL, BL, BR, FR],
  },
  {
    // l => L M
    center: [B, R, U, F, L, D],
    co: [0, 1, 2, 0, 0, 2, 1, 0],
    cp: [URF, ULB, DBL, UBR, DFR, UFL, DLF, DRB],
    eo: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    ep: [UR, UB, BL, DB, DR, UF, FL, DF, FR, UL, DL, BR],
  },
  {
    // b => B S'
    center: [R, D, F, L, U, B],
    co: [0, 0, 1, 2, 0, 0, 2, 1],
    cp: [URF, UFL, UBR, DRB, DFR, DLF, ULB, DBL],
    eo: [1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1],
    ep: [DR, UF, UR, BR, DL, DF, UL, BL, FR, FL, UB, DB],
  },
];

type MoveDefinition = {
  center: number[];
  cp: number[];
  co: number[];
  ep: number[];
  eo: number[];
};

export {
  U,
  R,
  F,
  D,
  L,
  B,
  centerColor,
  edgeColor,
  cornerColor,
  centerFacelet,
  cornerFacelet,
  edgeFacelet,
  faceNums,
  faceNames,
  MOVES,
  LETTER_SCHEME_MAP,
  type MoveDefinition,
  type PieceType,
  type Orientation,
};
