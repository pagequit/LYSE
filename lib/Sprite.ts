import { type Vector } from "./Vector.ts";

export type Sprite = {
  image: HTMLImageElement;
  width: number;
  height: number;
  frameRate: number;
  frameCount: number;
  framePosition: Vector;
  frameWidth: number;
  frameHeight: number;
  hFramesLenght: number;
  vFramesLenght: number;
  hFramesIndex: number;
  vFramesIndex: number;
};

export function createSprite(spriteData: {
  imageSrc: string;
  width: number;
  height: number;
  frameRate: number;
  frameWidth: number;
  frameHeight: number;
  hFrames: number;
  vFrames: number;
}): Sprite {
  const image = new Image();
  image.src = spriteData.imageSrc;

  return {
    image,
    width: spriteData.width,
    height: spriteData.height,
    frameRate: spriteData.frameRate,
    frameCount: 0,
    framePosition: { x: 0, y: 0 },
    frameWidth: spriteData.frameWidth,
    frameHeight: spriteData.frameHeight,
    hFramesLenght: spriteData.hFrames - 1,
    vFramesLenght: spriteData.vFrames - 1,
    hFramesIndex: 0,
    vFramesIndex: 0,
  };
}

export function setHFrame(sprite: Sprite, frame: number): void {
  sprite.hFramesIndex = frame;
  sprite.framePosition.x = sprite.frameWidth * frame;
}

export function setVFrame(sprite: Sprite, frame: number): void {
  sprite.vFramesIndex = frame;
  sprite.framePosition.y = sprite.frameHeight * frame;
}

export function animateSprite(
  sprite: Sprite,
  ctx: CanvasRenderingContext2D,
  position: Vector,
): void {
  ctx.drawImage(
    sprite.image,
    sprite.framePosition.x,
    sprite.framePosition.y,
    sprite.frameWidth,
    sprite.frameHeight,
    position.x,
    position.y,
    sprite.width,
    sprite.height,
  );

  if ((sprite.frameCount += 1) > sprite.frameRate) {
    sprite.frameCount = 0;

    sprite.framePosition.x = sprite.frameWidth * sprite.hFramesIndex;

    if ((sprite.hFramesIndex += 1) > sprite.hFramesLenght) {
      sprite.hFramesIndex = 0;
    }
  }
}
