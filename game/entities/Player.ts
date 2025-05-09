import {
  animateSprite,
  createSprite,
  type Sprite,
  setSpriteXFrame,
  setSpriteYFrame,
} from "../../engine/lib/Sprite.ts";
import { getDirection, isZero, type Vector } from "../../engine/lib/Vector.ts";
import { input } from "../../engine/stateful/Input.ts";
import {
  type Circle,
  createKinemeticCircle,
  type KinematicBody,
  updateKinematicBody,
} from "../../engine/lib/KinematicBody.ts";
import type { Drawable } from "../../engine/lib/Drawable.ts";

export enum State {
  Idle,
  Walk,
}

export enum Direction {
  Down,
  Left,
  Up,
  Right,
}

export type Player = {
  state: State;
  direction: Direction;
  accelerationRate: number;
  animations: {
    [State.Walk]: Sprite;
    [State.Idle]: Sprite;
  };
  kinematicBody: KinematicBody<Circle>;
  drawable: Drawable;
};

export function createPlayer(
  position: Vector,
  width: number,
  height: number,
): Player {
  const spriteOffset: Vector = {
    x: width - 64,
    y: height - 40,
  };
  const spriteOrigin: Vector = {
    x: position.x - spriteOffset.x,
    y: position.y - spriteOffset.y,
  };

  const player: Player = {
    state: State.Idle,
    direction: Direction.Down,
    accelerationRate: 0.25,
    animations: {
      [State.Idle]: createSprite({
        imageSrc: "/main-char-idle.png",
        origin: spriteOrigin,
        width,
        height,
        frameWidth: 32,
        frameHeight: 32,
        xFrames: 5,
        yFrames: 4,
        animationTime: 1000,
      }),
      [State.Walk]: createSprite({
        imageSrc: "/main-char-walk.png",
        origin: spriteOrigin,
        width,
        height,
        frameWidth: 32,
        frameHeight: 32,
        xFrames: 6,
        yFrames: 4,
        animationTime: 768,
      }),
    },
    kinematicBody: createKinemeticCircle(
      position,
      width - 108,
      { x: 0, y: 0 },
      (self, delta, friction) => {
        updateKinematicBody(self, delta, friction);
        spriteOrigin.x = self.origin.x - spriteOffset.x;
        spriteOrigin.y = self.origin.y - spriteOffset.y;
      },
    ),
    drawable: {
      position,
      draw: (ctx: CanvasRenderingContext2D, delta: number) => {
        animateSprite(player.animations[player.state], ctx, delta);
      },
    },
  };

  return player;
}

export function setState(player: Player, state: State): void {
  if (player.state === state) {
    return;
  }

  setSpriteXFrame(player.animations[player.state], 0);
  setSpriteXFrame(player.animations[state], 0);

  player.state = state;
}

export function setDirection(player: Player, direction: Direction): void {
  if (player.direction === direction) {
    return;
  }

  setSpriteYFrame(player.animations[State.Idle], direction);
  setSpriteYFrame(player.animations[State.Walk], direction);

  player.direction = direction;
}

export function processPlayer(
  player: Player,
  delta: number,
  frictionRate: number = 1,
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

  player.kinematicBody.velocity.x +=
    input.vector.x * frictionRate * player.accelerationRate;
  player.kinematicBody.velocity.y +=
    input.vector.y * frictionRate * player.accelerationRate;
}
