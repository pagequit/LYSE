import {
  applyTouchControls,
  removeTouchControls,
} from "../../engine/TouchControls.ts";
import { pointer } from "../../engine/Pointer.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  type Player,
  processPlayer,
  setDirection,
} from "../entities/Player.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import {
  changeScene,
  createScene,
  type Scene,
  setSceneCameraPosition,
} from "../../engine/Scene.ts";
import nodeScene from "./nodeScene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import {
  createCollisionCircle,
  createCollisionRectangle,
  renderCircle,
  renderRectangle,
  ShapeType,
  type Circle,
  type CollisionBody,
  type Rectangle,
} from "../../engine/CollisionBody.ts";
import {
  createKinemeticCircle,
  createKinemeticRectangle,
  processCircleCollisionKinematics,
  processCircleRectangleCollisionKinematics,
  processCircleCollision,
  processCircleRectangleCollision,
  renderKinemeticCircle,
  renderKinemeticRectangle,
  updateKinematicBody,
  type KinematicBody,
} from "../../engine/KinematicBody.ts";
import { isZero } from "../../engine/Vector.ts";

function renderCollisionBodies(
  collisionBodies: Array<CollisionBody<Circle | Rectangle>>,
  ctx: CanvasRenderingContext2D,
): void {
  for (const body of collisionBodies) {
    switch (body.type) {
      case ShapeType.Circle: {
        renderCircle(body as CollisionBody<Circle>, ctx);
        break;
      }
      case ShapeType.Rectangle: {
        renderRectangle(body as CollisionBody<Rectangle>, ctx);
        break;
      }
    }
  }
}

function renderKinematicBodies(
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

const scene: Scene = createScene(process, {
  width: 2048,
  height: 1152,
  construct,
  destruct,
});

const grid: Grid = createGrid(scene.width, scene.height, 64);
const pointerNode = createNode(pointer.position);
const isTouchDevice = self.navigator.maxTouchPoints > 0;

function handleEscape({ key }: KeyboardEvent): void {
  if (key === "Escape") {
    changeScene(nodeScene);
  }
}

function construct(): void {
  self.addEventListener("keyup", handleEscape);
  if (isTouchDevice) {
    applyTouchControls();
  }
}

function destruct(): void {
  self.removeEventListener("keyup", handleEscape);
  if (isTouchDevice) {
    removeTouchControls();
  }
}

const player: Player = createPlayer(
  { x: (scene.width - 64) / 2, y: (scene.height - 64) / 2 + 16 },
  64,
  64,
);
setDirection(player, Direction.Right);

const collisionCircle = createCollisionCircle(
  { x: scene.width / 2, y: scene.height / 2 - 128 },
  32,
);

const collisionRectangle = createCollisionRectangle(
  { x: scene.width / 2, y: scene.height / 2 - 128 },
  64,
  64,
);

const kinematicRectangle = createKinemeticRectangle(
  { x: scene.width / 2 - 96, y: scene.height / 2 + 64 },
  128,
  64,
);

const kiniematicCircle = createKinemeticCircle(
  { x: scene.width / 2, y: scene.height / 2 + 256 },
  32,
);

const collisionBodies = [collisionRectangle, collisionCircle];
const kinematicBodies = [
  player.kinematicBody,
  kinematicRectangle,
  kiniematicCircle,
];

const activeKinematicBodies: Array<KinematicBody<Circle | Rectangle>> = [];

function handleCircleCollisions(
  circle: KinematicBody<Circle>,
  collisionBodies: Array<CollisionBody<Circle | Rectangle>>,
): void {
  for (const collisionBody of collisionBodies) {
    switch (collisionBody.type) {
      case ShapeType.Circle:
        processCircleCollision(circle, collisionBody as CollisionBody<Circle>);
        break;
      case ShapeType.Rectangle:
        processCircleRectangleCollision(
          circle,
          collisionBody as CollisionBody<Rectangle>,
        );
        break;
    }
  }
}

function handleKinematicCircleCollisions(
  circle: KinematicBody<Circle>,
  kinematicBodies: Array<KinematicBody<Circle | Rectangle>>,
): void {
  for (const kinematicBody of kinematicBodies) {
    switch (kinematicBody.type) {
      case ShapeType.Circle:
        processCircleCollisionKinematics(
          circle,
          kinematicBody as KinematicBody<Circle>,
        );
        break;
      case ShapeType.Rectangle:
        processCircleRectangleCollisionKinematics(
          circle,
          kinematicBody as KinematicBody<Rectangle>,
        );
        break;
    }
  }
}

function handleRectangleCollisions(
  rectangle: KinematicBody<Rectangle>,
  collisionBodies: Array<CollisionBody<Circle | Rectangle>>,
): void {
  for (const collisionBody of collisionBodies) {
    switch (collisionBody.type) {
      case ShapeType.Circle:
        break;
      case ShapeType.Rectangle:
        break;
    }
  }
}

function handleKinematicRectangleCollisions(
  rectangle: KinematicBody<Rectangle>,
  kinematicBodies: Array<KinematicBody<Circle | Rectangle>>,
): void {
  for (const kinematicBody of kinematicBodies) {
    switch (kinematicBody.type) {
      case ShapeType.Circle:
        processCircleRectangleCollisionKinematics(
          kinematicBody as KinematicBody<Circle>,
          rectangle,
        );
        break;
      case ShapeType.Rectangle:
        break;
    }
  }
}

function processKinematicBodies(
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

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  processPlayer(player);

  activeKinematicBodies.length = 0;
  for (const body of kinematicBodies) {
    if (!isZero(body.velocity)) {
      activeKinematicBodies.push(body);
    }
  }

  processKinematicBodies(
    activeKinematicBodies,
    collisionBodies,
    kinematicBodies,
  );

  for (const body of kinematicBodies) {
    updateKinematicBody(body, delta, 0.99);
  }

  renderCollisionBodies(collisionBodies, ctx);
  renderKinematicBodies(kinematicBodies, ctx);

  animatePlayer(player, ctx, delta);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

  setSceneCameraPosition(
    player.position.x - (self.innerWidth - 64) / 2,
    player.position.y - (self.innerHeight - 64) / 2,
  );
}

export default scene;
