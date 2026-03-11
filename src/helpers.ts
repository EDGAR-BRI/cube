import { LETTER_SCHEME_MAP, type Orientation } from "./consts";

export const resolveTargetFlipEdgeIds = (
  targetFlip: number[],
): [number, number] | null => {
  if (targetFlip.length !== 2) return null;

  const resolvedIds = targetFlip.map((value) => {
    const schemeEntry = LETTER_SCHEME_MAP[value];
    if (schemeEntry?.type === "edge") {
      return schemeEntry.id;
    }
    if (value >= 0 && value <= 11) {
      return value;
    }
    return null;
  });

  const [firstId, secondId] = resolvedIds;
  if (firstId === null || secondId === null || firstId === secondId) {
    return null;
  }

  return [firstId, secondId];
};

export const flipTargetEdgeLetter = ({
  currentLetter,
  targetLetter,
  targetFlipEdgeIds,
  letterSchemeMap,
}: {
  currentLetter: string;
  targetLetter: string;
  targetFlipEdgeIds: [number, number] | null;
  letterSchemeMap: Record<string, { id: number; orientation: Orientation }>;
}): string => {
  if (!targetFlipEdgeIds) return targetLetter;

  const currentTarget = letterSchemeMap[targetLetter];
  if (!currentTarget) return targetLetter;

  const [firstId, secondId] = targetFlipEdgeIds;
  const flippedId =
    currentTarget.id === firstId
      ? secondId
      : currentTarget.id === secondId
        ? firstId
        : currentTarget.id;

  if (flippedId === currentTarget.id) {
    return targetLetter;
  }

  const flippedTarget = Object.keys(letterSchemeMap).find(
    (letter) =>
      letterSchemeMap[letter].id === flippedId &&
      letterSchemeMap[letter].orientation === currentTarget.orientation,
  );

  if (!flippedTarget || flippedTarget === currentLetter) {
    return targetLetter;
  }

  return flippedTarget;
};

export const computeLetterSchemeMap = (
  letterScheme: string,
  type: "edge" | "corner" = "edge",
) => {
  return letterScheme
    .split("")
    .reduce(
      (
        acc: Record<string, { id: number; orientation: Orientation }>,
        letter,
        i,
      ) => {
        if (LETTER_SCHEME_MAP[i].type === type) {
          acc[letter] = {
            id: LETTER_SCHEME_MAP[i].id,
            orientation: LETTER_SCHEME_MAP[i].orientation,
          };
        }
        return acc;
      },
      {},
    );
};
