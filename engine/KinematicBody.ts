import {
  renderCircle,
  renderRectangle,
  ShapeType,
  type CollisionBody,
  type Circle,
  type Rectangle,
} from "./CollisionBody.ts";
import { type Vector } from "./Vector.ts";

const defaultFillStyle = "rgba(64, 64, 255, 0.5)";

export type KinematicBody<Shape> = CollisionBody<Shape> & {
  velocity: Vector;
};

export function renderKinemeticCircle(
  body: KinematicBody<Circle>,
  ctx: CanvasRenderingContext2D,
  fillStyle: string = defaultFillStyle,
): void {
  renderCircle(body, ctx, fillStyle);
}

export function renderKinemeticRectangle(
  body: KinematicBody<Rectangle>,
  ctx: CanvasRenderingContext2D,
  fillStyle: string = defaultFillStyle,
): void {
  renderRectangle(body, ctx, fillStyle);
}

export function renderKinematicBodies(
  kinematicBodies: Array<KinematicBody<Circle | Rectangle>>,
  ctx: CanvasRenderingContext2D,
): void {
  for (const body of kinematicBodies) {
    switch (body.type) {
      case ShapeType.Circle: {
        renderKinemeticCircle(body as KinematicBody<Circle>, ctx);
        break;
      }
      case ShapeType.Rectangle: {
        renderKinemeticRectangle(body as KinematicBody<Rectangle>, ctx);
        break;
      }
    }
  }
}

export function createKinemeticCircle(
  origin: Vector,
  radius: number,
  velocity: Vector = { x: 0, y: 0 },
): KinematicBody<Circle> {
  return {
    type: ShapeType.Circle,
    shape: { radius },
    origin,
    velocity,
  };
}

export function createKinemeticRectangle(
  origin: Vector,
  width: number,
  height: number,
  velocity: Vector = { x: 0, y: 0 },
): KinematicBody<Rectangle> {
  return {
    type: ShapeType.Rectangle,
    shape: { width, height },
    origin,
    velocity,
  };
}

export function updateKinematicBody(
  body: KinematicBody<Circle | Rectangle>,
  delta: number,
  friction: number = 1,
): void {
  body.origin.x += body.velocity.x * delta * 0.25;
  body.origin.y += body.velocity.y * delta * 0.25;
  body.velocity.x =
    Math.abs(body.velocity.x) < 0.01 ? 0 : body.velocity.x * friction;
  body.velocity.y =
    Math.abs(body.velocity.y) < 0.01 ? 0 : body.velocity.y * friction;
}

export function processCircleCollision(
  circleA: KinematicBody<Circle>,
  circleB: KinematicBody<Circle>,
): void {
  const dx = circleA.origin.x - circleB.origin.x;
  const dy = circleA.origin.y - circleB.origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= circleA.shape.radius + circleB.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap =
      (distance - circleA.shape.radius - circleB.shape.radius) / 2;

    circleA.origin.x -= normalX * overlap;
    circleA.origin.y -= normalY * overlap;
    circleB.origin.x += normalX * overlap;
    circleB.origin.y += normalY * overlap;

    const dvx = circleA.velocity.x - circleB.velocity.x;
    const dvy = circleA.velocity.y - circleB.velocity.y;
    const dot = dvx * normalX + dvy * normalY;

    circleA.velocity.x -= dot * normalX;
    circleA.velocity.y -= dot * normalY;
    circleB.velocity.x += dot * normalX;
    circleB.velocity.y += dot * normalY;
  }
}

export function processRectangleCollision(
  rectangleA: KinematicBody<Rectangle>,
  rectangleB: KinematicBody<Rectangle>,
): void {
  const rectangleAX = rectangleA.origin.x + rectangleA.velocity.x;
  const rectangleAY = rectangleA.origin.y + rectangleA.velocity.y;

  const rectangleBX = rectangleB.origin.x + rectangleB.velocity.x;
  const rectangleBY = rectangleB.origin.y + rectangleB.velocity.y;

  const rectangleARight = rectangleAX + rectangleA.shape.width;
  const rectangleABottom = rectangleAY + rectangleA.shape.height;

  const rectangleBRight = rectangleBX + rectangleB.shape.width;
  const rectangleBBottom = rectangleBY + rectangleB.shape.height;

  if (
    rectangleAX < rectangleBRight &&
    rectangleBX < rectangleARight &&
    rectangleAY < rectangleBBottom &&
    rectangleBY < rectangleABottom
  ) {
    const overlapXRight = rectangleARight - rectangleB.origin.x;
    const overlapXLeft = rectangleBRight - rectangleAX;
    const overlapX =
      overlapXRight < overlapXLeft ? -overlapXRight : overlapXLeft;

    const overlapYBottom = rectangleABottom - rectangleB.origin.y;
    const overlapYTop = rectangleBBottom - rectangleAY;
    const overlapY =
      overlapYBottom < overlapYTop ? -overlapYBottom : overlapYTop;

    if (Math.abs(overlapX) > Math.abs(overlapY)) {
      rectangleA.velocity.y += overlapY / 2;
      rectangleB.velocity.y -= overlapY / 2;
    } else {
      rectangleA.velocity.x += overlapX / 2;
      rectangleB.velocity.x -= overlapX / 2;
    }
  }
}

export function processCircleAndRectangleCollision(
  circle: KinematicBody<Circle>,
  rectangle: KinematicBody<Rectangle>,
): void {
  const dx =
    circle.origin.x +
    circle.velocity.x -
    Math.max(
      rectangle.origin.x,
      Math.min(circle.origin.x, rectangle.origin.x + rectangle.shape.width),
    );
  const dy =
    circle.origin.y +
    circle.velocity.y -
    Math.max(
      rectangle.origin.y,
      Math.min(circle.origin.y, rectangle.origin.y + rectangle.shape.height),
    );
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= circle.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = (distance - circle.shape.radius) / 2;

    circle.origin.x -= normalX * overlap;
    circle.origin.y -= normalY * overlap;
    rectangle.origin.x += normalX * overlap;
    rectangle.origin.y += normalY * overlap;

    const dvx = circle.velocity.x - rectangle.velocity.x;
    const dvy = circle.velocity.y - rectangle.velocity.y;
    const dot = dvx * normalX + dvy * normalY;

    circle.velocity.x -= dot * normalX;
    circle.velocity.y -= dot * normalY;
    rectangle.velocity.x += dot * normalX;
    rectangle.velocity.y += dot * normalY;
  }
}

export function processCircleOnStaticCircleCollision(
  circleA: KinematicBody<Circle>,
  circleB: CollisionBody<Circle>,
): void {
  const dx = circleA.origin.x + circleA.velocity.x - circleB.origin.x;
  const dy = circleA.origin.y + circleA.velocity.y - circleB.origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= circleA.shape.radius + circleB.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - circleB.shape.radius - circleA.shape.radius;

    circleA.velocity.x -= normalX * overlap;
    circleA.velocity.y -= normalY * overlap;
  }
}

export function processRectangleOnStaticRectiangleCollision(
  rectangleA: KinematicBody<Rectangle>,
  rectangleB: CollisionBody<Rectangle>,
): void {
  const rectangleAX = rectangleA.origin.x + rectangleA.velocity.x;
  const rectangleAY = rectangleA.origin.y + rectangleA.velocity.y;

  const rectangleARight = rectangleAX + rectangleA.shape.width;
  const rectangleABottom = rectangleAY + rectangleA.shape.height;

  const rectangleBRight = rectangleB.origin.x + rectangleB.shape.width;
  const rectangleBBottom = rectangleB.origin.y + rectangleB.shape.height;

  if (
    rectangleAX < rectangleBRight &&
    rectangleARight > rectangleB.origin.x &&
    rectangleAY < rectangleBBottom &&
    rectangleABottom > rectangleB.origin.y
  ) {
    const overlapXRight = rectangleARight - rectangleB.origin.x;
    const overlapXLeft = rectangleBRight - rectangleAX;
    const overlapX =
      overlapXRight < overlapXLeft ? -overlapXRight : overlapXLeft;

    const overlapYBottom = rectangleABottom - rectangleB.origin.y;
    const overlapYTop = rectangleBBottom - rectangleAY;
    const overlapY =
      overlapYBottom < overlapYTop ? -overlapYBottom : overlapYTop;

    if (Math.abs(overlapX) > Math.abs(overlapY)) {
      rectangleA.velocity.y += overlapY;
    } else {
      rectangleA.velocity.x += overlapX;
    }
  }
}

export function processCircleOnStaticRectangleCollision(
  circle: KinematicBody<Circle>,
  rectangle: CollisionBody<Rectangle>,
): void {
  const dx =
    circle.origin.x +
    circle.velocity.x -
    Math.max(
      rectangle.origin.x,
      Math.min(circle.origin.x, rectangle.origin.x + rectangle.shape.width),
    );
  const dy =
    circle.origin.y +
    circle.velocity.y -
    Math.max(
      rectangle.origin.y,
      Math.min(circle.origin.y, rectangle.origin.y + rectangle.shape.height),
    );
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= circle.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - circle.shape.radius;

    circle.velocity.x -= normalX * overlap;
    circle.velocity.y -= normalY * overlap;
  }
}

export function processRectangleOnStaticCircleCollision(
  rectangle: KinematicBody<Rectangle>,
  circle: CollisionBody<Circle>,
): void {
  const rectangleX = rectangle.origin.x + rectangle.velocity.x;
  const rectangleY = rectangle.origin.y + rectangle.velocity.y;

  const dx =
    circle.origin.x -
    Math.max(
      rectangleX,
      Math.min(circle.origin.x, rectangleX + rectangle.shape.width),
    );
  const dy =
    circle.origin.y -
    Math.max(
      rectangleY,
      Math.min(circle.origin.y, rectangleY + rectangle.shape.height),
    );
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= circle.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - circle.shape.radius;

    rectangle.velocity.x += normalX * overlap;
    rectangle.velocity.y += normalY * overlap;
  }
}

export function handleCircleCollisions(
  circle: KinematicBody<Circle>,
  collisionBodies: Array<CollisionBody<Circle | Rectangle>>,
): void {
  for (const collisionBody of collisionBodies) {
    switch (collisionBody.type) {
      case ShapeType.Circle:
        processCircleOnStaticCircleCollision(
          circle,
          collisionBody as CollisionBody<Circle>,
        );
        break;
      case ShapeType.Rectangle:
        processCircleOnStaticRectangleCollision(
          circle,
          collisionBody as CollisionBody<Rectangle>,
        );
        break;
    }
  }
}

export function handleKinematicCircleCollisions(
  circle: KinematicBody<Circle>,
  kinematicBodies: Array<KinematicBody<Circle | Rectangle>>,
): void {
  for (const kinematicBody of kinematicBodies) {
    switch (kinematicBody.type) {
      case ShapeType.Circle:
        processCircleCollision(circle, kinematicBody as KinematicBody<Circle>);
        break;
      case ShapeType.Rectangle:
        processCircleAndRectangleCollision(
          circle,
          kinematicBody as KinematicBody<Rectangle>,
        );
        break;
    }
  }
}

export function handleRectangleCollisions(
  rectangle: KinematicBody<Rectangle>,
  collisionBodies: Array<CollisionBody<Circle | Rectangle>>,
): void {
  for (const collisionBody of collisionBodies) {
    switch (collisionBody.type) {
      case ShapeType.Circle:
        processRectangleOnStaticCircleCollision(
          rectangle,
          collisionBody as CollisionBody<Circle>,
        );
        break;
      case ShapeType.Rectangle:
        processRectangleOnStaticRectiangleCollision(
          rectangle,
          collisionBody as CollisionBody<Rectangle>,
        );
        break;
    }
  }
}

export function handleKinematicRectangleCollisions(
  rectangle: KinematicBody<Rectangle>,
  kinematicBodies: Array<KinematicBody<Circle | Rectangle>>,
): void {
  for (const kinematicBody of kinematicBodies) {
    switch (kinematicBody.type) {
      case ShapeType.Circle:
        processCircleAndRectangleCollision(
          kinematicBody as KinematicBody<Circle>,
          rectangle,
        );
        break;
      case ShapeType.Rectangle:
        processRectangleCollision(
          rectangle,
          kinematicBody as KinematicBody<Rectangle>,
        );
        break;
    }
  }
}

export function processKinematicBodies(
  activeBodies: Array<KinematicBody<Circle | Rectangle>>,
  collisionBodies: Array<CollisionBody<Circle | Rectangle>>,
  kinematicBodies: Array<KinematicBody<Circle | Rectangle>>,
): void {
  for (const activeBody of activeBodies) {
    switch (activeBody.type) {
      case ShapeType.Circle: {
        handleCircleCollisions(
          activeBody as KinematicBody<Circle>,
          collisionBodies,
        );
        handleKinematicCircleCollisions(
          activeBody as KinematicBody<Circle>,
          kinematicBodies,
        );
        break;
      }
      case ShapeType.Rectangle: {
        handleRectangleCollisions(
          activeBody as KinematicBody<Rectangle>,
          collisionBodies,
        );
        handleKinematicRectangleCollisions(
          activeBody as KinematicBody<Rectangle>,
          kinematicBodies,
        );
        break;
      }
    }
  }
}
