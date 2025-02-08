import Brush from "./Brush";

export default class Eraser extends Brush {
  mouseDown: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    id: string,
    width: number
  ) {
    super(canvas, socket, id, width, "white");
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      this.draw(
        e.pageX - (e.target as HTMLElement).offsetLeft,
        e.pageY - (e.target as HTMLElement).offsetTop,
        this.ctx!
      );
      if (!this.socket) return;
      this.socket.send(
        JSON.stringify({
          id: this.sessionId,
          method: "draw",
          figure: {
            type: "eraser",
            x: e.pageX - (e.target as HTMLElement).offsetLeft,
            y: e.pageY - (e.target as HTMLElement).offsetTop,
            width: this.ctx?.lineWidth,
          },
        })
      );
    }
  }

  draw(x: number, y: number, ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    ctx.strokeStyle = "white";
    ctx.lineWidth = this.lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  static eraserDraw(
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
