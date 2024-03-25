import React, { useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import { Holistic, POSE_CONNECTIONS, FACEMESH_TESSELATION} from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import { checkZValues } from "./algorithms/checkZValues";
import { checkDistance } from "./algorithms/checkDistance"; 
import { checkAngle } from "./algorithms/checkAngle";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    // Other code remains unchanged

    holistic.onResults((results) => {
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 1});
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {color: '#FF0000', lineWidth: 0.5});

        const rightShoulder = results.poseLandmarks && results.poseLandmarks[12];
        const leftShoulder = results.poseLandmarks && results.poseLandmarks[11];

        if (rightShoulder && leftShoulder) {
            const shoulderMidPoint = (rightShoulder + leftShoulder) / 2;
            const noseLandmark = results.faceLandmarks && results.faceLandmarks[0];
            const chinLandmark = results.faceLandmarks && results.faceLandmarks[152];

            // z값을 이용해서 거북목 자세인지 판단//코 어깨중심
            // const Zvalues= checkZValues(noseLandmark, shoulderMidPoint);
            //턱끝과 어깨 중심 사이 거리
            const distance = checkDistance(chinLandmark, shoulderMidPoint);
            //턱끝과 어깨 중심의 2차원 각도 계산
           // const angle = checkAngle(chinLandmark, shoulderMidPoint);


            if(noseLandmark){
              //if(Zvalues||distance||angle){
              if(distance){
                canvasCtx.font = "30px Arial";
                canvasCtx.fillStyle = "red";
                canvasCtx.fillText("올바르지 않은 자세입니다.", 10, 50);
              }else {
                canvasCtx.font = "30px Arial";
                canvasCtx.fillStyle = "green";
                canvasCtx.fillText("정상 자세입니다.", 10, 50);
              }
            }else{
              canvasCtx.font = "30px Arial";
                canvasCtx.fillStyle = "red";
                canvasCtx.fillText("인식이 제대로 되지 않는군요.", 10, 50);
            }

        }

        canvasCtx.restore();
      });

    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({image: webcamRef.current.video});
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <div className="App">
      <Webcam ref={webcamRef} style={{position: "absolute", marginLeft: "auto", marginRight: "auto", left: 0, right: 0, textAlign: "center", zindex: 9, width: 640, height: 480}} />
      <canvas ref={canvasRef} style={{position: "absolute", marginLeft: "auto", marginRight: "auto", left: 0, right: 0, textAlign: "center", zindex: 8, width: 640, height: 480}} />
    </div>
  );
}

export default App;
