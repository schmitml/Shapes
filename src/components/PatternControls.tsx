import type { PatternConfig, PatternType } from '../types/shapes';

interface PatternControlsProps {
  pattern: PatternConfig;
  onUpdate: (updates: Partial<PatternConfig>) => void;
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

function SliderInput({ label, value, onChange, min, max, step = 1 }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label className="prop-row slider-row">
      <span className="prop-label">{label}</span>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="prop-slider"
      />
      <span className="slider-value">{value}</span>
    </label>
  );
}

const patternTypes: { value: PatternType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'grid', label: 'Grid' },
  { value: 'radial', label: 'Radial' },
  { value: 'linear', label: 'Linear' },
  { value: 'mirror', label: 'Mirror' },
];

export default function PatternControls({ pattern, onUpdate }: PatternControlsProps) {
  return (
    <div className="panel pattern-controls">
      <h3>Pattern</h3>

      <div className="pattern-type-selector">
        {patternTypes.map((pt) => (
          <button
            key={pt.value}
            className={`pattern-type-btn ${pattern.type === pt.value ? 'active' : ''}`}
            onClick={() => onUpdate({ type: pt.value })}
          >
            {pt.label}
          </button>
        ))}
      </div>

      {pattern.type === 'grid' && (
        <div className="prop-section">
          <div className="prop-grid">
            <NumberInput label="Columns" value={pattern.repeatX} onChange={(v) => onUpdate({ repeatX: v })} min={1} max={20} />
            <NumberInput label="Rows" value={pattern.repeatY} onChange={(v) => onUpdate({ repeatY: v })} min={1} max={20} />
            <NumberInput label="Space X" value={pattern.spacingX} onChange={(v) => onUpdate({ spacingX: v })} min={10} max={500} />
            <NumberInput label="Space Y" value={pattern.spacingY} onChange={(v) => onUpdate({ spacingY: v })} min={10} max={500} />
          </div>
        </div>
      )}

      {pattern.type === 'radial' && (
        <div className="prop-section">
          <div className="prop-grid">
            <NumberInput label="Count" value={pattern.radialCount} onChange={(v) => onUpdate({ radialCount: v })} min={2} max={36} />
            <NumberInput label="Radius" value={pattern.radialRadius} onChange={(v) => onUpdate({ radialRadius: v })} min={10} max={400} />
            <NumberInput label="Angle" value={pattern.angle} onChange={(v) => onUpdate({ angle: v })} min={0} max={360} />
          </div>
        </div>
      )}

      {pattern.type === 'linear' && (
        <div className="prop-section">
          <div className="prop-grid">
            <NumberInput label="Count" value={pattern.repeatX} onChange={(v) => onUpdate({ repeatX: v })} min={1} max={30} />
            <NumberInput label="Spacing" value={pattern.spacingX} onChange={(v) => onUpdate({ spacingX: v })} min={10} max={500} />
            <NumberInput label="Angle" value={pattern.angle} onChange={(v) => onUpdate({ angle: v })} min={0} max={360} />
          </div>
        </div>
      )}

      {pattern.type === 'mirror' && (
        <div className="prop-section">
          <div className="prop-grid">
            <label className="prop-row">
              <span className="prop-label">Horizontal</span>
              <input
                type="checkbox"
                checked={pattern.mirrorHorizontal}
                onChange={(e) => onUpdate({ mirrorHorizontal: e.target.checked })}
                className="prop-checkbox"
              />
            </label>
            <label className="prop-row">
              <span className="prop-label">Vertical</span>
              <input
                type="checkbox"
                checked={pattern.mirrorVertical}
                onChange={(e) => onUpdate({ mirrorVertical: e.target.checked })}
                className="prop-checkbox"
              />
            </label>
          </div>
        </div>
      )}

      {pattern.type !== 'none' && pattern.type !== 'mirror' && (
        <div className="prop-section">
          <h4>Progression</h4>
          <div className="prop-grid">
            <SliderInput label="Scale" value={pattern.scaleProgression} onChange={(v) => onUpdate({ scaleProgression: v })} min={-20} max={20} />
            <SliderInput label="Rotate" value={pattern.rotationProgression} onChange={(v) => onUpdate({ rotationProgression: v })} min={0} max={90} />
            <SliderInput label="Fade" value={pattern.opacityProgression} onChange={(v) => onUpdate({ opacityProgression: v })} min={0} max={20} />
          </div>
        </div>
      )}
    </div>
  );
}
