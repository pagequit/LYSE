import {
  type Sprite,
  createSprite,
  animateSprite,
  setVFrame,
} from "../lib/Sprite.ts";
import { type Vector } from "../lib/Vector.ts";

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
  animations: Record<State, Sprite>;
};

const idle = createSprite({
  imageSrc: "/BaseCharacter/idle.png",
  width: 256,
  height: 256,
  frameRate: 42,
  frameWidth: 80,
  frameHeight: 80,
  hFrames: 4,
  vFrames: 4,
});

const walk = createSprite({
  imageSrc: "/BaseCharacter/walk.png",
  width: 256,
  height: 256,
  frameRate: 21,
  frameWidth: 80,
  frameHeight: 80,
  hFrames: 8,
  vFrames: 4,
});

const animations = {
  [State.Idle]: idle,
  [State.Walk]: walk,
};

export function createPlayer(position: Vector): Player {
  return {
    position,
    state: State.Idle,
    direction: Direction.Down,
    animations,
  };
}

export function setDirection(player: Player, direction: Direction): void {
  player.direction = direction;
  setVFrame(player.animations[player.state], direction);
}

export function animatePlayer(
  player: Player,
  ctx: CanvasRenderingContext2D,
): void {
  animateSprite(player.animations[player.state], ctx, player.position);
}
