import type { Shape, PatternConfig } from '../types/shapes';

export interface TransformedShape {
  shape: Shape;
  offsetX: number;
  offsetY: number;
  additionalRotation: number;
  scale: number;
  opacity: number;
}

export function generatePatternInstances(
  shapes: Shape[],
  pattern: PatternConfig,
  canvasWidth: number,
  canvasHeight: number,
): TransformedShape[] {
  if (pattern.type === 'none') {
    return shapes.map((shape) => ({
      shape,
      offsetX: 0,
      offsetY: 0,
      additionalRotation: 0,
      scale: 1,
      opacity: 1,
    }));
  }

  const instances: TransformedShape[] = [];

  switch (pattern.type) {
    case 'grid': {
      for (let row = 0; row < pattern.repeatY; row++) {
        for (let col = 0; col < pattern.repeatX; col++) {
          const index = row * pattern.repeatX + col;
          const offsetX = col * pattern.spacingX - ((pattern.repeatX - 1) * pattern.spacingX) / 2;
          const offsetY = row * pattern.spacingY - ((pattern.repeatY - 1) * pattern.spacingY) / 2;
          const scale = 1 + index * pattern.scaleProgression * 0.01;
          const rot = index * pattern.rotationProgression;
          const opac = Math.max(0, Math.min(1, 1 - index * pattern.opacityProgression * 0.01));
          for (const shape of shapes) {
            instances.push({
              shape,
              offsetX,
              offsetY,
              additionalRotation: rot,
              scale: Math.max(0.1, scale),
              opacity: opac,
            });
          }
        }
      }
      break;
    }
    case 'radial': {
      for (let i = 0; i < pattern.radialCount; i++) {
        const angle = (i * 360) / pattern.radialCount + pattern.angle;
        const rad = (angle * Math.PI) / 180;
        const offsetX = Math.cos(rad) * pattern.radialRadius;
        const offsetY = Math.sin(rad) * pattern.radialRadius;
        const scale = 1 + i * pattern.scaleProgression * 0.01;
        const rot = angle;
        const opac = Math.max(0, Math.min(1, 1 - i * pattern.opacityProgression * 0.01));
        for (const shape of shapes) {
          instances.push({
            shape,
            offsetX,
            offsetY,
            additionalRotation: rot,
            scale: Math.max(0.1, scale),
            opacity: opac,
          });
        }
      }
      break;
    }
    case 'linear': {
      const totalCount = pattern.repeatX;
      const rad = (pattern.angle * Math.PI) / 180;
      for (let i = 0; i < totalCount; i++) {
        const dist = i * pattern.spacingX;
        const offsetX = Math.cos(rad) * dist - ((totalCount - 1) * pattern.spacingX * Math.cos(rad)) / 2;
        const offsetY = Math.sin(rad) * dist - ((totalCount - 1) * pattern.spacingX * Math.sin(rad)) / 2;
        const scale = 1 + i * pattern.scaleProgression * 0.01;
        const rot = i * pattern.rotationProgression;
        const opac = Math.max(0, Math.min(1, 1 - i * pattern.opacityProgression * 0.01));
        for (const shape of shapes) {
          instances.push({
            shape,
            offsetX,
            offsetY,
            additionalRotation: rot,
            scale: Math.max(0.1, scale),
            opacity: opac,
          });
        }
      }
      break;
    }
    case 'mirror': {
      const cx = canvasWidth / 2;
      const cy = canvasHeight / 2;
      for (const shape of shapes) {
        instances.push({ shape, offsetX: 0, offsetY: 0, additionalRotation: 0, scale: 1, opacity: 1 });
        if (pattern.mirrorHorizontal) {
          instances.push({
            shape,
            offsetX: 2 * (cx - shape.x),
            offsetY: 0,
            additionalRotation: 0,
            scale: 1,
            opacity: 1,
          });
        }
        if (pattern.mirrorVertical) {
          instances.push({
            shape,
            offsetX: 0,
            offsetY: 2 * (cy - shape.y),
            additionalRotation: 0,
            scale: 1,
            opacity: 1,
          });
        }
        if (pattern.mirrorHorizontal && pattern.mirrorVertical) {
          instances.push({
            shape,
            offsetX: 2 * (cx - shape.x),
            offsetY: 2 * (cy - shape.y),
            additionalRotation: 0,
            scale: 1,
            opacity: 1,
          });
        }
      }
      break;
    }
  }

  return instances;
}
