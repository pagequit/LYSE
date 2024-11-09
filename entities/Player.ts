import { type Sprite, createSprite } from "../lib/Sprite";
import { type Vector } from "../lib/Vector";

export type Player = {
  position: Vector;
  sprite: Sprite;
};

export function createPlayer(position: Vector): Player {
  const idle = createSprite({
    imageSrc: "/BaseCharacter/idle.png",
    position,
    width: 256,
    height: 256,
    frameRate: 42,
    subPosition: { x: 0, y: 160 },
    subWidth: 80,
    subHeight: 80,
    sequenceStart: 0,
    sequenceEnd: 3,
  });

  const _walk = createSprite({
    imageSrc: "/BaseCharacter/walk.png",
    position,
    width: 256,
    height: 256,
    frameRate: 42,
    subPosition: { x: 0, y: 160 },
    subWidth: 80,
    subHeight: 80,
    sequenceStart: 0,
    sequenceEnd: 7,
  });

  const player = {
    position,
    sprite: idle,
  };

  return player;
}
