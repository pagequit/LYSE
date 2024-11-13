import {
  type Sprite,
  createSprite,
  animateSprite,
  setYFrame,
} from "../component/Sprite.ts";
import { type Vector, normalize, isZero } from "../component/Vector.ts";
import { type ActionKeys } from "../../engine/system/Input.ts";

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
  velocity: Vector;
  animations: Record<State, Sprite>;
};

const animations: Record<State, Sprite> = {
  [State.Walk]: createSprite({
    imageSrc: "/BaseCharacter/walk.png",
    width: 256,
    height: 256,
    frameRate: 1000 / 8,
    frameWidth: 80,
    frameHeight: 80,
    xFrames: 8,
    yFrames: 4,
  }),
  [State.Idle]: createSprite({
    imageSrc: "/BaseCharacter/idle.png",
    width: 256,
    height: 256,
    frameRate: 1000 / 4,
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
    velocity: { x: 0, y: 0 },
    animations,
  };
}

export function setState(player: Player, state: State): void {
  player.state = state;
}

export function setDirection(player: Player, direction: Direction): void {
  setYFrame(player.animations[State.Idle], direction);
  setYFrame(player.animations[State.Walk], direction);
}

export function animatePlayer(
  player: Player,
  ctx: CanvasRenderingContext2D,
  delta: number,
): void {
  animateSprite(player.animations[player.state], ctx, delta, player.position);
}

export function processPlayer(
  player: Player,
  delta: number,
  actionKeys: ActionKeys,
): void {
  player.velocity.x = actionKeys.right - actionKeys.left;
  player.velocity.y = actionKeys.down - actionKeys.up;

  normalize(player.velocity);

  player.position.x += 0.25 * player.velocity.x * delta;
  player.position.y += 0.25 * player.velocity.y * delta;

  if (isZero(player.velocity)) {
    setState(player, State.Idle);
  } else {
    setState(player, State.Walk);
    if (player.velocity.x > 0) {
      setDirection(player, Direction.Right);
    } else if (player.velocity.x < 0) {
      setDirection(player, Direction.Left);
    } else if (player.velocity.y > 0) {
      setDirection(player, Direction.Down);
    } else if (player.velocity.y < 0) {
      setDirection(player, Direction.Up);
    }
  }
}
