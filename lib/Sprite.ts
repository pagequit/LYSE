import { type Vector } from "./Vector.ts";

export type Sprite = {
  image: HTMLImageElement;
  width: number;
  height: number;
  framePosition: Vector;
  frameWidth: number;
  frameHeight: number;
  xLength: number;
  yLength: number;
  xIndex: number;
  yIndex: number;
};

export type SpritePlayer = {
  sprite: Sprite;
  frameDuration: number;
  frameDelta: number;
};

export function createSprite(spriteData: {
  imageSrc: string;
  width: number;
  height: number;
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
    framePosition: { x: 0, y: 0 },
    frameWidth: spriteData.frameWidth,
    frameHeight: spriteData.frameHeight,
    xLength: spriteData.xFrames - 1,
    yLength: spriteData.yFrames - 1,
    xIndex: 0,
    yIndex: 0,
  };
}

export function setSpriteXFrame(sprite: Sprite, index: number): void {
  sprite.xIndex = index;
  sprite.framePosition.x = sprite.frameWidth * index;
}

export function setSpriteYFrame(sprite: Sprite, index: number): void {
  sprite.yIndex = index;
  sprite.framePosition.y = sprite.frameHeight * index;
}

export function drawSprite(
  sprite: Sprite,
  position: Vector,
  ctx: CanvasRenderingContext2D,
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
}

export function createSpritePlayer(
  sprite: Sprite,
  playbackSpeed: number,
): SpritePlayer {
  return {
    sprite,
    frameDuration: playbackSpeed / sprite.xLength,
    frameDelta: 0,
  };
}

export function playbackSpritePlayer(
  spritePlayer: SpritePlayer,
  position: Vector,
  ctx: CanvasRenderingContext2D,
  delta: number,
): void {
  drawSprite(spritePlayer.sprite, position, ctx);

  spritePlayer.sprite.framePosition.x =
    spritePlayer.sprite.frameWidth * spritePlayer.sprite.xIndex;
  if ((spritePlayer.frameDelta += delta) > spritePlayer.frameDuration) {
    spritePlayer.frameDelta = 0;
    if ((spritePlayer.sprite.xIndex += 1) > spritePlayer.sprite.xLength) {
      spritePlayer.sprite.xIndex = 0;
    }
  }
}

export function setSpritePlayerXFrame(
  spritePlayer: SpritePlayer,
  index: number,
): void {
  setSpriteXFrame(spritePlayer.sprite, index);
  spritePlayer.frameDelta = 0;
}

export function setSpritePlayerYFrame(
  spritePlayer: SpritePlayer,
  index: number,
): void {
  setSpriteYFrame(spritePlayer.sprite, index);
  spritePlayer.frameDelta = 0;
}
