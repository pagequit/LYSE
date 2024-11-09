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

export function createSprite(spriteData: {
  imageSrc: string;
  position: Vector;
  width: number;
  height: number;
  frameRate: number;
  subPosition: Vector;
  subWidth: number;
  subHeight: number;
  sequenceStart: number;
  sequenceEnd: number;
}): Sprite {
  const image = new Image();
  image.src = spriteData.imageSrc;

  return {
    image,
    position: spriteData.position,
    width: spriteData.width,
    height: spriteData.height,
    frameRate: spriteData.frameRate,
    frameCount: 0,
    subPosition: spriteData.subPosition,
    subWidth: spriteData.subWidth,
    subHeight: spriteData.subHeight,
    sequence: spriteData.sequenceStart,
    sequenceStart: spriteData.sequenceStart,
    sequenceEnd: spriteData.sequenceEnd,
  };
}

export function animateSprite(
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
