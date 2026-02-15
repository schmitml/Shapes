export type ShapeType = 'circle' | 'rectangle' | 'triangle' | 'polygon' | 'star' | 'line';

export interface Point {
  x: number;
  y: number;
}

export interface ShapeBase {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  scaleX: number;
  scaleY: number;
}

export interface CircleShape extends ShapeBase {
  type: 'circle';
  radius: number;
}

export interface RectangleShape extends ShapeBase {
  type: 'rectangle';
  width: number;
  height: number;
  cornerRadius: number;
}

export interface TriangleShape extends ShapeBase {
  type: 'triangle';
  size: number;
}

export interface PolygonShape extends ShapeBase {
  type: 'polygon';
  radius: number;
  sides: number;
}

export interface StarShape extends ShapeBase {
  type: 'star';
  outerRadius: number;
  innerRadius: number;
  points: number;
}

export interface LineShape extends ShapeBase {
  type: 'line';
  x2: number;
  y2: number;
}

export type Shape = CircleShape | RectangleShape | TriangleShape | PolygonShape | StarShape | LineShape;

export type PatternType = 'none' | 'grid' | 'radial' | 'linear' | 'mirror';

export interface PatternConfig {
  type: PatternType;
  repeatX: number;
  repeatY: number;
  spacingX: number;
  spacingY: number;
  angle: number;
  radialCount: number;
  radialRadius: number;
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
  scaleProgression: number;
  rotationProgression: number;
  opacityProgression: number;
}

export interface CanvasState {
  width: number;
  height: number;
  background: string;
  shapes: Shape[];
  selectedShapeId: string | null;
  pattern: PatternConfig;
}
