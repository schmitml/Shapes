import { useCallback } from 'react';
import Toolbar from './components/Toolbar';
import SvgCanvas from './components/SvgCanvas';
import ShapeProperties from './components/ShapeProperties';
import ShapeList from './components/ShapeList';
import PatternControls from './components/PatternControls';
import { useCanvasState } from './hooks/useCanvasState';
import { exportToSvgString, downloadSvg } from './utils/exportSvg';
import './App.css';

function App() {
  const {
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
  } = useCanvasState();

  const handleExport = useCallback(() => {
    const svgString = exportToSvgString(
      state.shapes,
      state.pattern,
      state.width,
      state.height,
      state.background,
    );
    downloadSvg(svgString);
  }, [state]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Shape Pattern Generator</h1>
        <p className="subtitle">Create patterns from shapes and export as SVG</p>
      </header>

      <div className="app-layout">
        <aside className="sidebar left-sidebar">
          <Toolbar
            onAddShape={addShape}
            canvasWidth={state.width}
            canvasHeight={state.height}
            background={state.background}
            onCanvasResize={setCanvasSize}
            onBackgroundChange={setBackground}
            onExport={handleExport}
            onClear={clearAll}
          />
          <ShapeList
            shapes={state.shapes}
            selectedShapeId={state.selectedShapeId}
            onSelect={selectShape}
          />
        </aside>

        <main className="canvas-area">
          <SvgCanvas
            shapes={state.shapes}
            pattern={state.pattern}
            width={state.width}
            height={state.height}
            background={state.background}
            selectedShapeId={state.selectedShapeId}
            onSelectShape={selectShape}
            onUpdateShape={updateShape}
          />
        </main>

        <aside className="sidebar right-sidebar">
          {selectedShape ? (
            <ShapeProperties
              shape={selectedShape}
              onUpdate={updateShape}
              onDelete={deleteShape}
              onDuplicate={duplicateShape}
              onMoveUp={moveShapeUp}
              onMoveDown={moveShapeDown}
            />
          ) : (
            <div className="panel">
              <h3>Properties</h3>
              <p className="empty-message">Select a shape to edit its properties.</p>
            </div>
          )}
          <PatternControls pattern={state.pattern} onUpdate={updatePattern} />
        </aside>
      </div>
    </div>
  );
}

export default App;
