# @memodungeon/cube (Fork with Scrambles & 3BLD Memo Extensions)

TypeScript Rubik's Cube library for modeling, scrambling, and blindfolded (3BLD) solving.

Features:
- **Cube State Model** (`Cube`): fast permutation & orientation tracking (`cp`, `co`, `ep`, `eo`).
- **WCA Scramble Generator**: generates random-state 3x3x3 scrambles with opposing-face and consecutive-move filters (`generateScramble()`, `Cube.scramble()`, `Cube.fromScramble()`).
- **High-Level 3BLD Memo Generator** (`cube.to3bldMemo()`): produces grouped letter pairs, raw target tokens, and parity detection.
- **Custom Letter Schemes & Spanish Support**: supports Speffz, custom 54-token arrays (with multi-character tokens like `CH` and `Ñ`), comma-separated strings, and sticker ID maps (`Record<string, string>`).
- **3BLD Path & Token Helpers**: `to3bldEdgePath`, `to3bldCornerPath`, `to3bldEdgeTokens`, `to3bldCornerTokens`.
- **Zero Runtime Dependencies**: lightweight and offline-ready.

Based on [memodungeon/cube](https://github.com/memodungeon/cube) (MIT License).

---

## Installation

```bash
pnpm add @memodungeon/cube
# or npm i @memodungeon/cube
```

Or install directly from GitHub:

```bash
npm i github:EDGAR-BRI/cube
```

---

## Usage

### 1. Scramble Generation

```ts
import { Cube, generateScramble } from "@memodungeon/cube";

// Generate a 20-move WCA scramble string
const scramble = generateScramble();
// e.g. "D2 L' D' B2 U2 B2 L' R' D2 L' U2 L' B2 R2 B U R' F2 L' B'"

// Create a cube directly from a scramble
const cube = Cube.fromScramble(scramble);
console.log(cube.isSolved()); // false

// Or scramble an existing cube instance
const myCube = new Cube();
myCube.scramble(20);
```

### 2. High-Level 3BLD Memo (Pairs & Parity)

```ts
import { Cube, SPEFFZ } from "@memodungeon/cube";

const cube = Cube.fromScramble("L2 U L2 B D' R2 F2 L B R2 D L2 U' F2 U L2 U2 F2 L2 U' B2");

const memo = cube.to3bldMemo({
  edgeBuffer: "C",       // UF in SPEFFZ
  cornerBuffer: "E",     // UBL / UFR
  letterScheme: SPEFFZ,
});

console.log(memo.corners);
// [["N", "S"], ["W", "G"], ["C", "M"], ["D", "V"], ["D"]]

console.log(memo.hasParity);
// true (odd number of targets)
```

### 3. Custom Letter Schemes & Spanish Digraphs (`CH`, `Ñ`)

```ts
import { Cube, SPEFFZ } from "@memodungeon/cube";

// Replace 'D' with Spanish digraph 'CH' in a token array:
const customTokens = SPEFFZ.split("").map((t) => (t === "D" ? "CH" : t));

const cube = Cube.fromScramble("L2 U L2 B D' R2 F2 L B R2 D L2 U' F2 U L2 U2 F2 L2 U' B2");

const cornerTokens = cube.to3bldCornerTokens({
  buffer: "E",
  letterScheme: customTokens,
});

console.log(cornerTokens);
// ["N", "S", "W", "G", "C", "M", "CH", "V", "CH"]
```

### 4. Basic Moves & State

```ts
import { Cube } from "@memodungeon/cube";

const cube = new Cube();
cube.move("R U R' U'"); // sexy move

console.log(cube.toString());
console.log(cube.isSolved());
```

---

## API Exports

- **`Cube`**: Main class (`move`, `scramble`, `to3bldMemo`, `to3bldEdgeTokens`, `to3bldCornerTokens`, `to3bldEdgePath`, `to3bldCornerPath`).
- **`generateScramble`**, **`parseScramble`**, **`baseFace`**: Scramble generator functions.
- **`chunkIntoPairs`**: Groups target tokens into 2-letter pairs with trailing parity target.
- **`computeLetterSchemeMap`**, **`stickerIdForIndex`**, **`indexForStickerId`**: Letter scheme parsing helpers.
- **`SPEFFZ`**, **`SPEFCZ`**, **`CHS`**: Built-in letter scheme presets.
- **`BldMemoResult`**, **`ScrambleOptions`**, **`CubeState`**, **`LetterSchemeInput`**: TypeScript interfaces.

---

## Development

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

---

## License

MIT
