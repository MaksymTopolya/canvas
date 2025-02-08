import Tool from "./Tool";
export default class Brush extends Tool {
  mouseDown: boolean = false;
  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    id: string,
    width: number,
    color: string
  ) {
    super(canvas, socket, id, color);
    this.lineWidth = width;
    // this.strokeColor(color);
    this.listener();
  }

  listener() {
    if (!this.canvas) return;
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseDownHandler(e: MouseEvent) {
    if (!this.ctx) return;

    this.mouseDown = true;

    this.ctx.beginPath();
    this.ctx.moveTo(
      e.pageX - (e.target as HTMLElement).offsetLeft,
      e.pageY - (e.target as HTMLElement).offsetTop
    );
  }

  mouseUpHandler() {
    this.mouseDown = false;
    if (!this.socket) return;
    this.socket.send(
      JSON.stringify({
        id: this.sessionId,
        method: "draw",
        figure: {
          type: "finish",
          color: this.ctx?.strokeStyle,
          width: this.ctx?.lineWidth,
        },
      })
    );
  }
  mouseMoveHandler(e: MouseEvent) {
    if (!this.ctx) return;

    if (this.mouseDown) {
      this.draw(
        e.pageX - (e.target as HTMLElement).offsetLeft,
        e.pageY - (e.target as HTMLElement).offsetTop,
        this.ctx,
        this.ctx.strokeStyle
      );
      if (!this.socket) return;
      this.socket.send(
        JSON.stringify({
          id: this.sessionId,
          method: "draw",
          figure: {
            type: "brush",
            x: e.pageX - (e.target as HTMLElement).offsetLeft,
            y: e.pageY - (e.target as HTMLElement).offsetTop,
            color: this.ctx?.strokeStyle,
            width: this.ctx?.lineWidth,
          },
        })
      );
    }
  }

  draw(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    color: string | CanvasGradient | CanvasPattern
  ) {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = this.lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  static staticDraw(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    color: string,
    width: number
  ) {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
