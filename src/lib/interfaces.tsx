export interface DrawMessage {
  method: "draw";
  figure:
    | { type: "brush"; x: number; y: number; color: string; width: number }
    | { type: "finish" }
    | {
        type: "rect";
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
      }
    | {
        type: "circle";
        x: number;
        y: number;
        width: number;
        height: number;
        color: string;
      }
    | { type: "eraser"; x: number; y: number; width: number }
    | {
        type: "line";
        x: number;
        y: number;
        endX: number;
        endY: number;
        color: string;
        width: number;
      };
}
