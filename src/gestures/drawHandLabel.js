export function drawHandLabel(
  ctx,
  handType,
  landmarks,
  width,
  height
){
  const wrist = landmarks[0];

  ctx.fillStyle =
    handType === "Left"
      ? "cyan"
      : "orange";

  ctx.font = "24px Arial";

  ctx.fillText(
    handType,
    wrist.x * width,
    wrist.y * height
  );
}