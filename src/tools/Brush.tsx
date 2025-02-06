import Tool from "./Tool";
export default class Brush extends Tool {
  mouseDown: boolean = false;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
    super(canvas, socket, id);

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
    // this.ctx.strokeStyle = this.color;
    if (this.mouseDown) {
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

  static draw(
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
