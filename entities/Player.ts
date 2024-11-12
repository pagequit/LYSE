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
  // TODO: fix me the internal direction is pointless
  setYFrame(player.animations[State.Idle], direction);
  setYFrame(player.animations[State.Walk], direction);
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
  input: Record<string, () => number>,
): void {
  player.velocity.x = input.getActionKeyRight() - input.getActionKeyLeft();
  player.velocity.y = input.getActionKeyDown() - input.getActionKeyUp();

  normalize(player.velocity);

  player.position.x += 0.25 * player.velocity.x * delta;
  player.position.y += 0.25 * player.velocity.y * delta;

  if (player.velocity.x === 0 && player.velocity.y === 0) {
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
