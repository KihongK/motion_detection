/*
 
작성 순서를 기록 기록했습니다. (실행 과정과는 무관합니다.)

1. Install dependencies  -- Done
사용할 모듈을 설치하는 과정입니다.
#react webcam, tensorflow js, posenet model
npm install @tensorflow/tfjs @tensorflow-models/posenet react-webcam

2. Import dependencies -- DONE
설치한 모듈은 자동으로 package.json에 저장되므로 호출만 하면 됩니다.


3. Setup webcam and canvas -- DONE
web cam은 말그대로 이해하면된고 canvas는 web cam이 출력되는 화면에 우리의 모델이 그려지는 곳을 말합니다.

4. Define references to those -- DONE

5. Load posnet -- DONE

6. Detect function -- DONE

7. Drawing utilities from tensorflow -- DONE
 utilities.js 를 생성하고 코드를 호출합니다.

8. Draw functions -- DONE

*/


// 2. import dependencies
import React, { useRef } from 'react';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilites";

// 4. Define references to those
function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // 5. Load posenet
    const runPosenet = async () => {
        const net = await posenet.load({
            inputResolution: { width: 640, height: 480 },
            scale: 0.5
        })
        //set Interval
        setInterval(() => {
            detect(net)
        }, 100);
    };
    // scale 을 높이면 정확도 낮추면 속도  trade off 관계

    // 6. Detect function
    const detect = async (net) => {
        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
            //Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Make Detections
            const pose = await net.estimateSinglePose(video);
            console.log(pose);

            drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);

        }
    }

    // 8. Draw function
    const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext("2d");

        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        drawKeypoints(pose['keypoints'], 0.5, ctx);
        drawSkeleton(pose['keypoints'], 0.5, ctx);

    }

    runPosenet();

    // 3. setup webcam and canvas
    return (
        <div className="App">
            
            <header className="App-header">
                <Webcam
                    ref={webcamRef}
                    style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: 640,
                    height: 480
                }} />

                <canvas
                    ref={canvasRef}
                    style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: 640,
                    height: 480
                }} />





            </header>
        </div>
    );
}

export default App;
