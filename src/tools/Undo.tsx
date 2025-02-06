export default class RedoOrUndo {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  saved: string[] = [];

  constructor(canvas: HTMLCanvasElement, saved: string[]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.saved = saved;
  }

  undo() {
    if (this.saved.length > 0) this.saved.pop();
  }
}
