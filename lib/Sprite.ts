import { type Vector } from "./Vector.ts";

export type Sprite = {
  image: HTMLImageElement;
  position: Vector;
  width: number;
  height: number;
  frameRate: number;
  frameCount: number;
  subPosition: Vector;
  subWidth: number;
  subHeight: number;
  sequence: number;
  sequenceStart: number;
  sequenceEnd: number;
};

export function renderSprite(
  sprite: Sprite,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.drawImage(
    sprite.image,
    sprite.subPosition.x,
    sprite.subPosition.y,
    sprite.subWidth,
    sprite.subHeight,
    sprite.position.x,
    sprite.position.y,
    sprite.width,
    sprite.height,
  );

  if ((sprite.frameCount += 1) > sprite.frameRate) {
    sprite.frameCount = 0;

    sprite.subPosition.x = sprite.subWidth * sprite.sequence;

    if ((sprite.sequence += 1) > sprite.sequenceEnd) {
      sprite.sequence = sprite.sequenceStart;
    }
  }
}
