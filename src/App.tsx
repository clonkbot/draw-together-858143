import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { UserCursors } from './components/UserCursors';
import { User, DrawingState } from './components/types';

const COLORS = [
  '#FF6B9D', // Hot pink
  '#00D4AA', // Teal
  '#FFB347', // Orange
  '#7B68EE', // Medium slate blue
  '#50C878', // Emerald
  '#FF6347', // Tomato
  '#4ECDC4', // Turquoise
  '#FFE135', // Banana yellow
];

const NAMES = [
  'Doodle Bug', 'Scribble Master', 'Pixel Pal', 'Art Wizard',
  'Brush Boss', 'Color King', 'Sketch Star', 'Paint Pro'
];

function generateUser(): User {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    x: 0,
    y: 0,
  };
}

function App() {
  const [currentUser] = useState<User>(generateUser);
  const [users, setUsers] = useState<User[]>([]);
  const [brushSize, setBrushSize] = useState(8);
  const [brushColor, setBrushColor] = useState(currentUser.color);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    lastX: 0,
    lastY: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate other users for demo (since no backend)
  useEffect(() => {
    const fakeUsers: User[] = [
      { ...generateUser(), x: 150, y: 200 },
      { ...generateUser(), x: 300, y: 350 },
    ];
    setUsers(fakeUsers);

    // Animate fake cursors
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        x: user.x + (Math.random() - 0.5) * 20,
        y: user.y + (Math.random() - 0.5) * 20,
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFF8E7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[100dvh] bg-[#FFF8E7] flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundBlendMode: 'soft-light',
      }}
    >
      {/* Header */}
      <header className="relative z-10 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#FFB347] flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-3 transition-transform">
              <span className="text-xl md:text-2xl">🎨</span>
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl lg:text-3xl text-gray-800 tracking-tight">
                Draw Together
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-body hidden sm:block">
                Collaborative canvas for everyone
              </p>
            </div>
          </div>

          {/* User indicator */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-md border-2 border-gray-800/10">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded-full animate-pulse"
              style={{ backgroundColor: currentUser.color }}
            />
            <span className="font-body text-xs md:text-sm text-gray-700">{currentUser.name}</span>
          </div>
        </div>
      </header>

      {/* Online users indicator */}
      <div className="absolute top-20 md:top-24 right-4 md:right-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md border-2 border-gray-800/10">
        <div className="flex -space-x-2">
          {[currentUser, ...users].slice(0, 4).map((user, i) => (
            <div
              key={user.id}
              className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: user.color, zIndex: 4 - i }}
            >
              {user.name[0]}
            </div>
          ))}
        </div>
        <span className="text-xs md:text-sm font-body text-gray-600">
          {users.length + 1} drawing
        </span>
      </div>

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col px-2 pb-2 md:px-4 md:pb-4 min-h-0">
        <div className="flex-1 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800/20 bg-[#FFF8E7]">
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <Canvas
            ref={canvasRef}
            brushSize={brushSize}
            brushColor={tool === 'eraser' ? '#FFF8E7' : brushColor}
            drawingState={drawingState}
            setDrawingState={setDrawingState}
          />

          <UserCursors users={users} />
        </div>
      </main>

      {/* Toolbar */}
      <Toolbar
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        tool={tool}
        setTool={setTool}
        onClear={handleClearCanvas}
        colors={COLORS}
      />

      {/* Footer */}
      <footer className="relative z-10 py-2 md:py-3 text-center">
        <p className="text-xs text-gray-400 font-body">
          Requested by <span className="text-gray-500">@PauliusX</span> · Built by <span className="text-gray-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
