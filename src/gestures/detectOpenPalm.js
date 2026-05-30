export function detectOpenPalm(landmarks) {
  const fingerTips = [8, 12, 16, 20];
  const fingerPips = [6, 10, 14, 18];

  let count = 0;

  for (let i = 0; i < fingerTips.length; i++) {
    if (landmarks[fingerTips[i]].y < landmarks[fingerPips[i]].y) {
      count++;
    }
  }

  const thumbOpen =
    Math.abs(
      landmarks[4].x - landmarks[2].x
    ) > 0.05;

  if (thumbOpen) count++;

  return count === 5;
}