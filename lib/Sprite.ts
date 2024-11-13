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
  xLenght: number;
  yLenght: number;
  xIndex: number;
  yIndex: number;
};

export function createSprite(spriteData: {
  imageSrc: string;
  width: number;
  height: number;
  frameRate: number;
  frameWidth: number;
  frameHeight: number;
  xFrames: number;
  yFrames: number;
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
    xLenght: spriteData.xFrames - 1,
    yLenght: spriteData.yFrames - 1,
    xIndex: 0,
    yIndex: 0,
  };
}

export function setXFrame(sprite: Sprite, index: number): void {
  sprite.xIndex = index;
  sprite.framePosition.x = sprite.frameWidth * index;
}

export function setYFrame(sprite: Sprite, index: number): void {
  sprite.yIndex = index;
  sprite.framePosition.y = sprite.frameHeight * index;
}

export function animateSprite(
  sprite: Sprite,
  ctx: CanvasRenderingContext2D,
  delta: number,
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

  if ((sprite.frameCount += delta) > sprite.frameRate) {
    sprite.frameCount = 0;

    sprite.framePosition.x = sprite.frameWidth * sprite.xIndex;

    if ((sprite.xIndex += 1) > sprite.xLenght) {
      sprite.xIndex = 0;
    }
  }
}
