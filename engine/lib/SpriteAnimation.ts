import {
  drawSprite,
  setSpriteXFrame,
  setSpriteYFrame,
  type Sprite,
} from "./Sprite";

export type SpriteAnimation = {
  sprite: Sprite;
  frameDuration: number;
  frameDelta: number;
};

export function createSpriteAnimation(
  sprite: Sprite,
  animationTime: number,
): SpriteAnimation {
  return {
    sprite,
    frameDuration: animationTime / sprite.xLength,
    frameDelta: 0,
  };
}

export function playSpriteAnimation(
  animation: SpriteAnimation,
  ctx: CanvasRenderingContext2D,
  delta: number,
): void {
  drawSprite(animation.sprite, ctx);

  animation.sprite.framePosition.x =
    animation.sprite.frameWidth * animation.sprite.xIndex;
  if ((animation.frameDelta += delta) > animation.frameDuration) {
    animation.frameDelta = 0;
    if ((animation.sprite.xIndex += 1) > animation.sprite.xLength) {
      animation.sprite.xIndex = 0;
    }
  }
}

export function setSpriteAnimationXFrame(
  animation: SpriteAnimation,
  index: number,
): void {
  setSpriteXFrame(animation.sprite, index);
  animation.frameDelta = 0;
}

export function setSpriteAnimationYFrame(
  spritePlayer: SpriteAnimation,
  index: number,
): void {
  setSpriteYFrame(spritePlayer.sprite, index);
  spritePlayer.frameDelta = 0;
}
