import { forwardRef, useEffect, useCallback } from 'react';
import { DrawingState } from './types';

interface CanvasProps {
  brushSize: number;
  brushColor: string;
  drawingState: DrawingState;
  setDrawingState: React.Dispatch<React.SetStateAction<DrawingState>>;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ brushSize, brushColor, drawingState, setDrawingState }, ref) => {
    const canvasRef = ref as React.RefObject<HTMLCanvasElement>;

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Save current drawing
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          tempCtx.drawImage(canvas, 0, 0);
        }

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.fillStyle = '#FFF8E7';
          ctx.fillRect(0, 0, rect.width, rect.height);

          // Restore drawing
          if (tempCanvas.width > 0 && tempCanvas.height > 0) {
            ctx.drawImage(
              tempCanvas,
              0,
              0,
              tempCanvas.width / dpr,
              tempCanvas.height / dpr
            );
          }
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }, [canvasRef]);

    const getCoordinates = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX: number, clientY: number;

        if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      },
      [canvasRef]
    );

    const startDrawing = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        const { x, y } = getCoordinates(e);
        setDrawingState({
          isDrawing: true,
          lastX: x,
          lastY: y,
        });

        // Draw a dot for single clicks
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = brushColor;
        ctx.fill();
      },
      [getCoordinates, setDrawingState, brushSize, brushColor, canvasRef]
    );

    const draw = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!drawingState.isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);

        ctx.beginPath();
        ctx.moveTo(drawingState.lastX, drawingState.lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        setDrawingState((prev) => ({
          ...prev,
          lastX: x,
          lastY: y,
        }));
      },
      [
        drawingState.isDrawing,
        drawingState.lastX,
        drawingState.lastY,
        getCoordinates,
        brushColor,
        brushSize,
        setDrawingState,
        canvasRef,
      ]
    );

    const stopDrawing = useCallback(() => {
      setDrawingState((prev) => ({
        ...prev,
        isDrawing: false,
      }));
    }, [setDrawingState]);

    return (
      <canvas
        ref={ref}
        className="absolute inset-0 cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    );
  }
);

Canvas.displayName = 'Canvas';
