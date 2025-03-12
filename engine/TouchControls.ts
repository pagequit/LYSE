import { getDirection, getMagnitude, type Vector } from "./Vector.ts";

const canvas = document.createElement("canvas");
canvas.width = 164;
canvas.height = 164;
canvas.style.position = "absolute";
canvas.style.left = "0";
canvas.style.bottom = "0";
canvas.style.borderRadius = "50%";

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let animationRequestId: number;

const touchVector: Vector = { x: 0, y: 0 };
let yOffset: number = canvas.height - self.innerHeight;

export type TouchControls = {
  axes: [number, number];
  dPad: {
    position: Vector;
    radius: number;
    deadZone: number;
    stickPosition: Vector;
    stickRadius: number;
  };
};

export const touchControls: TouchControls = {
  axes: [0, 0],
  dPad: {
    position: {
      x: canvas.width / 2,
      y: canvas.height / 2,
    },
    radius: 48,
    deadZone: 8,
    stickPosition: {
      x: canvas.width / 2,
      y: canvas.height / 2,
    },
    stickRadius: 32,
  },
};

function processDPad(touch: Touch): void {
  touchVector.x = touch.clientX - touchControls.dPad.position.x;
  touchVector.y = touch.clientY - touchControls.dPad.position.y + yOffset;

  const magnitude = getMagnitude(touchVector);
  if (
    magnitude <= touchControls.dPad.radius &&
    magnitude >= touchControls.dPad.deadZone
  ) {
    const direction = getDirection(touchVector);
    touchControls.axes[0] = Math.cos(direction);
    touchControls.axes[1] = Math.sin(direction);

    touchControls.dPad.stickPosition.x = touch.clientX;
    touchControls.dPad.stickPosition.y = touch.clientY + yOffset;
  } else {
    resetDPad();
  }
}

function resetDPad(): void {
  touchControls.dPad.stickPosition.x = touchControls.dPad.position.x;
  touchControls.dPad.stickPosition.y = touchControls.dPad.position.y;
  touchControls.axes[0] = 0;
  touchControls.axes[1] = 0;
}

function onTouchStart(event: TouchEvent): void {
  processDPad(event.touches[0]);
}

function onTouchMove(event: TouchEvent): void {
  processDPad(event.touches[0]);
}

function onTouchEnd(): void {
  resetDPad();
}

function onContextMenu(event: MouseEvent): void {
  event.preventDefault();
}

function onResize(): void {
  yOffset = canvas.height - self.innerHeight;
  resetDPad();
}

export function renderTouchControls(): void {
  ctx.beginPath();
  ctx.arc(
    touchControls.dPad.position.x,
    touchControls.dPad.position.y,
    touchControls.dPad.radius,
    0,
    2 * Math.PI,
  );
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    touchControls.dPad.stickPosition.x,
    touchControls.dPad.stickPosition.y,
    touchControls.dPad.stickRadius,
    0,
    2 * Math.PI,
  );
  ctx.stroke();
  ctx.fill();
}

function animate() {
  animationRequestId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderTouchControls();
}

export function applyTouchControls(): void {
  canvas.addEventListener("touchstart", onTouchStart);
  canvas.addEventListener("touchmove", onTouchMove);
  canvas.addEventListener("touchend", onTouchEnd);
  canvas.addEventListener("contextmenu", onContextMenu);
  self.addEventListener("resize", onResize);

  document.body.appendChild(canvas);
  animate();
}

export function removeTouchControls(): void {
  canvas.removeEventListener("touchstart", onTouchStart);
  canvas.removeEventListener("touchmove", onTouchMove);
  canvas.removeEventListener("touchend", onTouchEnd);
  canvas.removeEventListener("contextmenu", onContextMenu);
  self.removeEventListener("resize", onResize);

  cancelAnimationFrame(animationRequestId);
  document.body.removeChild(canvas);
}
