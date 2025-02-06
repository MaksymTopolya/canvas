import Tool from "./Tool";
export default class Rect extends Tool {
  mouseDown: boolean = false;
  startX: number = 0;
  startY: number = 0;
  saved: string = "";
  width: number = 0;
  height: number = 0;

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
          type: "rect",
          x: this.startX,
          y: this.startY,
          width: this.width,
          height: this.height,
          color: this.ctx?.fillStyle,
        },
      })
    );
  }

  mouseDownHandler(e: MouseEvent) {
    if (!this.ctx || !this.canvas) return;
    this.mouseDown = true;
    this.ctx.beginPath();
    this.startX = e.pageX - (e.target as HTMLElement).offsetLeft;
    this.startY = e.pageY - (e.target as HTMLElement).offsetTop;
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.mouseDown) {
      let currentX = e.pageX - (e.target as HTMLElement).offsetLeft;
      let currentY = e.pageY - (e.target as HTMLElement).offsetTop;
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;
      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }

  draw(x: number, y: number, w: number, h: number) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.rect(x, y, w, h);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }

  static staticDraw(
    x: number,
    y: number,
    w: number,
    h: number,
    ctx: CanvasRenderingContext2D,
    color: string
  ) {
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
  }
}
