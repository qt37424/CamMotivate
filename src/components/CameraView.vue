<template>
  <div class="container">
    <video ref="videoRef" autoplay playsinline muted class="video" />

    <canvas ref="canvasRef" class="canvas" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

import { detectOpenPalm } from "../gestures/detectOpenPalm";
import { drawHeart } from "../gestures/drawHeart";
// import { drawLandmarks } from "../gestures/drawLandmarks";
// import { drawConnections } from "../gestures/drawConnectionLine";
import { drawHandLabel } from "../gestures/drawHandLabel";
import { getFramePoints, drawFramePoints } from "../gestures/framePoints";
import { isFrameClosed } from "../gestures/isFrameClosed";
import { getFrameWidth, getFrameCenter, getFrameInfo } from "../gestures/calculation";
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.jpg";


const videoRef = ref(null);
const canvasRef = ref(null);

onMounted(async () => {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  const imageList = [img1, img2, img3, img4, img5];
  let image = null;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Camera
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  video.srcObject = stream;

  await video.play();

  // MediaPipe runtime
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    },

    runningMode: "VIDEO",

    numHands: 2,
  });

  async function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const now = performance.now();
    const result = handLandmarker.detectForVideo(video, now);

    if (result && result.landmarks && result.landmarks.length) {
      result.landmarks.forEach((landmarks, index) => {
        const openPalm = detectOpenPalm(landmarks);

        const handType = result.handednesses[index][0].categoryName;
        const framePoints = getFramePoints(result);
        // console.log(handType);
        drawHandLabel(ctx, handType, landmarks, canvas.width, canvas.height);

        if (openPalm) {
          [4, 8, 12, 16, 20].forEach((tipIndex) => {
            const point = landmarks[tipIndex];
            drawHeart(ctx, point.x * canvas.width, point.y * canvas.height);
          });
        }
        if (framePoints && openPalm) {
          const closed = isFrameClosed(framePoints);
          const currentDistance = getFrameWidth(framePoints);
          let previousDistance = 0;
          let gestureState = "IDLE";

          drawFramePoints(ctx, framePoints, canvas.width, canvas.height);

          if (gestureState === "IDLE" && closed) {
            gestureState = "FRAME_READY";
            // console.log(gestureState);
          }

          if (gestureState === "FRAME_READY") {
            const delta = currentDistance - previousDistance;
            if (delta > 0.12) {
              const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
              image = new Image();
              image.src = randomImage;
              gestureState = "IMAGE_OPENED";
            }
          }

          if (gestureState == "IMAGE_OPENED") {
            DisplayImage(framePoints, image)
            // ctx.drawImage(image, 300, 100, 400, 400);
            gestureState = "IMAGE_TRACKING"
            console.log(gestureState);
          }

          if (gestureState === "IMAGE_TRACKING" && closed) {
            gestureState = "IDLE"
            image = null;
            console.log("FRAME_CLOSED");
          }
        }
      });
    }

    function DisplayImage(framePoints, image) {
      const frameInfo = getFrameInfo(framePoints);
      let smoothedCenterX = 0;
      let smoothedCenterY = 0;

      smoothedCenterX = smoothedCenterX * 0.8 + frameInfo.centerX * 0.2;
      smoothedCenterY = smoothedCenterY * 0.8 + frameInfo.centerY * 0.2;

      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        frameInfo.centerX * canvas.width - frameInfo.width * canvas.width / 2,
        frameInfo.centerY * canvas.height - frameInfo.height * canvas.height / 2,
        frameInfo.width * canvas.width,
        frameInfo.height * canvas.height
      );

      // ctx.beginPath();
      ctx.drawImage(
        image,
        frameInfo.centerX * canvas.width - frameInfo.width * canvas.width / 2,
        frameInfo.centerY * canvas.height - frameInfo.height * canvas.height / 2,
        frameInfo.width * canvas.width,
        frameInfo.height * canvas.height
      );
    }

    requestAnimationFrame(render);
  }

  render();
});
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.video {
  display: none;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
