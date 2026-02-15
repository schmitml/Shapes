import type { Shape } from '../types/shapes';

interface ShapePropertiesProps {
  shape: Shape;
  onUpdate: (id: string, updates: Partial<Shape>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

function NumberInput({ label, value, onChange, min, max, step = 1 }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="prop-row">
      <span className="prop-label">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="prop-input"
      />
    </label>
  );
}

function ColorInput({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="prop-row">
      <span className="prop-label">{label}</span>
      <div className="color-input-wrapper">
        <input
          type="color"
          value={value === 'none' ? '#000000' : value}
          onChange={(e) => onChange(e.target.value)}
          className="color-swatch"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="prop-input color-text"
        />
      </div>
    </label>
  );
}

export default function ShapeProperties({ shape, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }: ShapePropertiesProps) {
  const update = (updates: Partial<Shape>) => onUpdate(shape.id, updates);

  return (
    <div className="panel shape-properties">
      <div className="panel-header">
        <h3>{shape.type.charAt(0).toUpperCase() + shape.type.slice(1)} Properties</h3>
        <div className="shape-actions">
          <button onClick={() => onMoveDown(shape.id)} title="Move back" className="icon-btn">&#9660;</button>
          <button onClick={() => onMoveUp(shape.id)} title="Move forward" className="icon-btn">&#9650;</button>
          <button onClick={() => onDuplicate(shape.id)} title="Duplicate" className="icon-btn">&#10697;</button>
          <button onClick={() => onDelete(shape.id)} title="Delete" className="icon-btn danger">&#10005;</button>
        </div>
      </div>

      <div className="prop-section">
        <h4>Position & Transform</h4>
        <div className="prop-grid">
          <NumberInput label="X" value={Math.round(shape.x)} onChange={(v) => update({ x: v })} />
          <NumberInput label="Y" value={Math.round(shape.y)} onChange={(v) => update({ y: v })} />
          <NumberInput label="Rotation" value={shape.rotation} onChange={(v) => update({ rotation: v })} min={0} max={360} />
          <NumberInput label="Scale X" value={shape.scaleX} onChange={(v) => update({ scaleX: v })} min={0.1} max={10} step={0.1} />
          <NumberInput label="Scale Y" value={shape.scaleY} onChange={(v) => update({ scaleY: v })} min={0.1} max={10} step={0.1} />
        </div>
      </div>

      <div className="prop-section">
        <h4>Appearance</h4>
        <div className="prop-grid">
          <ColorInput label="Fill" value={shape.fill} onChange={(v) => update({ fill: v })} />
          <ColorInput label="Stroke" value={shape.stroke} onChange={(v) => update({ stroke: v })} />
          <NumberInput label="Stroke W" value={shape.strokeWidth} onChange={(v) => update({ strokeWidth: v })} min={0} max={20} step={0.5} />
          <NumberInput label="Opacity" value={shape.opacity} onChange={(v) => update({ opacity: v })} min={0} max={1} step={0.05} />
        </div>
      </div>

      <div className="prop-section">
        <h4>Shape Size</h4>
        <div className="prop-grid">
          {shape.type === 'circle' && (
            <NumberInput label="Radius" value={shape.radius} onChange={(v) => update({ radius: v })} min={1} />
          )}
          {shape.type === 'rectangle' && (
            <>
              <NumberInput label="Width" value={shape.width} onChange={(v) => update({ width: v })} min={1} />
              <NumberInput label="Height" value={shape.height} onChange={(v) => update({ height: v })} min={1} />
              <NumberInput label="Corners" value={shape.cornerRadius} onChange={(v) => update({ cornerRadius: v })} min={0} />
            </>
          )}
          {shape.type === 'triangle' && (
            <NumberInput label="Size" value={shape.size} onChange={(v) => update({ size: v })} min={1} />
          )}
          {shape.type === 'polygon' && (
            <>
              <NumberInput label="Radius" value={shape.radius} onChange={(v) => update({ radius: v })} min={1} />
              <NumberInput label="Sides" value={shape.sides} onChange={(v) => update({ sides: v })} min={3} max={20} />
            </>
          )}
          {shape.type === 'star' && (
            <>
              <NumberInput label="Outer R" value={shape.outerRadius} onChange={(v) => update({ outerRadius: v })} min={1} />
              <NumberInput label="Inner R" value={shape.innerRadius} onChange={(v) => update({ innerRadius: v })} min={1} />
              <NumberInput label="Points" value={shape.points} onChange={(v) => update({ points: v })} min={3} max={20} />
            </>
          )}
          {shape.type === 'line' && (
            <>
              <NumberInput label="End X" value={shape.x2} onChange={(v) => update({ x2: v })} />
              <NumberInput label="End Y" value={shape.y2} onChange={(v) => update({ y2: v })} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
