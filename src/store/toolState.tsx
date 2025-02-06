import { makeAutoObservable } from "mobx";
import Tool from "../tools/Tool";

class ToolState {
  color: string = "#000000";
  tool: Tool | null = null;
  width: number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool: any) {
    this.tool = tool;
  }

  setFillColor(color: string) {
    this.color = color;
    if (this.tool) this.tool.fillColor = color;
  }

  setStrokeColor(color: string) {
    this.color = color;
    if (this.tool) this.tool.strokeColor = color;
  }

  setLineWidth(width: number) {
    this.width = width;
    if (this.tool) this.tool.lineWidth = width;
  }
}

export default new ToolState();
