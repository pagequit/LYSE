import {
  animateSprite,
  createSprite,
  setXFrame,
  setYFrame,
  type Sprite,
} from "../../engine/system/Sprite.ts";
import { getDirection, isZero, type Vector } from "../../engine/lib/Vector.ts";
import { input } from "../../engine/system/Input.ts";
import {
  type CollisionShape,
  createCollisionShape,
} from "../../engine/lib/CollisionShape.ts";

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
  animations: Record<State, Sprite>;
  collisionShape: CollisionShape;
};

export function createPlayer(position: Vector): Player {
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
      frameDuraton: 1000 / 2,
      frameWidth: 16,
      frameHeight: 16,
      xFrames: 2,
      yFrames: 4,
    }),
  };

  return {
    position,
    state: State.Idle,
    direction: Direction.Right,
    velocity: { x: 0, y: 0 },
    speedMultiplier: 0.25,
    animations,
    collisionShape: createCollisionShape(position),
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
  animateSprite(player.animations[player.state], ctx, delta, {
    x: player.position.x - player.animations[player.state].width / 2,
    y: player.position.y - player.animations[player.state].height / 2 - 8,
  });
}

export function processPlayer(
  player: Player,
  collisionShapes: Array<CollisionShape>,
  delta: number,
): void {
  player.velocity.x = input.vector.x;
  player.velocity.y = input.vector.y;

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

    player.position.x += input.vector.x * delta * player.speedMultiplier;
    player.position.y += input.vector.y * delta * player.speedMultiplier;

    for (let i = 0; i < collisionShapes.length; i++) {
      const dx = player.position.x - collisionShapes[i].position.x;
      const dy = player.position.y - collisionShapes[i].position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // all shapes are circles with a radius of 16 for now
      if (distance <= 32) {
        player.position.x += dx / 16;
        player.position.y += dy / 16;
      }
    }
  }
}
