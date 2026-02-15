import React, { useRef, useCallback } from 'react';
import type { Shape, PatternConfig } from '../types/shapes';
import { generatePatternInstances } from '../utils/patternGenerator';
import { getTrianglePoints, getPolygonPoints, getStarPoints } from '../utils/svgRenderer';

interface SvgCanvasProps {
  shapes: Shape[];
  pattern: PatternConfig;
  width: number;
  height: number;
  background: string;
  selectedShapeId: string | null;
  onSelectShape: (id: string | null) => void;
  onUpdateShape: (id: string, updates: Partial<Shape>) => void;
}

function RenderShape({ shape, isSelected, isGhost, onClick }: {
  shape: Shape;
  isSelected: boolean;
  isGhost?: boolean;
  onClick?: () => void;
}) {
  const transform = `translate(${shape.x}, ${shape.y}) rotate(${shape.rotation}) scale(${shape.scaleX}, ${shape.scaleY})`;
  const style: React.CSSProperties = {
    cursor: isGhost ? 'default' : 'pointer',
    pointerEvents: isGhost ? 'none' : 'auto',
  };

  const common = {
    fill: shape.fill,
    stroke: isSelected ? '#ff6b35' : shape.stroke,
    strokeWidth: isSelected ? shape.strokeWidth + 1.5 : shape.strokeWidth,
    opacity: shape.opacity,
    transform,
    style,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick?.();
    },
  };

  switch (shape.type) {
    case 'circle':
      return <circle cx={0} cy={0} r={shape.radius} {...common} />;
    case 'rectangle':
      return (
        <rect
          x={-shape.width / 2}
          y={-shape.height / 2}
          width={shape.width}
          height={shape.height}
          rx={shape.cornerRadius}
          {...common}
        />
      );
    case 'triangle':
      return <polygon points={getTrianglePoints(shape)} {...common} />;
    case 'polygon':
      return <polygon points={getPolygonPoints(shape)} {...common} />;
    case 'star':
      return <polygon points={getStarPoints(shape)} {...common} />;
    case 'line':
      return (
        <line
          x1={0}
          y1={0}
          x2={shape.x2 - shape.x}
          y2={shape.y2 - shape.y}
          stroke={isSelected ? '#ff6b35' : shape.stroke}
          strokeWidth={isSelected ? shape.strokeWidth + 1.5 : shape.strokeWidth}
          opacity={shape.opacity}
          transform={`translate(${shape.x}, ${shape.y}) rotate(${shape.rotation})`}
          style={style}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        />
      );
  }
}

export default function SvgCanvas({
  shapes,
  pattern,
  width,
  height,
  background,
  selectedShapeId,
  onSelectShape,
  onUpdateShape,
}: SvgCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragState = useRef<{ shapeId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const instances = generatePatternInstances(shapes, pattern, width, height);

  const handleMouseDown = useCallback((e: React.MouseEvent, shapeId: string, shapeX: number, shapeY: number) => {
    e.preventDefault();
    dragState.current = {
      shapeId,
      startX: e.clientX,
      startY: e.clientY,
      origX: shapeX,
      origY: shapeY,
    };
    onSelectShape(shapeId);

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragState.current) return;
      const dx = ev.clientX - dragState.current.startX;
      const dy = ev.clientY - dragState.current.startY;
      const svgEl = svgRef.current;
      if (!svgEl) return;
      const rect = svgEl.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      onUpdateShape(dragState.current.shapeId, {
        x: dragState.current.origX + dx * scaleX,
        y: dragState.current.origY + dy * scaleY,
      });
    };

    const handleMouseUp = () => {
      dragState.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [width, height, onSelectShape, onUpdateShape]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      style={{ border: '1px solid #333', background, borderRadius: 8 }}
      onClick={() => onSelectShape(null)}
    >
      {instances.map((inst, i) => {
        const transformed: Shape = {
          ...inst.shape,
          x: inst.shape.x + inst.offsetX,
          y: inst.shape.y + inst.offsetY,
          rotation: inst.shape.rotation + inst.additionalRotation,
          scaleX: inst.shape.scaleX * inst.scale,
          scaleY: inst.shape.scaleY * inst.scale,
          opacity: inst.shape.opacity * inst.opacity,
        } as Shape;

        const isOriginal = inst.offsetX === 0 && inst.offsetY === 0 && inst.additionalRotation === 0 && inst.scale === 1;
        const isSelected = isOriginal && transformed.id === selectedShapeId;

        return (
          <g
            key={`${transformed.id}-${i}`}
            onMouseDown={isOriginal ? (e) => handleMouseDown(e, transformed.id, inst.shape.x, inst.shape.y) : undefined}
          >
            <RenderShape
              shape={transformed}
              isSelected={isSelected}
              isGhost={!isOriginal}
              onClick={isOriginal ? () => onSelectShape(transformed.id) : undefined}
            />
          </g>
        );
      })}
    </svg>
  );
}
