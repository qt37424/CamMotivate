<template>
  <div class="container">
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="video"
    />

    <canvas
      ref="canvasRef"
      class="canvas"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import {
  FilesetResolver,
  HandLandmarker
} from "@mediapipe/tasks-vision";

import { detectOpenPalm } from "../gestures/detectOpenPalm";
import { drawHeart } from "../gestures/drawHeart";
import { drawLandmarks } from "../gestures/drawLandmarks";
import { drawConnections } from "../gestures/connectionLine";

const videoRef = ref(null);
const canvasRef = ref(null);

onMounted(async () => {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Camera
  const stream =
    await navigator.mediaDevices.getUserMedia({
      video: true
    });

  video.srcObject = stream;

  await video.play();

  // MediaPipe runtime
  const vision =
    await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

  const handLandmarker =
    await HandLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        },

        runningMode: "VIDEO",

        numHands: 2
      }
    );

  async function render() {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const now = performance.now();

    const result =
      handLandmarker.detectForVideo(
        video,
        now
      );

    if (
      result &&
      result.landmarks &&
      result.landmarks.length
    ) {
      result.landmarks.forEach(
        (landmarks) => {
          const openPalm =
            detectOpenPalm(landmarks);

          drawLandmarks(
            ctx,
            landmarks,
            canvas.width,
            canvas.height
          );
          drawConnections(
            ctx,
            landmarks,
            canvas.width,
            canvas.height
          );

          if (openPalm) {
            [4, 8, 12, 16, 20].forEach(
              (tipIndex) => {
                const point =
                  landmarks[tipIndex];

                drawHeart(
                  ctx,
                  point.x *
                    canvas.width,
                  point.y *
                    canvas.height
                );
              }
            );
          }
        }
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