import type { ShapeType } from '../types/shapes';

interface ToolbarProps {
  onAddShape: (type: ShapeType) => void;
  canvasWidth: number;
  canvasHeight: number;
  background: string;
  onCanvasResize: (w: number, h: number) => void;
  onBackgroundChange: (color: string) => void;
  onExport: () => void;
  onClear: () => void;
}

const shapeButtons: { type: ShapeType; label: string; icon: string }[] = [
  { type: 'circle', label: 'Circle', icon: '●' },
  { type: 'rectangle', label: 'Rectangle', icon: '■' },
  { type: 'triangle', label: 'Triangle', icon: '▲' },
  { type: 'polygon', label: 'Polygon', icon: '⬡' },
  { type: 'star', label: 'Star', icon: '★' },
  { type: 'line', label: 'Line', icon: '╱' },
];

export default function Toolbar({
  onAddShape,
  canvasWidth,
  canvasHeight,
  background,
  onCanvasResize,
  onBackgroundChange,
  onExport,
  onClear,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Add Shape</h3>
        <div className="shape-buttons">
          {shapeButtons.map(({ type, label, icon }) => (
            <button
              key={type}
              className="shape-btn"
              onClick={() => onAddShape(type)}
              title={label}
            >
              <span className="shape-icon">{icon}</span>
              <span className="shape-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Canvas</h3>
        <div className="canvas-settings">
          <label className="prop-row">
            <span className="prop-label">Width</span>
            <input
              type="number"
              value={canvasWidth}
              onChange={(e) => onCanvasResize(Number(e.target.value), canvasHeight)}
              min={100}
              max={2000}
              className="prop-input"
            />
          </label>
          <label className="prop-row">
            <span className="prop-label">Height</span>
            <input
              type="number"
              value={canvasHeight}
              onChange={(e) => onCanvasResize(canvasWidth, Number(e.target.value))}
              min={100}
              max={2000}
              className="prop-input"
            />
          </label>
          <label className="prop-row">
            <span className="prop-label">Background</span>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={background}
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="color-swatch"
              />
              <input
                type="text"
                value={background}
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="prop-input color-text"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="toolbar-section toolbar-actions">
        <button className="action-btn export-btn" onClick={onExport}>
          Export SVG
        </button>
        <button className="action-btn clear-btn" onClick={onClear}>
          Clear All
        </button>
      </div>
    </div>
  );
}
