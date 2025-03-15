import {
  animateSprite,
  createSprite,
  setXFrame,
  setYFrame,
  type Sprite,
} from "../../engine/Sprite.ts";
import { getDirection, isZero, type Vector } from "../../engine/Vector.ts";
import { input } from "../../engine/Input.ts";
import {
  type CollisionBody,
  type Circle,
  type Rectangle,
  createCollisionCircle,
  ShapeType,
} from "../../engine/CollisionBody.ts";
import {
  createKinemeticCircle,
  type KinematicBody,
  processCircleCollisionKinematics,
  processCircleRectangleCollisionKinematics,
} from "../../engine/KinematicBody.ts";

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
    [State.Walk]: Sprite;
    [State.Idle]: Sprite;
  };
  collisionBody: CollisionBody<Circle>;
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
    speedMultiplier: 0.25,
    animations: {
      [State.Idle]: createSprite({
        imageSrc: "/player-idle.png",
        width,
        height,
        frameDuraton: 1000 / 2,
        frameWidth: 16,
        frameHeight: 16,
        xFrames: 2,
        yFrames: 4,
      }),
      [State.Walk]: createSprite({
        imageSrc: "/player-walk.png",
        width,
        height,
        frameDuraton: 1000 / 4,
        frameWidth: 16,
        frameHeight: 16,
        xFrames: 4,
        yFrames: 4,
      }),
    },
    collisionBody: createCollisionCircle(position, width * 0.25),
    kinematicBody: createKinemeticCircle(position, width * 0.25, velocity),
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
  animateSprite(
    player.animations[player.state],
    {
      x: player.position.x - player.animations[player.state].width * 0.5,
      y: player.position.y - player.animations[player.state].height * 0.625,
    },
    ctx,
    delta,
  );
}

function processCircleCollision(
  player: Player,
  circle: CollisionBody<Circle>,
): void {
  const dx = player.position.x + player.velocity.x - circle.origin.x;
  const dy = player.position.y + player.velocity.y - circle.origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (
    distance <= player.collisionBody.shape.radius + circle.shape.radius &&
    distance > 0
  ) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap =
      distance - circle.shape.radius - player.collisionBody.shape.radius;

    player.velocity.x -= normalX * overlap;
    player.velocity.y -= normalY * overlap;
  }
}

function processRectangleCollision(
  player: Player,
  rectangle: CollisionBody<Rectangle>,
): void {
  const dx =
    player.position.x +
    player.velocity.x -
    Math.max(
      rectangle.origin.x,
      Math.min(player.position.x, rectangle.origin.x + rectangle.shape.width),
    );
  const dy =
    player.position.y +
    player.velocity.y -
    Math.max(
      rectangle.origin.y,
      Math.min(player.position.y, rectangle.origin.y + rectangle.shape.height),
    );
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= player.collisionBody.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - player.collisionBody.shape.radius;

    player.velocity.x -= normalX * overlap;
    player.velocity.y -= normalY * overlap;
  }
}

export function processPlayer(
  player: Player,
  collisionBodies: Array<CollisionBody<Circle | Rectangle>>,
  kinematicBodies: Array<KinematicBody<Circle | Rectangle>>,
  delta: number,
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

  player.velocity.x = input.vector.x * delta * player.speedMultiplier;
  player.velocity.y = input.vector.y * delta * player.speedMultiplier;

  for (const shape of collisionBodies) {
    switch (shape.type) {
      case ShapeType.Circle: {
        processCircleCollision(player, shape as CollisionBody<Circle>);
        break;
      }
      case ShapeType.Rectangle: {
        processRectangleCollision(player, shape as CollisionBody<Rectangle>);
        break;
      }
    }
  }

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;

  for (const shape of kinematicBodies) {
    switch (shape.type) {
      case ShapeType.Circle: {
        processCircleCollisionKinematics(
          player.kinematicBody,
          shape as KinematicBody<Circle>,
        );
        break;
      }
      case ShapeType.Rectangle: {
        processCircleRectangleCollisionKinematics(
          player.kinematicBody,
          shape as KinematicBody<Rectangle>,
        );
        break;
      }
    }
  }
}
