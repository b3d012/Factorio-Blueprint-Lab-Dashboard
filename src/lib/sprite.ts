import type { CSSProperties } from 'react';

export const KIRK_SPRITE_HASH = 'df91c1c1283939c08e7af8b006ed2f09';
export const KIRK_SPRITE_CELL = 32;

export interface SpriteRef {
  sheetHash: string;
  row: number;
  col: number;
  label: string;
}

export function spriteStyle(sprite: SpriteRef, size = 64): CSSProperties {
  return {
    backgroundImage:
      `url(https://raw.githubusercontent.com/KirkMcDonald/kirkmcdonald.github.io/master/images/sprite-sheet-${sprite.sheetHash}.png), radial-gradient(circle at 30% 30%, rgba(245, 177, 76, 0.95), transparent 58%), ` +
      `linear-gradient(145deg, rgba(16, 24, 33, 1), rgba(7, 13, 18, 1))`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${480}px ${544}px, cover, cover`,
    backgroundPosition: `${-sprite.col * KIRK_SPRITE_CELL}px ${-sprite.row * KIRK_SPRITE_CELL}px, center, center`,
    imageRendering: 'pixelated',
    width: size,
    height: size,
    borderRadius: 18,
  };
}
