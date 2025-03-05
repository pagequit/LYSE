import {
  animateSprite,
  createSprite,
  setXFrame,
  setYFrame,
  type Sprite,
} from "../../engine/system/Sprite.ts";
import {
  getDirection,
  getDistance,
  getDistanceSquared,
  isZero,
  type Vector,
} from "../../engine/lib/Vector.ts";
import { input } from "../../engine/system/Input.ts";
import {
  type CollisionShape,
  type Circle,
  createCircle,
  getNormal,
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
): void {
  // const dx = player.position.x + player.velocity.x - circle.position.x;
  // const dy = player.position.y + player.velocity.y - circle.position.y;
  const distanceSquared = getDistanceSquared(
    {
      x: player.position.x + player.velocity.x,
      y: player.position.y + player.velocity.y,
    },
    circle.position,
  );

  if (
    distanceSquared <=
    (player.collisionShape.radius + (circle as Circle).radius) ** 2
  ) {
    const normal = getNormal(
      {
        x: player.position.x + player.velocity.x,
        y: player.position.y + player.velocity.y,
      },
      circle.position,
    );

    const overlap =
      getDistance(player.position, circle.position) -
      (circle as Circle).radius -
      player.collisionShape.radius;

    player.position.x -= normal.x * overlap;
    player.position.y -= normal.y * overlap;
  }
}

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
    processCircleCollision(ctx, player, collisionShapes[1]);
  }

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
}
