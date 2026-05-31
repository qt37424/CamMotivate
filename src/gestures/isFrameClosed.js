function distance(a, b) {
  return Math.sqrt(
    (a.x - b.x) ** 2 +
    (a.y - b.y) ** 2
  );
}

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

export function getFrameWidth(points) {
  return Math.sqrt(
    (points.indexLeft.x -
      points.indexRight.x) **
      2 +
      (points.indexLeft.y -
        points.indexRight.y) **
        2
  );
}