# @memodungeon/cube

Small TypeScript Rubik's Cube library with:

- cube state model (`Cube`)
- algorithm parsing/inversion helpers
- 3BLD edge/corner path helpers
- built-in letter schemes (`SPEFFZ`, `SPEFCZ`, `CHS`)
- it's based on https://github.com/ldez/cubejs but rewritten to TypeScript with custom logic in (3x3 blind solver mainly) and custom additional unit tests

## Install

```bash
pnpm add @memodungeon/cube
# or npm i @memodungeon/cube
```

## Usage

```ts
import { Cube } from "@memodungeon/cube";

const cube = new Cube();
cube.move("R U R' U'"); // sexy move

console.log(cube.toString());
console.log(cube.isSolved());
```

### 3BLD edge path

```ts
import { Cube, SPEFCZ } from "@memodungeon/cube";

const cube = new Cube().move("D2 L' D' B2 U2 B2 L' R' D2 L' U2 L' B2 R2 B U R' F2 L' B' F");
const path = cube.to3bldEdgePath({
  buffer: "U",
  letterScheme: SPEFCZ,
  targetFlip: [3, 1], // treat edge 3 as 1 for dealing with parity
});

console.log(path);
```

## API (main exports)

- `Cube`
- `CubeState`
- `computeLetterSchemeMap`
- `flipTargetEdgeLetter`
- `resolveTargetFlipEdgeIds`
- `SPEFFZ`, `SPEFCZ`, `CHS`

## Development

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

## License

MIT
