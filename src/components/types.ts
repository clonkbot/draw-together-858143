export interface User {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface DrawingState {
  isDrawing: boolean;
  lastX: number;
  lastY: number;
}
