import "./style.css";
import { colors } from "./style.ts";
import { useCanvas } from "./engine/system/View.ts";
import {
  type ActionKeys,
  getActionKeys,
  getPointerState,
  useKeyboard,
  usePointer,
} from "./engine/system/Input.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  processPlayer,
  setDirection,
  setState,
  State,
} from "./game/entity/Player.ts";

const { canvas, ctx } = useCanvas();

const { listen: listenKeyboard } = useKeyboard();
const { listen: listenPointer } = usePointer();

listenKeyboard();
listenPointer();

const actionKeys = getActionKeys();
const pointerState = getPointerState();

const player = createPlayer({
  x: (canvas.width - 64) / 2,
  y: (canvas.height - 64) / 2,
});

setState(player, State.Idle);
setDirection(player, Direction.Down);

type Grid = {
  height: number;
  width: number;
  tileSize: number;
  x: number;
  y: number;
};

const grid: Grid = {
  height: canvas.height,
  width: canvas.width,
  tileSize: 64,
  x: canvas.width / 64,
  y: canvas.height / 64,
};

function renderGrid(grid: Grid, ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < grid.x; i++) {
    for (let j = 0; j < grid.y; j++) {
      ctx.fillStyle = i % 2 === j % 2 ? "transparent" : "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(
        i * grid.tileSize,
        j * grid.tileSize,
        grid.tileSize,
        grid.tileSize,
      );
    }
  }
}

const touchControls = {
  dPad: {
    position: {
      x: 64,
      y: canvas.height - 64,
    },
    radius: 48,
    stickPosition: {
      x: 64,
      y: canvas.height - 64,
    },
    stickRadius: 32,
  },
  a: {
    position: {
      x: canvas.width - 88,
      y: canvas.height - 40,
    },
    radius: 24,
  },
  b: {
    position: {
      x: canvas.width - 40,
      y: canvas.height - 88,
    },
    radius: 24,
  },
};

function renderTouchControls(ctx: CanvasRenderingContext2D): void {
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

  ctx.beginPath();
  ctx.arc(
    touchControls.a.position.x,
    touchControls.a.position.y,
    touchControls.a.radius,
    0,
    2 * Math.PI,
  );
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    touchControls.b.position.x,
    touchControls.b.position.y,
    touchControls.b.radius,
    0,
    2 * Math.PI,
  );
  ctx.stroke();
  ctx.fill();
}

function processTouchControls(actionKeys: ActionKeys): void {
  if (pointerState.isDown) {
    const relativePosition = {
      x: pointerState.position.x - touchControls.dPad.position.x,
      y: pointerState.position.y - touchControls.dPad.position.y,
    };
    const magnitude = Math.hypot(relativePosition.x, relativePosition.y);

    if (
      magnitude <= touchControls.dPad.radius &&
      magnitude >= touchControls.dPad.radius - touchControls.dPad.stickRadius
    ) {
      const direction = Math.atan2(relativePosition.y, relativePosition.x);
      const dx = Math.cos(direction);
      const dy = Math.sin(direction);

      actionKeys.right = dx;
      actionKeys.left = -dx;
      actionKeys.down = dy;
      actionKeys.up = -dy;

      touchControls.dPad.stickPosition.x = pointerState.position.x;
      touchControls.dPad.stickPosition.y = pointerState.position.y;
    } else {
      actionKeys.right = 0;
      actionKeys.left = 0;
      actionKeys.down = 0;
      actionKeys.up = 0;

      touchControls.dPad.stickPosition.x = touchControls.dPad.position.x;
      touchControls.dPad.stickPosition.y = touchControls.dPad.position.y;
    }
  } else {
    touchControls.dPad.stickPosition.x = touchControls.dPad.position.x;
    touchControls.dPad.stickPosition.y = touchControls.dPad.position.y;
  }
}

let now: number = Date.now();
let then: number = Date.now();
let delta: number = 0;
(function animate() {
  requestAnimationFrame(animate);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  renderGrid(grid, ctx);

  renderTouchControls(ctx);
  processTouchControls(actionKeys);

  processPlayer(player, delta, actionKeys);
  animatePlayer(player, ctx, delta);

  then = now;
  now = Date.now();
  delta = now - then;

  ctx.fillStyle = colors.foregroundColor;
  ctx.fillText(`FPS: ${Math.round(1000 / delta)}`, 10, 20);

  ctx.restore();
})();
