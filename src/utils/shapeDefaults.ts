import { v4 as uuidv4 } from 'uuid';
import type { Shape, ShapeType, PatternConfig } from '../types/shapes';

const baseDefaults = {
  x: 300,
  y: 300,
  rotation: 0,
  fill: '#4a90d9',
  stroke: '#2c3e50',
  strokeWidth: 2,
  opacity: 1,
  scaleX: 1,
  scaleY: 1,
};

export function createShape(type: ShapeType): Shape {
  const id = uuidv4();
  switch (type) {
    case 'circle':
      return { ...baseDefaults, id, type: 'circle', radius: 40 };
    case 'rectangle':
      return { ...baseDefaults, id, type: 'rectangle', width: 80, height: 60, cornerRadius: 0 };
    case 'triangle':
      return { ...baseDefaults, id, type: 'triangle', size: 60 };
    case 'polygon':
      return { ...baseDefaults, id, type: 'polygon', radius: 40, sides: 6 };
    case 'star':
      return { ...baseDefaults, id, type: 'star', outerRadius: 40, innerRadius: 20, points: 5 };
    case 'line':
      return { ...baseDefaults, id, type: 'line', x2: 380, y2: 300, fill: 'none', strokeWidth: 3 };
  }
}

export const defaultPattern: PatternConfig = {
  type: 'none',
  repeatX: 3,
  repeatY: 3,
  spacingX: 100,
  spacingY: 100,
  angle: 0,
  radialCount: 8,
  radialRadius: 150,
  mirrorHorizontal: false,
  mirrorVertical: false,
  scaleProgression: 0,
  rotationProgression: 0,
  opacityProgression: 0,
};
