export function drawLandmarks(
  ctx,
  landmarks,
  width,
  height
) {
  landmarks.forEach((point,index)=>{

  const x = point.x * width;
  const y = point.y * height;

  ctx.beginPath();
  ctx.arc(x,y,5,0,Math.PI*2);
  ctx.fillStyle = "lime";
  ctx.fill();

  ctx.fillStyle = "red";
  ctx.font = "12px Arial";
  ctx.fillText(index,x+5,y+5);
});
}