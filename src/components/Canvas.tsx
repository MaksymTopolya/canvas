import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import "../styles/canvas.scss";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Circle from "../tools/Circle";
import { Button, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { DrawMessage } from "../lib/interfaces";
import Rect from "../tools/Rect";
import axios from "axios";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import { ToastContainer, toast } from "react-toastify";

const Canvas = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const [show, setShow] = useState(true);
  const params = useParams();

  const notify = (name: string) => toast(`${name} connected`);

  useEffect(() => {
    console.log(toolState.color);
  }, [toolState.color]);

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    if (!canvasRef.current) return;
    let ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    axios
      .get(`https://severcanvas-1.onrender.com/image?id=${params.id}`)
      .then((response) => {
        console.log(response);
        const img = new Image();
        img.src = response.data;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          );
        };
      });
  }, [params.id]);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(`wss://severcanvas-1.onrender.com`);

      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      if (canvasRef.current && params.id) {
        toolState.setTool(
          new Brush(
            canvasRef.current,
            socket,
            params.id,
            toolState.width,
            "#000000"
          )
        );
      }

      socket.onopen = () => {
        console.log("Connected");
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };

      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            // console.log(`${msg.username} connected`);
            notify(msg.username);
            break;

          case "draw":
            drawHandler(msg);
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg: DrawMessage) => {
    const figure = msg.figure;

    const ctx = canvasRef.current?.getContext("2d");
    const prevColor = ctx!.strokeStyle;
    switch (figure.type) {
      case "brush":
        Brush.staticDraw(figure.x, figure.y, ctx!, figure.color, figure.width);
        break;
      case "rect":
        Rect.staticDraw(
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          ctx!,
          figure.color
        );
        break;
      case "circle":
        Circle.staticDraw(
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          ctx!,
          figure.color
        );
        break;
      case "eraser":
        Eraser.eraserDraw(figure.x, figure.y, ctx!, figure.width);
        break;
      case "line":
        Line.staticDraw(
          figure.x,
          figure.y,
          figure.endX,
          figure.endY,
          ctx!,
          figure.color,
          figure.width
        );
        break;
      case "finish":
        ctx?.beginPath();
        break;
    }
    ctx!.lineWidth = toolState.width;
    ctx!.strokeStyle = prevColor;
    ctx!.fillStyle = prevColor;
    console.log(prevColor);
  };

  const mouseDownHandler = () => {
    canvasState.setUndo(canvasRef.current?.toDataURL());
    axios
      .post(`https://severcanvas-1.onrender.com/image?id=${params.id}`, {
        img: canvasRef.current?.toDataURL(),
      })
      .then(() => {
        console.log("Image saved");
      });
  };

  const connectionHandler = () => {
    canvasState.setUsername(usernameRef.current?.value);
    setShow(false);
  };

  return (
    <div className="canvas">
      {/* <ToastContainer aria-label="toast-container" /> */}
      <Modal show={show} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectionHandler()}>
            Log in
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        ref={canvasRef}
        onMouseDown={() => mouseDownHandler()}
        id="canvas"
        width={800}
        height={600}
      />
    </div>
  );
});

export default Canvas;
