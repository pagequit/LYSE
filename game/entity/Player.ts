import {
  animateSprite,
  createSprite,
  setXFrame,
  setYFrame,
  type Sprite,
} from "../../engine/system/Sprite.ts";
import {
  getDirection,
  isZero,
  normalize,
  type Vector,
} from "../../engine/lib/Vector.ts";
import { type Input } from "../../engine/system/Input.ts";

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
    imageSrc: "/player-walk.png",
    width: 64,
    height: 64,
    frameDuraton: 1000 / 4,
    frameWidth: 16,
    frameHeight: 16,
    xFrames: 4,
    yFrames: 4,
  }),
  [State.Idle]: createSprite({
    imageSrc: "/player-idle.png",
    width: 64,
    height: 64,
    frameDuraton: 1000 / 1,
    frameWidth: 16,
    frameHeight: 16,
    xFrames: 2,
    yFrames: 4,
  }),
};

export function createPlayer(position: Vector): Player {
  return {
    position,
    state: State.Idle,
    direction: Direction.Right,
    velocity: { x: 0, y: 0 },
    animations,
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
  animateSprite(player.animations[player.state], ctx, delta, player.position);
}

export function processPlayer(
  player: Player,
  input: Input,
  delta: number,
): void {
  player.velocity.x = input.vector.x;
  player.velocity.y = input.vector.y;

  player.position.x += 0.25 * player.velocity.x * delta;
  player.position.y += 0.25 * player.velocity.y * delta;

  if (isZero(player.velocity)) {
    setState(player, State.Idle);
  } else {
    setState(player, State.Walk);

    const direction = getDirection(player.velocity) / Math.PI + 1;
    if (direction > 0.25 && direction < 0.75) {
      setDirection(player, Direction.Up);
    } else if (direction >= 0.75 && direction <= 1.25) {
      setDirection(player, Direction.Right);
    } else if (direction > 1.25 && direction < 1.75) {
      setDirection(player, Direction.Down);
    } else {
      setDirection(player, Direction.Left);
    }
  }
}
