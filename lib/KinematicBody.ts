import {
  renderCircle,
  renderRectangle,
  ShapeType,
  type StaticBody,
  type Circle,
  type Rectangle,
} from "./StaticBody.ts";
import { isZero, type Vector } from "./Vector.ts";

const defaultFillStyle = "rgba(64, 64, 255, 0.5)";
const defaultCollisionHandler = (): void => {};
const defaultUpdateHandler = (): void => {};

export type KinematicBody<Shape> = StaticBody<Shape> & {
  velocity: Vector;
  onUpdate: (self: KinematicBody<Shape>) => void;
  onCollision: (
    self: KinematicBody<Shape>,
    other:
      | KinematicBody<Circle>
      | KinematicBody<Rectangle>
      | StaticBody<Circle>
      | StaticBody<Rectangle>,
  ) => void;
};

export function createKinemeticCircle(
  origin: Vector,
  radius: number,
  velocity: Vector = { x: 0, y: 0 },
  onUpdate: KinematicBody<Circle>["onUpdate"] = defaultUpdateHandler,
  onCollision: KinematicBody<Circle>["onCollision"] = defaultCollisionHandler,
): KinematicBody<Circle> {
  return {
    type: ShapeType.Circle,
    shape: { radius },
    origin,
    velocity,
    onUpdate,
    onCollision,
  };
}

export function createKinemeticRectangle(
  origin: Vector,
  width: number,
  height: number,
  velocity: Vector = { x: 0, y: 0 },
  onUpdate: KinematicBody<Rectangle>["onUpdate"] = defaultUpdateHandler,
  onCollision: KinematicBody<Rectangle>["onCollision"] = defaultCollisionHandler,
): KinematicBody<Rectangle> {
  return {
    type: ShapeType.Rectangle,
    shape: { width, height },
    origin,
    velocity,
    onUpdate,
    onCollision,
  };
}

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
  kinematicBodies: Array<KinematicBody<Circle> | KinematicBody<Rectangle>>,
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

export function updateKinematicBody(
  body: KinematicBody<Circle> | KinematicBody<Rectangle>,
  friction: number = 1,
): void {
  body.velocity.x *= friction;
  body.velocity.y *= friction;

  body.velocity.x = Math.abs(body.velocity.x) < 0.01 ? 0 : body.velocity.x;
  body.velocity.y = Math.abs(body.velocity.y) < 0.01 ? 0 : body.velocity.y;

  body.origin.x += body.velocity.x;
  body.origin.y += body.velocity.y;

  body.onUpdate(body);
}

export function processCircleCollision(
  circleA: KinematicBody<Circle>,
  circleB: KinematicBody<Circle>,
): void {
  const dx = circleA.origin.x - circleB.origin.x;
  const dy = circleA.origin.y - circleB.origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circleA.shape.radius + circleB.shape.radius && distance > 0) {
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

    circleA.onCollision(circleA, circleB);
    circleB.onCollision(circleB, circleA);
  }
}

export function processRectangleCollision(
  rectangleA: KinematicBody<Rectangle>,
  rectangleB: KinematicBody<Rectangle>,
): void {
  const rectangleARight = rectangleA.origin.x + rectangleA.shape.width;
  const rectangleABottom = rectangleA.origin.y + rectangleA.shape.height;
  const rectangleBRight = rectangleB.origin.x + rectangleB.shape.width;
  const rectangleBBottom = rectangleB.origin.y + rectangleB.shape.height;

  if (
    rectangleA.origin.x < rectangleBRight &&
    rectangleB.origin.x < rectangleARight &&
    rectangleA.origin.y < rectangleBBottom &&
    rectangleB.origin.y < rectangleABottom
  ) {
    const overlapXRight = rectangleARight - rectangleB.origin.x;
    const overlapXLeft = rectangleBRight - rectangleA.origin.x;
    const overlapX =
      overlapXRight < overlapXLeft ? -overlapXRight : overlapXLeft;

    const overlapYBottom = rectangleABottom - rectangleB.origin.y;
    const overlapYTop = rectangleBBottom - rectangleA.origin.y;
    const overlapY =
      overlapYBottom < overlapYTop ? -overlapYBottom : overlapYTop;

    if (Math.abs(overlapX) > Math.abs(overlapY)) {
      const overlap = overlapY / 2;
      rectangleA.origin.y += overlap;
      rectangleB.origin.y -= overlap;

      const dvy = rectangleA.velocity.y - rectangleB.velocity.y;
      const absOverlap = Math.abs(overlap);
      rectangleA.velocity.y -= dvy * absOverlap ** 2;
      rectangleB.velocity.y += dvy * absOverlap ** 2;
    } else {
      const overlap = overlapX / 2;
      rectangleA.origin.x += overlap;
      rectangleB.origin.x -= overlap;

      const dvx = rectangleA.velocity.x - rectangleB.velocity.x;
      const absOverlap = Math.abs(overlap);
      rectangleA.velocity.x -= dvx * absOverlap ** 2;
      rectangleB.velocity.x += dvx * absOverlap ** 2;
    }

    rectangleA.onCollision(rectangleA, rectangleB);
    rectangleB.onCollision(rectangleB, rectangleA);
  }
}

export function processCircleAndRectangleCollision(
  circle: KinematicBody<Circle>,
  rectangle: KinematicBody<Rectangle>,
): void {
  const dx =
    circle.origin.x -
    Math.max(
      rectangle.origin.x,
      Math.min(circle.origin.x, rectangle.origin.x + rectangle.shape.width),
    );
  const dy =
    circle.origin.y -
    Math.max(
      rectangle.origin.y,
      Math.min(circle.origin.y, rectangle.origin.y + rectangle.shape.height),
    );
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circle.shape.radius && distance > 0) {
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

    circle.onCollision(circle, rectangle);
    rectangle.onCollision(rectangle, circle);
  }
}

export function processCircleOnStaticCircleCollision(
  circleA: KinematicBody<Circle>,
  circleB: StaticBody<Circle>,
): void {
  const dx = circleA.origin.x + circleA.velocity.x - circleB.origin.x;
  const dy = circleA.origin.y + circleA.velocity.y - circleB.origin.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circleA.shape.radius + circleB.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - circleB.shape.radius - circleA.shape.radius;

    circleA.origin.x -= normalX * overlap;
    circleA.origin.y -= normalY * overlap;

    const dot = circleA.velocity.x * normalX + circleA.velocity.y * normalY;
    circleA.velocity.x -= dot * normalX;
    circleA.velocity.y -= dot * normalY;

    circleA.onCollision(circleA, circleB);
    circleB.onCollision(circleB, circleA);
  }
}

export function processRectangleOnStaticRectiangleCollision(
  rectangleA: KinematicBody<Rectangle>,
  rectangleB: StaticBody<Rectangle>,
): void {
  const rectangleARight = rectangleA.origin.x + rectangleA.shape.width;
  const rectangleABottom = rectangleA.origin.y + rectangleA.shape.height;
  const rectangleBRight = rectangleB.origin.x + rectangleB.shape.width;
  const rectangleBBottom = rectangleB.origin.y + rectangleB.shape.height;

  if (
    rectangleA.origin.x < rectangleBRight &&
    rectangleB.origin.x < rectangleARight &&
    rectangleA.origin.y < rectangleBBottom &&
    rectangleB.origin.y < rectangleABottom
  ) {
    const overlapXRight = rectangleARight - rectangleB.origin.x;
    const overlapXLeft = rectangleBRight - rectangleA.origin.x;
    const overlapX =
      overlapXRight < overlapXLeft ? -overlapXRight : overlapXLeft;

    const overlapYBottom = rectangleABottom - rectangleB.origin.y;
    const overlapYTop = rectangleBBottom - rectangleA.origin.y;
    const overlapY =
      overlapYBottom < overlapYTop ? -overlapYBottom : overlapYTop;

    if (Math.abs(overlapX) > Math.abs(overlapY)) {
      const overlap = overlapY / 2;
      rectangleA.origin.y += overlap;

      const absOverlap = Math.abs(overlap);
      rectangleA.velocity.y -= rectangleA.velocity.y * absOverlap ** 2;
    } else {
      const overlap = overlapX / 2;
      rectangleA.origin.x += overlap;

      const absOverlap = Math.abs(overlap);
      rectangleA.velocity.x -= rectangleA.velocity.x * absOverlap ** 2;
    }

    rectangleA.onCollision(rectangleA, rectangleB);
    rectangleB.onCollision(rectangleB, rectangleA);
  }
}

export function processCircleOnStaticRectangleCollision(
  circle: KinematicBody<Circle>,
  rectangle: StaticBody<Rectangle>,
): void {
  const dx =
    circle.origin.x -
    Math.max(
      rectangle.origin.x,
      Math.min(circle.origin.x, rectangle.origin.x + rectangle.shape.width),
    );
  const dy =
    circle.origin.y -
    Math.max(
      rectangle.origin.y,
      Math.min(circle.origin.y, rectangle.origin.y + rectangle.shape.height),
    );
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circle.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - circle.shape.radius;

    circle.origin.x -= normalX * overlap;
    circle.origin.y -= normalY * overlap;

    const dot = circle.velocity.x * normalX + circle.velocity.y * normalY;
    circle.velocity.x -= dot * normalX;
    circle.velocity.y -= dot * normalY;

    circle.onCollision(circle, rectangle);
    rectangle.onCollision(rectangle, circle);
  }
}

export function processRectangleOnStaticCircleCollision(
  rectangle: KinematicBody<Rectangle>,
  circle: StaticBody<Circle>,
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

  if (distance < circle.shape.radius && distance > 0) {
    const normalX = dx / distance;
    const normalY = dy / distance;
    const overlap = distance - circle.shape.radius;

    rectangle.origin.x += normalX * overlap;
    rectangle.origin.y += normalY * overlap;

    const dot = rectangle.velocity.x * normalX + rectangle.velocity.y * normalY;
    rectangle.velocity.x -= dot * normalX;
    rectangle.velocity.y -= dot * normalY;

    rectangle.onCollision(rectangle, circle);
    circle.onCollision(circle, rectangle);
  }
}

export function handleCircleCollisions(
  circle: KinematicBody<Circle>,
  staticBodies: Array<StaticBody<Circle> | StaticBody<Rectangle>>,
): void {
  for (const staticBody of staticBodies) {
    switch (staticBody.type) {
      case ShapeType.Circle:
        processCircleOnStaticCircleCollision(
          circle,
          staticBody as StaticBody<Circle>,
        );

        break;
      case ShapeType.Rectangle:
        processCircleOnStaticRectangleCollision(
          circle,
          staticBody as StaticBody<Rectangle>,
        );

        break;
    }
  }
}

export function handleKinematicCircleCollisions(
  circle: KinematicBody<Circle>,
  kinematicBodies: Array<KinematicBody<Circle> | KinematicBody<Rectangle>>,
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
  staticBodies: Array<StaticBody<Circle> | StaticBody<Rectangle>>,
): void {
  for (const staticBody of staticBodies) {
    switch (staticBody.type) {
      case ShapeType.Circle:
        processRectangleOnStaticCircleCollision(
          rectangle,
          staticBody as StaticBody<Circle>,
        );

        break;
      case ShapeType.Rectangle:
        processRectangleOnStaticRectiangleCollision(
          rectangle,
          staticBody as StaticBody<Rectangle>,
        );

        break;
    }
  }
}

export function handleKinematicRectangleCollisions(
  rectangle: KinematicBody<Rectangle>,
  kinematicBodies: Array<KinematicBody<Circle> | KinematicBody<Rectangle>>,
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
  activeBodies: Array<KinematicBody<Circle> | KinematicBody<Rectangle>>,
  staticBodies: Array<StaticBody<Circle> | StaticBody<Rectangle>>,
  kinematicBodies: Array<KinematicBody<Circle> | KinematicBody<Rectangle>>,
): void {
  for (const activeBody of activeBodies) {
    switch (activeBody.type) {
      case ShapeType.Circle: {
        handleCircleCollisions(
          activeBody as KinematicBody<Circle>,
          staticBodies,
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
          staticBodies,
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

export function setActiveKinematicBodies(
  activeBodies: Array<KinematicBody<Circle> | KinematicBody<Rectangle>>,
  kinematicBodies: Array<KinematicBody<Circle> | KinematicBody<Rectangle>>,
): void {
  activeBodies.length = 0;
  for (const kinematicBody of kinematicBodies) {
    if (!isZero(kinematicBody.velocity)) {
      activeBodies.push(kinematicBody);
    }
  }
}
