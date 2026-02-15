import type { Shape, TriangleShape, PolygonShape, StarShape } from '../types/shapes';

export function getTrianglePoints(shape: TriangleShape): string {
  const { size } = shape;
  const h = (size * Math.sqrt(3)) / 2;
  return `0,${h / 2} ${size / 2},${-h / 2} ${-size / 2},${-h / 2}`;
}

export function getPolygonPoints(shape: PolygonShape): string {
  const { radius, sides } = shape;
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    points.push(`${radius * Math.cos(angle)},${radius * Math.sin(angle)}`);
  }
  return points.join(' ');
}

export function getStarPoints(shape: StarShape): string {
  const { outerRadius, innerRadius, points: numPoints } = shape;
  const pts: string[] = [];
  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (i * Math.PI) / numPoints - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    pts.push(`${r * Math.cos(angle)},${r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

export function shapeToSvgElement(shape: Shape): string {
  const transform = `translate(${shape.x}, ${shape.y}) rotate(${shape.rotation}) scale(${shape.scaleX}, ${shape.scaleY})`;
  const common = `fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}" transform="${transform}"`;

  switch (shape.type) {
    case 'circle':
      return `<circle cx="0" cy="0" r="${shape.radius}" ${common} />`;
    case 'rectangle':
      return `<rect x="${-shape.width / 2}" y="${-shape.height / 2}" width="${shape.width}" height="${shape.height}" rx="${shape.cornerRadius}" ${common} />`;
    case 'triangle':
      return `<polygon points="${getTrianglePoints(shape)}" ${common} />`;
    case 'polygon':
      return `<polygon points="${getPolygonPoints(shape)}" ${common} />`;
    case 'star':
      return `<polygon points="${getStarPoints(shape)}" ${common} />`;
    case 'line':
      return `<line x1="0" y1="0" x2="${shape.x2 - shape.x}" y2="${shape.y2 - shape.y}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}" transform="translate(${shape.x}, ${shape.y}) rotate(${shape.rotation})" />`;
  }
}
