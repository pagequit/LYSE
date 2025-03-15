import {
  animateSprite,
  createSprite,
  setXFrame,
  setYFrame,
  type Sprite,
} from "../../engine/Sprite.ts";
import { getDirection, isZero, type Vector } from "../../engine/Vector.ts";
import { input } from "../../engine/Input.ts";
import { type Circle, type Rectangle } from "../../engine/CollisionBody.ts";
import {
  createKinemeticCircle,
  createKinemeticRectangle,
  type KinematicBody,
} from "../../engine/KinematicBody.ts";

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
  kinematicBody: KinematicBody<Rectangle>;
};

export function createPlayer(
  position: Vector,
  width: number,
  height: number,
): Player {
  const velocity = { x: 0, y: 0 };
  return {
    position,
    state: State.Idle,
    direction: Direction.Right,
    velocity,
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
    kinematicBody: createKinemeticRectangle(position, width, height, velocity),
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
      x: player.position.x,
      y: player.position.y,
    },
    ctx,
    delta,
  );
}

export function processPlayer(player: Player): void {
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

  player.velocity.x = input.vector.x;
  player.velocity.y = input.vector.y;
}
