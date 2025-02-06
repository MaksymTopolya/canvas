import "../styles/toolBar.scss";
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

export default function ToolBar() {
  const download = () => {
    const dataUrl = canvasState.canvas!.toDataURL();
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = canvasState.sessionId + ".jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  console.log(toolState.color);
  return (
    <div className="toolbar">
      <div className="tools">
        <button
          className="button Brush"
          onClick={() => {
            if (canvasState.canvas) {
              toolState.setTool(
                new Brush(
                  canvasState.canvas,
                  canvasState.socket!,
                  canvasState.sessionId!
                )
              );
            }
          }}
        ></button>
        <button
          className="button Rect"
          onClick={() => {
            if (canvasState.canvas) {
              toolState.setTool(
                new Rect(
                  canvasState.canvas,
                  canvasState.socket!,
                  canvasState.sessionId!
                )
              );
            }
          }}
        ></button>
        <button
          className="button Circle"
          onClick={() => {
            if (canvasState.canvas) {
              toolState.setTool(
                new Circle(
                  canvasState.canvas,
                  canvasState.socket!,
                  canvasState.sessionId!
                )
              );
            }
          }}
        ></button>
        <button
          className="button Eraser"
          onClick={() => {
            if (canvasState.canvas) {
              toolState.setTool(
                new Eraser(
                  canvasState.canvas,
                  canvasState.socket!,
                  canvasState.sessionId!
                )
              );
            }
          }}
        ></button>
        <button
          className="button Line"
          onClick={() => {
            if (canvasState.canvas) {
              toolState.setTool(
                new Line(
                  canvasState.canvas,
                  canvasState.socket!,
                  canvasState.sessionId!
                )
              );
            }
          }}
        ></button>
        <input
          type="color"
          onChange={(e) => {
            toolState.setFillColor(e.target.value);
            toolState.setStrokeColor(e.target.value);
          }}
        />
      </div>

      <div className="tools">
        <button
          className="button Last"
          onClick={() => canvasState.undoFoo()}
        ></button>
        <button
          className="button Next"
          onClick={() => canvasState.redoFoo()}
        ></button>
        <button className="button Save" onClick={() => download()}></button>
      </div>
    </div>
  );
}
