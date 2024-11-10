import "../system/Input.ts";
import {
  type Sprite,
  createSprite,
  animateSprite,
  setYFrame,
} from "../lib/Sprite.ts";
import { normalize, type Vector } from "../lib/Vector.ts";

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
  animations: Record<State, Sprite>;
};

const animations: Record<State, Sprite> = {
  [State.Walk]: createSprite({
    imageSrc: "/BaseCharacter/walk.png",
    width: 256,
    height: 256,
    frameRate: 21,
    frameWidth: 80,
    frameHeight: 80,
    xFrames: 8,
    yFrames: 4,
  }),
  [State.Idle]: createSprite({
    imageSrc: "/BaseCharacter/idle.png",
    width: 256,
    height: 256,
    frameRate: 42,
    frameWidth: 80,
    frameHeight: 80,
    xFrames: 4,
    yFrames: 4,
  }),
};

export function createPlayer(position: Vector): Player {
  return {
    position,
    state: State.Idle,
    direction: Direction.Down,
    velocity: { x: 0, y: 0 },
    animations,
  };
}

export function setState(player: Player, state: State): void {
  player.state = state;
}

export function setDirection(player: Player, direction: Direction): void {
  player.direction = direction;
  setYFrame(player.animations[player.state], direction);
}

export function animatePlayer(
  player: Player,
  ctx: CanvasRenderingContext2D,
): void {
  animateSprite(player.animations[player.state], ctx, player.position);
}

export function processPlayer(
  player: Player,
  delta: number,
  gamepad: Gamepad | null,
): void {
  if (gamepad) {
    player.velocity.y = gamepad.buttons[13].value - gamepad.buttons[12].value;
    player.velocity.x = gamepad.buttons[15].value - gamepad.buttons[14].value;
    normalize(player.velocity);
  }

  player.position.x += player.velocity.x * delta;
  player.position.y += player.velocity.y * delta;
}
