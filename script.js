const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const frame = document.getElementById("frame");
const stage = document.getElementById("stage");

let mirror = false;
let stickerElements = [];

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
}).then(stream => video.srcObject = stream);

// MIRROR
function toggleMirror() {
  mirror = !mirror;
  video.style.transform = mirror ? "scaleX(-1)" : "scaleX(1)";
}

// FRAME
function changeFrame(src) {
  frame.src = src;
}

// CREATE STICKER
function createSticker(src) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "sticker";
  img.style.left = "150px";
  img.style.top = "100px";

  stage.appendChild(img);
  stickerElements.push(img);
  makeDraggable(img);
}

// DRAG STICKER
function makeDraggable(el) {
  let offsetX, offsetY;

  el.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    offsetX = touch.clientX - el.offsetLeft;
    offsetY = touch.clientY - el.offsetTop;
  });

  el.addEventListener("touchmove", e => {
    e.preventDefault();
    const touch = e.touches[0];
    el.style.left = (touch.clientX - offsetX) + "px";
    el.style.top = (touch.clientY - offsetY) + "px";
  });
}

// TIMER
function startTimer(sec) {
  let count = sec;
  const interval = setInterval(() => {
    alert(count);
    count--;
    if (count < 0) {
      clearInterval(interval);
      takePhoto();
    }
  }, 1000);
}

// TAKE PHOTO
function takePhoto() {
  ctx.save();
  if (mirror) {
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
  } else {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }
  ctx.restore();

  if (frame.src) {
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  }

  stickerElements.forEach(s => {
    const rect = s.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const x = (rect.left - stageRect.left) * (canvas.width / stageRect.width);
    const y = (rect.top - stageRect.top) * (canvas.height / stageRect.height);
    const size = rect.width * (canvas.width / stageRect.width);
    ctx.drawImage(s, x, y, size, size);
  });

  document.getElementById("result").src = canvas.toDataURL("image/png");
}

// DOWNLOAD
function downloadPhoto() {
  const a = document.createElement("a");
  a.download = "cute_photobooth.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
}
