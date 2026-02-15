import type { Shape } from '../types/shapes';

interface ShapeListProps {
  shapes: Shape[];
  selectedShapeId: string | null;
  onSelect: (id: string) => void;
}

export default function ShapeList({ shapes, selectedShapeId, onSelect }: ShapeListProps) {
  if (shapes.length === 0) {
    return (
      <div className="panel shape-list">
        <h3>Layers</h3>
        <p className="empty-message">No shapes yet. Add one from the toolbar above.</p>
      </div>
    );
  }

  return (
    <div className="panel shape-list">
      <h3>Layers</h3>
      <ul className="layer-list">
        {[...shapes].reverse().map((shape) => (
          <li
            key={shape.id}
            className={`layer-item ${shape.id === selectedShapeId ? 'selected' : ''}`}
            onClick={() => onSelect(shape.id)}
          >
            <span
              className="layer-color"
              style={{ backgroundColor: shape.fill === 'none' ? shape.stroke : shape.fill }}
            />
            <span className="layer-name">
              {shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
