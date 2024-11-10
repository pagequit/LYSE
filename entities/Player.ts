import "../system/Input.ts";
import {
  type Sprite,
  createSprite,
  animateSprite,
  setYFrame,
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
  _delta: number,
  gamepad: Gamepad | null,
): void {
  if (gamepad) {
    player.position.y -= gamepad.buttons[12].value;
    player.position.y += gamepad.buttons[13].value;
    player.position.x -= gamepad.buttons[14].value;
    player.position.x += gamepad.buttons[15].value;
  }
}
