import { type Vector, getDirection, getMagnitude } from "../lib/Vector.ts";
import { pointer } from "./Pointer.ts";

export type TouchControls = {
  axes: [number, number];
  dPad: {
    position: Vector;
    radius: number;
    stickPosition: Vector;
    stickRadius: number;
  };
};

export const touchControls: TouchControls = {
  axes: [0, 0],
  dPad: {
    position: {
      x: 64,
      y: self.innerHeight - 64,
    },
    radius: 48,
    stickPosition: {
      x: 64,
      y: self.innerHeight - 64,
    },
    stickRadius: 32,
  },
};

export function processTouchControls(): void {
  if (!pointer.isDown) {
    touchControls.dPad.stickPosition.x = touchControls.dPad.position.x;
    touchControls.dPad.stickPosition.y = touchControls.dPad.position.y;
    touchControls.axes[0] = 0;
    touchControls.axes[1] = 0;

    return;
  }

  const relativePosition = {
    x: pointer.position.x - touchControls.dPad.position.x,
    y: pointer.position.y - touchControls.dPad.position.y,
  };

  const magnitude = getMagnitude(relativePosition);
  if (
    magnitude <= touchControls.dPad.radius &&
    magnitude >= touchControls.dPad.radius - touchControls.dPad.stickRadius
  ) {
    const direction = getDirection(relativePosition);
    touchControls.axes[0] = Math.cos(direction);
    touchControls.axes[1] = Math.sin(direction);

    touchControls.dPad.stickPosition.x = pointer.position.x;
    touchControls.dPad.stickPosition.y = pointer.position.y;
  }
}

export function renderTouchControls(ctx: CanvasRenderingContext2D): void {
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
