import Tool from "./Tool";

export default class Line extends Tool {
  mouseDown: boolean = false;
  startX: number = 0;
  startY: number = 0;
  saved: string = "";
  endX: number = 0;
  endY: number = 0;

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

  mouseUpHandler() {
    this.mouseDown = false;
    this.socket!.send(
      JSON.stringify({
        id: this.sessionId,
        method: "draw",
        figure: {
          type: "line",
          x: this.startX,
          y: this.startY,
          endX: this.endX,
          endY: this.endY,
          color: this.ctx?.fillStyle,
        },
      })
    );
  }

  mouseDownHandler(e: MouseEvent) {
    if (!this.ctx || !this.canvas) return;

    this.mouseDown = true;
    this.ctx.beginPath();
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e: MouseEvent) {
    if (!this.mouseDown) return;
    this.endX = e.offsetX;
    this.endY = e.offsetY;
    this.draw(this.startX, this.startY, e.offsetX, e.offsetY);
  }

  draw(startX: number, startY: number, endX: number, endY: number) {
    if (!this.ctx) return;
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    };
  }

  static staticDraw(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    ctx: CanvasRenderingContext2D,
    color: string
  ) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.strokeStyle = color;
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}
