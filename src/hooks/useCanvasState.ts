import { useState, useCallback } from 'react';
import type { Shape, ShapeType, PatternConfig, CanvasState } from '../types/shapes';
import { createShape, defaultPattern } from '../utils/shapeDefaults';

const initialState: CanvasState = {
  width: 600,
  height: 600,
  background: '#ffffff',
  shapes: [],
  selectedShapeId: null,
  pattern: defaultPattern,
};

export function useCanvasState() {
  const [state, setState] = useState<CanvasState>(initialState);

  const addShape = useCallback((type: ShapeType) => {
    const shape = createShape(type);
    shape.x = state.width / 2;
    shape.y = state.height / 2;
    setState((prev) => ({
      ...prev,
      shapes: [...prev.shapes, shape],
      selectedShapeId: shape.id,
    }));
  }, [state.width, state.height]);

  const updateShape = useCallback((id: string, updates: Partial<Shape>) => {
    setState((prev) => ({
      ...prev,
      shapes: prev.shapes.map((s) => (s.id === id ? { ...s, ...updates } as Shape : s)),
    }));
  }, []);

  const deleteShape = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      shapes: prev.shapes.filter((s) => s.id !== id),
      selectedShapeId: prev.selectedShapeId === id ? null : prev.selectedShapeId,
    }));
  }, []);

  const duplicateShape = useCallback((id: string) => {
    setState((prev) => {
      const original = prev.shapes.find((s) => s.id === id);
      if (!original) return prev;
      const copy = createShape(original.type);
      const merged = { ...original, id: copy.id, x: original.x + 20, y: original.y + 20 } as Shape;
      return {
        ...prev,
        shapes: [...prev.shapes, merged],
        selectedShapeId: merged.id,
      };
    });
  }, []);

  const selectShape = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedShapeId: id }));
  }, []);

  const moveShapeUp = useCallback((id: string) => {
    setState((prev) => {
      const idx = prev.shapes.findIndex((s) => s.id === id);
      if (idx < prev.shapes.length - 1) {
        const shapes = [...prev.shapes];
        [shapes[idx], shapes[idx + 1]] = [shapes[idx + 1], shapes[idx]];
        return { ...prev, shapes };
      }
      return prev;
    });
  }, []);

  const moveShapeDown = useCallback((id: string) => {
    setState((prev) => {
      const idx = prev.shapes.findIndex((s) => s.id === id);
      if (idx > 0) {
        const shapes = [...prev.shapes];
        [shapes[idx], shapes[idx - 1]] = [shapes[idx - 1], shapes[idx]];
        return { ...prev, shapes };
      }
      return prev;
    });
  }, []);

  const updatePattern = useCallback((updates: Partial<PatternConfig>) => {
    setState((prev) => ({
      ...prev,
      pattern: { ...prev.pattern, ...updates },
    }));
  }, []);

  const setCanvasSize = useCallback((width: number, height: number) => {
    setState((prev) => ({ ...prev, width, height }));
  }, []);

  const setBackground = useCallback((background: string) => {
    setState((prev) => ({ ...prev, background }));
  }, []);

  const clearAll = useCallback(() => {
    setState(initialState);
  }, []);

  const selectedShape = state.shapes.find((s) => s.id === state.selectedShapeId) || null;

  return {
    state,
    selectedShape,
    addShape,
    updateShape,
    deleteShape,
    duplicateShape,
    selectShape,
    moveShapeUp,
    moveShapeDown,
    updatePattern,
    setCanvasSize,
    setBackground,
    clearAll,
  };
}
