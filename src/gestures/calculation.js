export function distance(a, b) {
  return Math.sqrt(
    (a.x - b.x) ** 2 +
    (a.y - b.y) ** 2
  );
}

export function getFrameCenter(points) {
  return {
    x:
      (
        points.indexLeft.x +
        points.indexRight.x +
        points.thumbLeft.x +
        points.thumbRight.x
      ) / 4,

    y:
      (
        points.indexLeft.y +
        points.indexRight.y +
        points.thumbLeft.y +
        points.thumbRight.y
      ) / 4
  };
}

export function getFrameWidth(points) {

  const dx = points.indexLeft.x - points.indexRight.x;
  const dy = points.indexLeft.y - points.indexRight.y;

  return Math.sqrt(dx ** 2 + dy **2);
}

export function getFrameInfo(points) {
  const centerX = (
      points.indexLeft.x +
      points.indexRight.x +
      points.thumbLeft.x +
      points.thumbRight.x
    ) / 4;

  const centerY = (
      points.indexLeft.y +
      points.indexRight.y +
      points.thumbLeft.y +
      points.thumbRight.y
    ) / 4;

  const width = distance(
    points.indexLeft,
    points.indexRight
  );

  const height = distance(
    points.thumbLeft,
    points.indexLeft
  );

  return {
    centerX,
    centerY,
    width,
    height
  };
}