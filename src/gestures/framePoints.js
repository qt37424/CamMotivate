export function getFramePoints(
  result
) {
  let leftHand = null;
  let rightHand = null;

  result.landmarks.forEach(
    (landmarks,index) => {

      const handType =
        result.handednesses[index][0]
          .categoryName;

      if (handType === "Left")
        leftHand = landmarks;

      if (handType === "Right")
        rightHand = landmarks;
    }
  );

  if (!leftHand || !rightHand)
    return null;

  return {
    indexLeft: leftHand[8],
    thumbLeft: leftHand[4],

    indexRight: rightHand[8],
    thumbRight: rightHand[4]
  };
}

export function drawFramePoints(
  ctx,
  points,
  width,
  height
){
  ctx.beginPath();

  ctx.moveTo(
    points.indexLeft.x * width,
    points.indexLeft.y * height
  );

  ctx.lineTo(
    points.indexRight.x * width,
    points.indexRight.y * height
  );

  ctx.lineTo(
    points.thumbRight.x * width,
    points.thumbRight.y * height
  );

  ctx.lineTo(
    points.thumbLeft.x * width,
    points.thumbLeft.y * height
  );

  ctx.closePath();

  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;

  ctx.stroke();
}