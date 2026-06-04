import type { CSSProperties } from 'react';
import { spriteStyle } from '../lib/sprite';
import type { SpriteRef } from '../lib/sprite';

interface SpriteIconProps {
  sprite: SpriteRef;
  size?: number;
  className?: string;
}

export function SpriteIcon({ sprite, size = 56, className }: SpriteIconProps) {
  const style: CSSProperties = {
    ...spriteStyle(sprite, size),
  };

  return <div className={className ? `sprite-icon ${className}` : 'sprite-icon'} style={style} aria-hidden="true" />;
}
