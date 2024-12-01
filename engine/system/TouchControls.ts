import { getDirection, getMagnitude, type Vector } from "../lib/Vector.ts";
import { pointer } from "./Pointer.ts";
import { camera, ctx } from "./View.ts";

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

export const touchControls = setup();

function setup(): TouchControls {
  self.addEventListener("resize", () => {
    touchControls.dPad.position.x = 64;
    touchControls.dPad.position.y = self.innerHeight - 64;
    resetDPad();
  });

  return {
    axes: [0, 0],
    dPad: {
      position: {
        x: 64,
        y: self.innerHeight - 64,
      },
      radius: 48,
      deadZone: 8,
      stickPosition: {
        x: 64,
        y: self.innerHeight - 64,
      },
      stickRadius: 32,
    },
  };
}

const touchVector: Vector = {
  x: pointer.position.x - touchControls.dPad.position.x,
  y: pointer.position.y - touchControls.dPad.position.y,
};

function resetDPad(): void {
  touchControls.dPad.stickPosition.x = touchControls.dPad.position.x;
  touchControls.dPad.stickPosition.y = touchControls.dPad.position.y;
  touchControls.axes[0] = 0;
  touchControls.axes[1] = 0;
}

export function processTouchControls(): void {
  if (!pointer.isDown) {
    resetDPad();
    return;
  }

  touchVector.x = pointer.position.x - touchControls.dPad.position.x;
  touchVector.y = pointer.position.y - touchControls.dPad.position.y;
  const magnitude = getMagnitude(touchVector);
  if (
    magnitude <= touchControls.dPad.radius &&
    magnitude >= touchControls.dPad.deadZone
  ) {
    const direction = getDirection(touchVector);
    touchControls.axes[0] = Math.cos(direction);
    touchControls.axes[1] = Math.sin(direction);

    touchControls.dPad.stickPosition.x = pointer.position.x;
    touchControls.dPad.stickPosition.y = pointer.position.y;
  } else {
    resetDPad();
  }
}

export function renderTouchControls(): void {
  ctx.beginPath();
  ctx.arc(
    touchControls.dPad.position.x + camera.position.x,
    touchControls.dPad.position.y + camera.position.y,
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
    touchControls.dPad.stickPosition.x + camera.position.x,
    touchControls.dPad.stickPosition.y + camera.position.y,
    touchControls.dPad.stickRadius,
    0,
    2 * Math.PI,
  );
  ctx.stroke();
  ctx.fill();
}
