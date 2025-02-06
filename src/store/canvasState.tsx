import { makeAutoObservable } from "mobx";

class canvasState {
  canvas: HTMLCanvasElement | null = null;
  undo: string[] = [];
  redo: string[] = [];
  username: string | undefined = "";
  socket: WebSocket | null = null;
  sessionId: string | undefined = "";
  color: string | undefined = "";
  constructor() {
    makeAutoObservable(this);
  }

  setCanvas(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas;
  }

  setUndo(undo: string | undefined) {
    if (!undo) return;
    this.undo.push(undo);
  }

  setRedo(redo: string) {
    this.redo.push(redo);
  }

  undoFoo() {
    if (!this.canvas) return;

    let ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    if (this.undo.length > 0) {
      let dataUrl = this.undo.pop();
      if (!dataUrl) return;

      this.redo.push(this.canvas.toDataURL());

      let img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
        ctx.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
      };
    } else {
      ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    }
  }

  redoFoo() {
    if (!this.canvas) return;

    let ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    if (this.redo.length > 0) {
      let dataUrl = this.redo.pop();
      if (!dataUrl) return;

      this.undo.push(this.canvas.toDataURL());

      let img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
        ctx.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
      };
    }
  }

  setUsername(username: string | undefined) {
    this.username = username;
  }

  setSocket(socket: WebSocket | null) {
    this.socket = socket;
  }
  setSessionId(sesionId: string | undefined) {
    this.sessionId = sesionId;
  }

  setColor(color: string | undefined) {
    this.color = color;
  }
}

export default new canvasState();
