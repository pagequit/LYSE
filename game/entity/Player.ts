import {
  animateSprite,
  createSprite,
  setXFrame,
  setYFrame,
  type Sprite,
} from "../../engine/system/Sprite.ts";
import { getDirection, isZero, type Vector } from "../../engine/lib/Vector.ts";
import { input } from "../../engine/system/Input.ts";
import {
  type CollisionShape,
  type Circle,
  type Rectangle,
  createCircle,
  CollisionShapeType,
} from "../../engine/lib/CollisionShape.ts";
import type { Renderable } from "../../engine/lib/Renderable.ts";

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
  animations: {
    [State.Walk]: Sprite;
    [State.Idle]: Sprite;
  };
  collisionShape: Circle & Renderable;
};

export function createPlayer(
  position: Vector,
  width: number,
  height: number,
): Player {
  return {
    position,
    state: State.Idle,
    direction: Direction.Right,
    velocity: { x: 0, y: 0 },
    speedMultiplier: 0.25,
    animations: {
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
    },
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
  animateSprite(
    player.animations[player.state],
    {
      x: player.position.x - player.animations[player.state].width / 2,
      y: player.position.y - player.animations[player.state].height / 2,
    },
    ctx,
    delta,
  );
}

function processCircleCollision(player: Player, circle: Circle): void {
  const dx = player.position.x + player.velocity.x - circle.position.x;
  const dy = player.position.y + player.velocity.y - circle.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (
    distance <= player.collisionShape.radius + circle.radius &&
    distance > 0
  ) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - circle.radius - player.collisionShape.radius;

    player.velocity.x -= normalX * overlap;
    player.velocity.y -= normalY * overlap;
  }
}

function processRectangleCollision(player: Player, rectangle: Rectangle): void {
  const dx =
    player.position.x +
    player.velocity.x -
    Math.max(
      rectangle.position.x,
      Math.min(player.position.x, rectangle.position.x + rectangle.width),
    );
  const dy =
    player.position.y +
    player.velocity.y -
    Math.max(
      rectangle.position.y,
      Math.min(player.position.y, rectangle.position.y + rectangle.height),
    );
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= player.collisionShape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - player.collisionShape.radius;

    player.velocity.x -= normalX * overlap;
    player.velocity.y -= normalY * overlap;
  }
}

export function processPlayer(
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

  for (const shape of collisionShapes) {
    switch (shape.type) {
      case CollisionShapeType.Circle: {
        processCircleCollision(player, shape as Circle);
        break;
      }
      case CollisionShapeType.Rectangle: {
        processRectangleCollision(player, shape as Rectangle);
        break;
      }
    }
  }

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
}
