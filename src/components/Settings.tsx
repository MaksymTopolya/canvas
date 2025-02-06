import toolState from "../store/toolState";
import "../styles/toolBar.scss";

export default function Settings() {
  return (
    <div className="settings">
      <label htmlFor="lineWidth" style={{ margin: "0 10px" }}>
        Line Width
      </label>
      <input
        type="number"
        defaultValue={1}
        min="1"
        max="50"
        id="lineWidth"
        style={{ margin: "0 10px" }}
        onChange={(e) => {
          toolState.setLineWidth(Number(e.target.value));
        }}
      />
    </div>
  );
}
