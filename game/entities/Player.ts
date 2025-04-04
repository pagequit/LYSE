import {
  createSprite,
  createSpritePlayer,
  playbackSpritePlayer,
  setSpritePlayerXFrame,
  setSpritePlayerYFrame,
  type SpritePlayer,
} from "../../lib/Sprite.ts";
import { getDirection, isZero, type Vector } from "../../lib/Vector.ts";
import { input } from "../../lib/Input.ts";
import { type Circle } from "../../lib/StaticBody.ts";
import {
  createKinemeticCircle,
  type KinematicBody,
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
  velocity: Vector;
  speedMultiplier: number;
  animations: {
    [State.Walk]: SpritePlayer;
    [State.Idle]: SpritePlayer;
  };
  kinematicBody: KinematicBody<Circle>;
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
    speedMultiplier: 1,
    animations: {
      [State.Idle]: createSpritePlayer(
        createSprite({
          imageSrc: "/player-idle.png",
          width,
          height,
          frameWidth: 16,
          frameHeight: 16,
          xFrames: 2,
          yFrames: 4,
        }),
        500,
      ),
      [State.Walk]: createSpritePlayer(
        createSprite({
          imageSrc: "/player-walk.png",
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
    kinematicBody: createKinemeticCircle(position, width * 0.25, velocity),
  };
}

export function setState(player: Player, state: State): void {
  if (player.state === state) {
    return;
  }

  setSpritePlayerXFrame(player.animations[player.state], 0);
  setSpritePlayerXFrame(player.animations[state], 0);

  player.state = state;
}

export function setDirection(player: Player, direction: Direction): void {
  if (player.direction === direction) {
    return;
  }

  setSpritePlayerYFrame(player.animations[State.Idle], direction);
  setSpritePlayerYFrame(player.animations[State.Walk], direction);

  player.direction = direction;
}

export function animatePlayer(
  player: Player,
  ctx: CanvasRenderingContext2D,
  delta: number,
): void {
  playbackSpritePlayer(
    player.animations[player.state],
    {
      // FIXME: avoid object creation in render loop
      x: player.position.x - player.animations[player.state].sprite.width * 0.5,
      y:
        player.position.y -
        player.animations[player.state].sprite.height * 0.625,
    },
    ctx,
    delta,
  );
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

  player.velocity.x += input.vector.x * friction * player.speedMultiplier;
  player.velocity.y += input.vector.y * friction * player.speedMultiplier;
}
