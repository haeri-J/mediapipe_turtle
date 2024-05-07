import React, { useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import { Holistic, POSE_CONNECTIONS, FACEMESH_TESSELATION } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import { checkZValues } from "./algorithms/checkZValues";
import { checkDistance } from "./algorithms/checkDistance"; 
import { checkAngle } from "./algorithms/checkAngle";
import { check3D } from "./algorithms/check3D";

//추가해야 할 사항
//1. 백엔드로 알림 테이블 형식에 맞는 정보 보내기
//2. 자세가 흐트러지고 바로 알람이 뜨는 것이 아닌, 몇 분 뒤에 알람 뜨도록 구현.

function PoseDetector() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
  
    useEffect(() => {
      const holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        },
      });

      // // 백엔드 엔드포인트 URL 및 클라이언트 ID
      const BACKEND_URL = "https://docturtle.site/alert";//예시임 수정 필요
      const CLIENT_ID = "your-client-id";//예시임 수정 필요

      // 알람을 백엔드로 보내는 함수
      // function sendAlertToBackend() {
      //   const now = new Date();// 현재 시간 가져오는 함수
      //   fetch(BACKEND_URL, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       clientId: CLIENT_ID,
      //       timestamp: now.toISOString(),
      //       date: now.toLocaleDateString(),
      //       time: now.toLocaleTimeString(),
      //     }),
      //   })
      //   .then(response => response.json())
      //   .then(data => {
      //     console.log('Success:', data);
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error);
      //   });
      // }
  
      // Other code remains unchanged
  
      holistic.onResults((results) => {
          const canvasCtx = canvasRef.current.getContext("2d");
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
  
          drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 1.5});
          drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {color: '#FFFFFF', lineWidth: 0.5});
  
          const leftShoulder = results.poseLandmarks && results.poseLandmarks[11];
          const rightShoulder = results.poseLandmarks && results.poseLandmarks[12];
  
          if (rightShoulder && leftShoulder) {

  
              const shoulderMidPoint = [
                (rightShoulder.x + leftShoulder.x) / 2,
                (rightShoulder.y + leftShoulder.y) / 2,
                (rightShoulder.z + leftShoulder.z) / 2
              ];
  
              const noseLandmark = results.faceLandmarks && results.faceLandmarks[0];
              const chinLandmark = results.faceLandmarks && results.faceLandmarks[152]; // 턱 아래쪽 중앙 부근
  
              // z값을 이용해서 거북목 자세인지 판단 -> 코와 어깨중심 - 해리
              const Zvalues= checkZValues(noseLandmark, shoulderMidPoint); 
              //턱끝과 어깨 중심 사이 거리(distance) - 다은
              const distance = checkDistance(chinLandmark, shoulderMidPoint);
              //턱끝과 어깨 중심의 2차원 각도 계산(angle) - 다은
              const angle = checkAngle(chinLandmark, leftShoulder, shoulderMidPoint);
              //x,y,z을 이용한 목거리 계산 
              const three = check3D(chinLandmark, shoulderMidPoint);

             // const ZvaluesBool =  Zvalues >= 0.38;
             // const distanceBool = distance <= 0.15;
             //const ZvaluesBool =  Zvalues >= 0.38;
             //const distanceBool = distance <= 0.15;
              // const angleBool = (angle <= 60 || angle >= 130);



              const ZvaluesBool =  0.72 <= Zvalues <= 0.88;
              const distanceBool = distance <= 0.16;
              const angleBool = (angle <= 60 || angle >= 130);
              const threeBool = (three >= 0.5);

              // console.log("3D:"+ ZvaluesBool + Zvalues + "\n" );

              if(chinLandmark){ // 152번 랜드마크가 인식될 경우 
                 if( distanceBool && ZvaluesBool ){ 
                  canvasCtx.font = "10px Arial";
                  canvasCtx.fillStyle = "red";
                  canvasCtx.fillText("You have to fix your pose.", 10, 30);
                 // sendAlertToBackend(); // 백엔드로 알람
                }else {
                  canvasCtx.font = "10px Arial";
                  canvasCtx.fillStyle = "green";
                  canvasCtx.fillText("Your pose is normal", 10, 30);
                }
              }else{ // 0번 랜드마크 인식이 안될 경우 -> 예외 처리
                canvasCtx.font = "10px Arial";
                  canvasCtx.fillStyle = "red";
                  canvasCtx.fillText("No recognized...", 10, 30);
              }
              
              // Diaplay angle and distance in camera window 
              // 두 함수가 True or False만 리턴하기 때문에 값을 직접적으로 받아올 수 없음.???
              // canvasCtx.fillText(`Angle: ${...} degrees`);
              // canvasCtx.fillText(`Distance: ${...} pixels`);
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
  
  export default PoseDetector;
