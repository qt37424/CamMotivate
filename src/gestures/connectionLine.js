export function drawConnections(
  ctx,
  landmarks,
  width,
  height
) {
  const connections = [
    [0,1],
    [1,2],
    [2,3],
    [3,4],

    [0,5],
    [5,6],
    [6,7],
    [7,8],

    [0,9],
    [9,10],
    [10,11],
    [11,12],

    [0,13],
    [13,14],
    [14,15],
    [15,16],

    [0,17],
    [17,18],
    [18,19],
    [19,20]
  ];

  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;

  connections.forEach(([a,b])=>{
    ctx.beginPath();

    ctx.moveTo(
      landmarks[a].x * width,
      landmarks[a].y * height
    );

    ctx.lineTo(
      landmarks[b].x * width,
      landmarks[b].y * height
    );

    ctx.stroke();
  });
}