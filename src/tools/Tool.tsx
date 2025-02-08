export default class Tool {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  socket: WebSocket | null;
  sessionId: string | undefined;

  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    id: string,
    color: string
    // width: number
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.socket = socket;
    this.sessionId = id;

    this.ctx && (this.ctx.strokeStyle = color);
    // this.ctx && (this.ctx.lineWidth = width);

    this.removeEventListeners();
  }

  set fillColor(color: string) {
    if (!this.ctx) return;
    this.ctx.fillStyle = color;
  }

  set strokeColor(color: string) {
    if (!this.ctx) return;
    this.ctx.strokeStyle = color;
  }

  set lineWidth(width: number) {
    if (!this.ctx) return;
    this.ctx.lineWidth = width;
  }

  removeEventListeners() {
    if (!this.canvas) return;

    this.canvas.onmousedown = null;
    this.canvas.onmouseup = null;
    this.canvas.onmousemove = null;
  }
}
