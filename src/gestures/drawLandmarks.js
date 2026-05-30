export function drawLandmarks(
  ctx,
  landmarks,
  width,
  height
) {
  landmarks.forEach((point) => {
    ctx.beginPath();

    ctx.arc(
      point.x * width,
      point.y * height,
      5,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "lime";
    ctx.fill();
  });
}