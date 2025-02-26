import {
  animateSprite,
  createSprite,
  setXFrame,
  setYFrame,
  type Sprite,
} from "../../engine/system/Sprite.ts";
import {
  getDirection,
  getDotProduct,
  isZero,
  type Vector,
} from "../../engine/lib/Vector.ts";
import { input } from "../../engine/system/Input.ts";
import {
  type CollisionShape,
  CollisionShapeType,
  type Circle,
  createCircle,
  type Rectangle,
  isCircleToCircleCollision,
} from "../../engine/lib/CollisionShape.ts";
import type { Renderable } from "../../engine/lib/Renderable.ts";
import { paintSegment, type Segment } from "../../engine/lib/Segment.ts";

export enum State {
  Idle,
  Walk,
}

export enum Direction {
  Right,
  Left,
  Down,
  Up,
}

export type Player = {
  position: Vector;
  state: State;
  direction: Direction;
  velocity: Vector;
  speedMultiplier: number;
  animations: Record<State, Sprite>;
  collisionShape: Circle & Renderable;
};

export function createPlayer(
  position: Vector,
  width: number,
  height: number,
): Player {
  const animations: Record<State, Sprite> = {
    [State.Walk]: createSprite({
      imageSrc: "/player-walk.png",
      width,
      height,
      frameDuraton: 1000 / 4,
      frameWidth: 16,
      frameHeight: 16,
      xFrames: 4,
      yFrames: 4,
    }),
    [State.Idle]: createSprite({
      imageSrc: "/player-idle.png",
      width,
      height,
      frameDuraton: 1000 / 2,
      frameWidth: 16,
      frameHeight: 16,
      xFrames: 2,
      yFrames: 4,
    }),
  };

  return {
    position,
    state: State.Idle,
    direction: Direction.Right,
    velocity: { x: 0, y: 0 },
    speedMultiplier: 0.25,
    animations,
    collisionShape: createCircle(position, width / 2),
  };
}

export function setState(player: Player, state: State): void {
  if (player.state === state) {
    return;
  }

  setXFrame(player.animations[player.state], 0);
  setXFrame(player.animations[state], 0);

  player.state = state;
}

export function setDirection(player: Player, direction: Direction): void {
  if (player.direction === direction) {
    return;
  }

  setYFrame(player.animations[State.Idle], direction);
  setYFrame(player.animations[State.Walk], direction);

  player.direction = direction;
}

export function animatePlayer(
  player: Player,
  ctx: CanvasRenderingContext2D,
  delta: number,
): void {
  animateSprite(player.animations[player.state], ctx, delta, {
    x: player.position.x - player.animations[player.state].width / 2,
    y: player.position.y - player.animations[player.state].height / 2 - 8,
  });
}

function processCircleCollision(
  ctx: CanvasRenderingContext2D,
  player: Player,
  circle: CollisionShape,
  delta: number,
): void {
  const dx = player.position.x + player.velocity.x - circle.position.x;
  const dy = player.position.y + player.velocity.y - circle.position.y;
  // const distance = Math.hypot(dx, dy);

  if (isCircleToCircleCollision(player.collisionShape, circle as Circle)) {
    if (Math.abs(dx) > Math.abs(dy)) {
      player.velocity.x += dx > 0 ? delta * 0.25 : delta * -0.25;
      player.velocity.y += dy > 0 ? delta * 0.125 : delta * -0.125;
    } else {
      player.velocity.x += dx > 0 ? delta * 0.125 : delta * -0.125;
      player.velocity.y += dy > 0 ? delta * 0.25 : delta * -0.25;
    }
  }
}

function processRectangleCollision(
  ctx: CanvasRenderingContext2D,
  player: Player,
  rectangle: CollisionShape,
  delta: number,
): void {
  const ltx = rectangle.position.x - (rectangle as Rectangle).a * 0.5;
  const lty = rectangle.position.y - (rectangle as Rectangle).b * 0.5;

  const rtx = ltx + (rectangle as Rectangle).a;
  const rty = lty;

  const rbx = rtx;
  const rby = rty + (rectangle as Rectangle).b;

  const lbx = ltx;
  const lby = rby;

  const segmentA: Segment = [
    { x: ltx, y: lty },
    { x: rtx, y: rty },
  ];

  const segmentB: Segment = [
    { x: rtx, y: rty },
    { x: rbx, y: rby },
  ];

  const segmentC: Segment = [
    { x: rbx, y: rby },
    { x: lbx, y: lby },
  ];

  const segmentD: Segment = [
    { x: ltx, y: lty },
    { x: lbx, y: lby },
  ];

  const dx = player.position.x + player.velocity.x - rectangle.position.x;
  const dy = player.position.y + player.velocity.y - rectangle.position.y;

  const segmentX = dx > 0 ? segmentB : segmentD;
  const segmentY = dy > 0 ? segmentC : segmentA;

  paintSegment(segmentX, ctx, "rgba(255, 255, 0, 0.5)");
  paintSegment(segmentY, ctx, "rgba(255, 255, 255, 0.5)");

  const ab: Vector = {
    x: segmentX[1].x - segmentX[0].x,
    y: segmentX[1].y - segmentX[0].y,
  };

  const am: Vector = {
    x: player.position.x - segmentX[0].x,
    y: player.position.y - segmentX[0].y,
  };

  const normalizedAb: Vector = {
    x: ab.x / Math.hypot(ab.x, ab.y),
    y: ab.y / Math.hypot(ab.x, ab.y),
  };

  const t =
    getDotProduct(normalizedAb, am) /
    Math.hypot(segmentX[1].x - segmentX[0].x, segmentX[1].y - segmentX[0].y);

  const scalar = getDotProduct(am, normalizedAb);

  const pointX: Vector = {
    x: segmentX[0].x + normalizedAb.x * scalar,
    y: segmentX[0].y + normalizedAb.y * scalar,
  };

  const cd: Vector = {
    x: segmentY[1].x - segmentY[0].x,
    y: segmentY[1].y - segmentY[0].y,
  };

  const cm: Vector = {
    x: player.position.x - segmentY[0].x,
    y: player.position.y - segmentY[0].y,
  };

  const normalizedCd: Vector = {
    x: cd.x / Math.hypot(cd.x, cd.y),
    y: cd.y / Math.hypot(cd.x, cd.y),
  };

  const s =
    getDotProduct(normalizedCd, cm) /
    Math.hypot(segmentY[1].x - segmentY[0].x, segmentY[1].y - segmentY[0].y);

  const scalar2 = getDotProduct(cm, normalizedCd);

  const pointY: Vector = {
    x: segmentY[0].x + normalizedCd.x * scalar2,
    y: segmentY[0].y + normalizedCd.y * scalar2,
  };

  let distanceX = 0;
  let distanceY = 0;

  if (t > 0 && t < 1) {
    paintSegment([pointX, player.position], ctx, "rgba(255, 255, 0, 0.5)");
    distanceX = Math.hypot(
      pointX.x - player.position.x,
      pointX.y - player.position.y,
    );
  } else {
    const d2lt = Math.hypot(
      segmentX[0].x - player.position.x,
      segmentX[0].y - player.position.y,
    );
    const d2rt = Math.hypot(
      segmentX[1].x - player.position.x,
      segmentX[1].y - player.position.y,
    );

    const vx = d2lt > d2rt ? segmentX[0] : segmentX[1];
    distanceX = Math.hypot(vx.x - player.position.x, vx.y - player.position.y);

    if (d2lt > d2rt) {
      paintSegment(
        [segmentX[1], player.position],
        ctx,
        "rgba(255, 255, 0, 0.5)",
      );
    } else {
      paintSegment(
        [segmentX[0], player.position],
        ctx,
        "rgba(255, 255, 0, 0.5)",
      );
    }
  }

  if (s > 0 && s < 1) {
    paintSegment([pointY, player.position], ctx, "rgba(255, 255, 255, 0.5)");
    distanceY = Math.hypot(
      pointY.x - player.position.x,
      pointY.y - player.position.y,
    );
  } else {
    const d2lb = Math.hypot(
      segmentY[0].x - player.position.x,
      segmentY[0].y - player.position.y,
    );
    const d2rb = Math.hypot(
      segmentY[1].x - player.position.x,
      segmentY[1].y - player.position.y,
    );

    const vy = d2lb > d2rb ? segmentY[0] : segmentY[1];
    distanceY = Math.hypot(vy.x - player.position.x, vy.y - player.position.y);

    if (d2lb > d2rb) {
      paintSegment(
        [segmentY[1], player.position],
        ctx,
        "rgba(255, 255, 255, 0.5)",
      );
    } else {
      paintSegment(
        [segmentY[0], player.position],
        ctx,
        "rgba(255, 255, 255, 0.5)",
      );
    }
  }

  if (distanceX <= player.collisionShape.radius) {
    const direction = player.velocity.x < 0 ? 1 : -1;
    player.position.x =
      segmentX[0].x + player.collisionShape.radius * direction;
    player.velocity.x = 0;
  }

  if (distanceY <= player.collisionShape.radius) {
    player.velocity.y = player.velocity.y < 0 ? 1 : -1;
  }
}

const collisionShapeHandlers: Record<
  CollisionShapeType,
  (
    ctx: CanvasRenderingContext2D,
    player: Player,
    collisionShape: CollisionShape,
    delta: number,
  ) => void
> = {
  [CollisionShapeType.Circle]: processCircleCollision,
  [CollisionShapeType.Rectangle]: processRectangleCollision,
};

export function processPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  collisionShapes: Array<CollisionShape>,
  delta: number,
): void {
  if (isZero(input.vector)) {
    setState(player, State.Idle);
  } else {
    setState(player, State.Walk);

    const angle = getDirection(input.vector) / Math.PI + 1;
    if (angle > 0.25 && angle < 0.75) {
      setDirection(player, Direction.Up);
    } else if (angle >= 0.75 && angle <= 1.25) {
      setDirection(player, Direction.Right);
    } else if (angle > 1.25 && angle < 1.75) {
      setDirection(player, Direction.Down);
    } else {
      setDirection(player, Direction.Left);
    }
  }

  player.velocity.x = input.vector.x * delta * player.speedMultiplier;
  player.velocity.y = input.vector.y * delta * player.speedMultiplier;

  for (let i = 0; i < collisionShapes.length; i++) {
    collisionShapeHandlers[collisionShapes[i].type](
      ctx,
      player,
      collisionShapes[i],
      delta,
    );
  }

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
}
