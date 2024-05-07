import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const PostureAnalysis = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState(null);
  const [postureFeedback, setPostureFeedback] = useState("");

 
  const analyzePosture = (poseLandmarks) => {
    // 어깨 랜드마크 추출
    const leftShoulder = poseLandmarks[5];
    const rightShoulder = poseLandmarks[6];
  
    // 어깨의 수평성 판별
    const shoulderLevelDifference = Math.abs(leftShoulder.y - rightShoulder.y);
    const isShoulderLevel = shoulderLevelDifference < 0.05; // 수평성 기준 임계값
  
    // 어깨 중심점 계산
    const shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
      z: (leftShoulder.z + rightShoulder.z) / 2,
    };
  
    // 코 랜드마크 추출
    const nose = poseLandmarks[0];
  
    // 머리의 전후 기울기 판별 (코와 어깨 중심점의 y 좌표 차이)
    const headTilt = Math.abs(nose.y - shoulderCenter.y);
    const isHeadForward = nose.z > shoulderCenter.z && headTilt < 0.05; // 머리가 앞으로 기울어진 정도
  
    let feedback = '';
  
    if (!isShoulderLevel) feedback += '주의: 어깨가 수평이 아닙니다. ';
    if (isHeadForward) feedback += '주의: 머리가 앞으로 기울어져 있습니다. 거북목 자세에 주의하세요. ';
  
    return feedback;
  };
  

  const onResults = (results) => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
      // 자세 분석 로직을 호출합니다.
      const postureAnalysis = analyzePosture(results.poseLandmarks);
      let feedback = "";
      if (postureAnalysis.isTurtleNeck) {
        feedback += "거북목 주의! ";
      }
      if (postureAnalysis.isShoulderAsymmetry) {
        feedback += "어깨 비대칭 주의! ";
      }
      if (postureAnalysis.isSpineBend) {
        feedback += "허리 굽힘 주의! ";
      }
      setPostureFeedback(feedback);

      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
      drawLandmarks(canvasCtx, results.poseLandmarks, {color: '#FF0000', lineWidth: 2});
    } else {
      setPostureFeedback("");
    }
    canvasCtx.restore();
  };

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({image: webcamRef.current.video});
        },
        width: 640,
        height: 480,
      });
      setCamera(camera);
      camera.start();
    }
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} style={{display: 'none'}} />
      <canvas ref={canvasRef} width="640" height="480" />
      {postureFeedback && <div style={{marginTop: "10px", fontSize: "18px", color: "red"}}>{postureFeedback}</div>}
    </div>
  );
};

export default PostureAnalysis;
