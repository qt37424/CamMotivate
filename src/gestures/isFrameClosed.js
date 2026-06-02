import { distance } from "./calculation"

export function isFrameClosed(points) {
  const topDistance =
    distance(
      points.indexLeft,
      points.indexRight
    );

  const bottomDistance =
    distance(
      points.thumbLeft,
      points.thumbRight
    );

  return (
    topDistance < 0.15 &&
    bottomDistance < 0.15
  );
}