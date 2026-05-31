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
  Object.values(points)
    .forEach((point)=>{

      ctx.beginPath();

      ctx.arc(
        point.x * width,
        point.y * height,
        12,
        0,
        Math.PI*2
      );

      ctx.fillStyle = "red";
      ctx.fill();
    });
}