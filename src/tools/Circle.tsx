import Tool from "./Tool";
export default class Circle extends Tool {
  mouseDown: boolean = false;
  startX: number = 0;
  startY: number = 0;
  saved: string = "";
  width: number = 0;
  height: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    id: string,
    color: string
  ) {
    super(canvas, socket, id, color);
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
          type: "circle",
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
      let radius =
        Math.sqrt(this.width * this.width + this.height * this.height) / 2;
      this.draw(this.startX, this.startY, radius, 0, Math.PI * 2);
    }
  }

  draw(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, startAngle, endAngle);
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
    let radius = Math.sqrt(w * w + h * h) / 2;
    let startAngle = 0;
    let endAngle = Math.PI * 2;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
    ctx.stroke();
  }
}
