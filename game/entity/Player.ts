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
  getMagnitude,
  isZero,
  type Vector,
} from "../../engine/lib/Vector.ts";
import { input } from "../../engine/system/Input.ts";
import {
  type CollisionShape,
  CollisionShapeType,
  type Circle,
  createCollisionShapeCircle,
  type Rectangle,
} from "../../engine/lib/CollisionShape.ts";
import type { Renderable } from "../../engine/lib/Renderable.ts";
import { createNode, paintNode } from "./Node.ts";
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
    collisionShape: createCollisionShapeCircle(position, width / 2),
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
  ctx: CanvasRenderingContext2D, // DELETME
  player: Player,
  circle: CollisionShape,
): void {
  const dx = player.position.x + player.velocity.x - circle.position.x;
  const dy = player.position.y + player.velocity.y - circle.position.y;
  const distance = Math.hypot(dx, dy);

  if (distance <= (circle as Circle).radius + player.collisionShape.radius) {
    if (Math.abs(dx) > Math.abs(dy)) {
      player.velocity.x += dx > 0 ? 2 : -2;
      player.velocity.y += dy > 0 ? 1 : -1;
    } else {
      player.velocity.x += dx > 0 ? 1 : -1;
      player.velocity.y += dy > 0 ? 2 : -2;
    }
  }
}

function processRectangleCollision(
  ctx: CanvasRenderingContext2D,
  player: Player,
  rectangle: CollisionShape,
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

  paintSegment(segmentX, ctx, "rgba(255, 255, 255, 0.5)");
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

  const point: Vector = {
    x: segmentX[0].x + normalizedAb.x * scalar,
    y: segmentX[0].y + normalizedAb.y * scalar,
  };

  paintNode(createNode(point), ctx, "rgba(255, 255, 255, 0.5)");
  paintSegment([point, player.position], ctx, "rgba(255, 255, 255, 0.5)");

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

  const point2: Vector = {
    x: segmentY[0].x + normalizedCd.x * scalar2,
    y: segmentY[0].y + normalizedCd.y * scalar2,
  };

  paintNode(createNode(point2), ctx, "rgba(255, 255, 255, 0.5)");
  paintSegment([point2, player.position], ctx, "rgba(255, 255, 255, 0.5)");
}

const collisionShapeHandlers: Record<
  CollisionShapeType,
  (
    ctx: CanvasRenderingContext2D,
    player: Player,
    collisionShape: CollisionShape,
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
    );
  }

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
}
