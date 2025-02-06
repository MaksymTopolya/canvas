import Brush from "./Brush";

export default class Eraser extends Brush {
  mouseDown: boolean = false;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id);
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      if (!this.socket) return;
      this.socket.send(
        JSON.stringify({
          id: this.sessionId,
          method: "draw",
          figure: {
            type: "eraser",
            x: e.pageX - (e.target as HTMLElement).offsetLeft,
            y: e.pageY - (e.target as HTMLElement).offsetTop,
            color: this.ctx?.strokeStyle,
            width: this.ctx?.lineWidth,
          },
        })
      );
    }
  }

  static drawEraser(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    width: number
  ) {
    if (!ctx) return;
    ctx.strokeStyle = "white";
    ctx.lineWidth = width;
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
