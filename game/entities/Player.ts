import { createSprite } from "../../lib/Sprite.ts";
import {
  createSpriteAnimation,
  playSpriteAnimation,
  setSpriteAnimationXFrame,
  setSpriteAnimationYFrame,
  type SpriteAnimation,
} from "../../lib/SpriteAnimation.ts";
import { getDirection, isZero, type Vector } from "../../lib/Vector.ts";
import { input } from "../../lib/Input.ts";
import {
  createKinemeticCircle,
  updateKinematicBody,
  type KinematicBody,
  type Circle,
} from "../../lib/KinematicBody.ts";

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
  speedMultiplier: number;
  animations: {
    [State.Walk]: SpriteAnimation;
    [State.Idle]: SpriteAnimation;
  };
  kinematicBody: KinematicBody<Circle>;
};

export function createPlayer(
  position: Vector,
  width: number,
  height: number,
): Player {
  const spriteOffset = {
    x: width * 0.5,
    y: height * 0.625,
  };
  const spriteOrigin = {
    x: position.x - spriteOffset.x,
    y: position.y - spriteOffset.y,
  };

  return {
    position,
    state: State.Idle,
    direction: Direction.Right,
    speedMultiplier: 1,
    animations: {
      [State.Idle]: createSpriteAnimation(
        createSprite({
          imageSrc: "/player-idle.png",
          origin: spriteOrigin,
          width,
          height,
          frameWidth: 16,
          frameHeight: 16,
          xFrames: 2,
          yFrames: 4,
        }),
        500,
      ),
      [State.Walk]: createSpriteAnimation(
        createSprite({
          imageSrc: "/player-walk.png",
          origin: spriteOrigin,
          width,
          height,
          frameWidth: 16,
          frameHeight: 16,
          xFrames: 4,
          yFrames: 4,
        }),
        500,
      ),
    },
    kinematicBody: createKinemeticCircle(
      position,
      width / 4,
      { x: 0, y: 0 },
      (self, friction) => {
        updateKinematicBody(self, friction);
        spriteOrigin.x = self.origin.x - spriteOffset.x;
        spriteOrigin.y = self.origin.y - spriteOffset.y;
      },
    ),
  };
}

export function setState(player: Player, state: State): void {
  if (player.state === state) {
    return;
  }

  setSpriteAnimationXFrame(player.animations[player.state], 0);
  setSpriteAnimationXFrame(player.animations[state], 0);

  player.state = state;
}

export function setDirection(player: Player, direction: Direction): void {
  if (player.direction === direction) {
    return;
  }

  setSpriteAnimationYFrame(player.animations[State.Idle], direction);
  setSpriteAnimationYFrame(player.animations[State.Walk], direction);

  player.direction = direction;
}

export function animatePlayer(
  player: Player,
  ctx: CanvasRenderingContext2D,
  delta: number,
): void {
  playSpriteAnimation(player.animations[player.state], ctx, delta);
}

export function processPlayer(player: Player, friction: number = 1): void {
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
    input.vector.x * friction * player.speedMultiplier;
  player.kinematicBody.velocity.y +=
    input.vector.y * friction * player.speedMultiplier;
}
