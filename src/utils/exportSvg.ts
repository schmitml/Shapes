import type { Shape, PatternConfig } from '../types/shapes';
import { generatePatternInstances } from './patternGenerator';
import { shapeToSvgElement } from './svgRenderer';

function applyTransformToShape(shape: Shape, offsetX: number, offsetY: number, additionalRotation: number, scale: number, opacity: number): Shape {
  return {
    ...shape,
    x: shape.x + offsetX,
    y: shape.y + offsetY,
    rotation: shape.rotation + additionalRotation,
    scaleX: shape.scaleX * scale,
    scaleY: shape.scaleY * scale,
    opacity: shape.opacity * opacity,
  } as Shape;
}

export function exportToSvgString(
  shapes: Shape[],
  pattern: PatternConfig,
  canvasWidth: number,
  canvasHeight: number,
  background: string,
): string {
  const instances = generatePatternInstances(shapes, pattern, canvasWidth, canvasHeight);

  const elements = instances.map(({ shape, offsetX, offsetY, additionalRotation, scale, opacity }) => {
    const transformed = applyTransformToShape(shape, offsetX, offsetY, additionalRotation, scale, opacity);
    return shapeToSvgElement(transformed);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
  <rect width="${canvasWidth}" height="${canvasHeight}" fill="${background}" />
  ${elements.join('\n  ')}
</svg>`;
}

export function downloadSvg(svgString: string, filename: string = 'pattern.svg'): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
