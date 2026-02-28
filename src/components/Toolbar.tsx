import { useState } from 'react';

interface ToolbarProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  tool: 'brush' | 'eraser';
  setTool: (tool: 'brush' | 'eraser') => void;
  onClear: () => void;
  colors: string[];
}

export function Toolbar({
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  tool,
  setTool,
  onClear,
  colors,
}: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="relative z-20 px-2 pb-2 md:px-4 md:pb-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-xl border-4 border-gray-800/10 p-3 md:p-4">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          {/* Tool Selection */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTool('brush')}
              className={`p-2.5 md:p-3 rounded-lg transition-all duration-200 ${
                tool === 'brush'
                  ? 'bg-white shadow-md scale-105'
                  : 'hover:bg-white/50'
              }`}
              aria-label="Brush tool"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
                <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
                <path d="M14.5 17.5 4.5 15" />
              </svg>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2.5 md:p-3 rounded-lg transition-all duration-200 ${
                tool === 'eraser'
                  ? 'bg-white shadow-md scale-105'
                  : 'hover:bg-white/50'
              }`}
              aria-label="Eraser tool"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                <path d="M22 21H7" />
                <path d="m5 11 9 9" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200" />

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-4 border-gray-800/20 shadow-lg transform hover:scale-110 transition-transform"
              style={{ backgroundColor: brushColor }}
              aria-label="Pick color"
            />

            {showColorPicker && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowColorPicker(false)}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-white rounded-2xl shadow-2xl border-4 border-gray-800/10 z-40">
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setBrushColor(color);
                          setShowColorPicker(false);
                        }}
                        className={`w-10 h-10 rounded-xl transition-all hover:scale-110 ${
                          brushColor === color
                            ? 'ring-4 ring-gray-800/30 scale-110'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                      aria-label="Custom color picker"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Colors */}
          <div className="hidden sm:flex items-center gap-1.5">
            {colors.slice(0, 5).map((color) => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-7 h-7 md:w-8 md:h-8 rounded-lg transition-all hover:scale-110 ${
                  brushColor === color ? 'ring-2 ring-gray-800/30 scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200" />

          {/* Brush Size */}
          <div className="flex items-center gap-2 md:gap-3 bg-gray-100 rounded-xl px-3 py-2">
            <div
              className="rounded-full bg-gray-800"
              style={{
                width: Math.max(6, brushSize / 2),
                height: Math.max(6, brushSize / 2),
              }}
            />
            <input
              type="range"
              min="2"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 md:w-28 accent-gray-800"
              aria-label="Brush size"
            />
            <span className="text-xs md:text-sm font-body text-gray-600 w-6 text-center">
              {brushSize}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200" />

          {/* Clear Button */}
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-gradient-to-br from-red-400 to-red-500 text-white rounded-xl font-body font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all active:scale-95"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}
