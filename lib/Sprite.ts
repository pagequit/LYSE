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
  hFrames: number;
  vFrames: number;
  lastHFrame: number;
  lastVFrame: number;
};

export function createSprite(spriteData: {
  imageSrc: string;
  position: Vector;
  width: number;
  height: number;
  frameRate: number;
  subWidth: number;
  subHeight: number;
  hFrames: number;
  vFrames: number;
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
    subPosition: { x: 0, y: 0 },
    subWidth: spriteData.subWidth,
    subHeight: spriteData.subHeight,
    hFrames: spriteData.hFrames,
    vFrames: spriteData.vFrames,
    lastHFrame: 0,
    lastVFrame: 0,
  };
}

export function setHFrame(sprite: Sprite, frame: number): void {
  sprite.lastHFrame = sprite.hFrames;
  sprite.hFrames = frame;
  sprite.subPosition.x = sprite.subWidth * frame;
}

export function setVFrame(sprite: Sprite, frame: number): void {
  sprite.lastVFrame = sprite.vFrames;
  sprite.vFrames = frame;
  sprite.subPosition.y = sprite.subHeight * frame;
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

    sprite.subPosition.x = sprite.subWidth * sprite.lastHFrame;

    if ((sprite.lastHFrame += 1) > sprite.hFrames - 1) {
      sprite.lastHFrame = 0;
    }
  }
}
