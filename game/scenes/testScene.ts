import {
  applyTouchControls,
  removeTouchControls,
} from "../../engine/TouchControls.ts";
import { pointer } from "../../engine/Pointer.ts";
import {
  animatePlayer,
  createPlayer,
  Direction,
  processPlayer,
  setDirection,
  type Player,
} from "../entities/Player.ts";
import { createGrid, type Grid } from "../entities/Grid.ts";
import {
  changeScene,
  createScene,
  focusSceneCameraToPosition,
  type Scene,
} from "../../engine/Scene.ts";
import nodeScene from "./nodeScene.ts";
import { createNode, paintNode } from "../entities/Node.ts";
import {
  circleContainsCircle,
  rectangleContainsCircle,
  rectangleContainsRectangle,
  createStaticCircle,
  createStaticRectangle,
  renderCircle,
  renderStaticBodies,
  renderRectangle,
  ShapeType,
  type Circle,
  type Rectangle,
} from "../../engine/StaticBody.ts";
import {
  createKinemeticCircle,
  createKinemeticRectangle,
  updateKinematicBody,
  renderKinematicBodies,
  processKinematicBodies,
  type KinematicBody,
  setActiveKinematicBodies,
} from "../../engine/KinematicBody.ts";
import { monitor } from "../../engine/monitor.ts";

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

const collisionCircle = createStaticCircle(
  { x: scene.width / 2, y: scene.height / 2 - 128 },
  32,
);

const collisionRectangle = createStaticRectangle(
  { x: scene.width / 2, y: scene.height / 2 - 128 },
  64,
  64,
);

const kinematicRectangle = createKinemeticRectangle(
  { x: scene.width / 2 - 96, y: scene.height / 2 + 64 },
  128,
  64,
);

const kinematicSquare = createKinemeticRectangle(
  { x: scene.width / 2 - 96, y: scene.height / 2 + 128 },
  64,
  64,
);

const kiniematicCircle = createKinemeticCircle(
  { x: scene.width / 2, y: scene.height / 2 + 256 },
  32,
);

const iceFloor = createStaticRectangle(
  { x: 256, y: scene.height - 512 },
  512,
  256,
);

const swamp = createStaticCircle({ x: 512, y: scene.height - 768 }, 128);

const wall = createStaticRectangle({ x: 256, y: 512 }, 16, scene.height / 2);

const collisionBodies = [collisionRectangle, collisionCircle, wall];
const kinematicBodies = [
  player.kinematicBody,
  kinematicRectangle,
  kiniematicCircle,
  kinematicSquare,
];

const activeKinematicBodies: Array<KinematicBody<Circle | Rectangle>> = [];

const playerMonitor = document.createElement("div");
monitor.appendChild(playerMonitor);

function process(ctx: CanvasRenderingContext2D, delta: number): void {
  grid.render(ctx);

  const playerFrictionModSwamp = circleContainsCircle(
    swamp,
    player.kinematicBody,
  )
    ? 0.5
    : 1;
  const playerFrictionModIce = rectangleContainsCircle(
    iceFloor,
    player.kinematicBody,
  )
    ? 0.015
    : 1;

  processPlayer(player, playerFrictionModSwamp * playerFrictionModIce);

  setActiveKinematicBodies(activeKinematicBodies, kinematicBodies);

  processKinematicBodies(
    activeKinematicBodies,
    collisionBodies,
    kinematicBodies,
  );

  for (const body of activeKinematicBodies) {
    let onIce = false;
    switch (body.type) {
      case ShapeType.Circle: {
        onIce = rectangleContainsCircle(
          iceFloor,
          body as KinematicBody<Circle>,
        );

        break;
      }
      case ShapeType.Rectangle: {
        onIce = rectangleContainsRectangle(
          iceFloor,
          body as KinematicBody<Rectangle>,
        );

        break;
      }
    }

    if (onIce) {
      updateKinematicBody(body, delta, 0.985);
    } else {
      updateKinematicBody(body, delta, 0.1);
    }
  }

  focusSceneCameraToPosition(player.position);

  renderRectangle(iceFloor, ctx, "rgba(255, 255, 255, 0.5)");
  renderCircle(swamp, ctx, "rgba(0, 0, 0, 0.5)");

  renderStaticBodies(collisionBodies, ctx);
  renderKinematicBodies(kinematicBodies, ctx);
  renderKinematicBodies(activeKinematicBodies, ctx);

  animatePlayer(player, ctx, delta);

  pointerNode.position = pointer.position;
  paintNode(pointerNode, ctx, "rgba(255, 255, 255, 0.5)");

  playerMonitor.innerText = `player: (${player.velocity.x}, ${player.velocity.y})`;
}

export default scene;
