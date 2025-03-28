import { type Vector } from "./Vector.ts";

export type Sprite = {
  image: HTMLImageElement;
  width: number;
  height: number;
  frameDuration: number;
  frameDelta: number;
  framePosition: Vector;
  frameWidth: number;
  frameHeight: number;
  xLength: number;
  yLength: number;
  xIndex: number;
  yIndex: number;
};

export function createSprite(spriteData: {
  imageSrc: string;
  width: number;
  height: number;
  frameDuraton: number;
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
    frameDuration: spriteData.frameDuraton,
    frameDelta: 0,
    framePosition: { x: 0, y: 0 },
    frameWidth: spriteData.frameWidth,
    frameHeight: spriteData.frameHeight,
    xLength: spriteData.xFrames - 1,
    yLength: spriteData.yFrames - 1,
    xIndex: 0,
    yIndex: 0,
  };
}

export function setXFrame(sprite: Sprite, index: number): void {
  sprite.xIndex = index;
  sprite.framePosition.x = sprite.frameWidth * index;
  sprite.frameDelta = 0;
}

export function setYFrame(sprite: Sprite, index: number): void {
  sprite.yIndex = index;
  sprite.framePosition.y = sprite.frameHeight * index;
  sprite.frameDelta = 0;
}

export function animateSprite(
  sprite: Sprite,
  position: Vector,
  ctx: CanvasRenderingContext2D,
  delta: number,
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

  sprite.framePosition.x = sprite.frameWidth * sprite.xIndex;
  if ((sprite.frameDelta += delta) > sprite.frameDuration) {
    sprite.frameDelta = 0;
    if ((sprite.xIndex += 1) > sprite.xLength) {
      sprite.xIndex = 0;
    }
  }
}
