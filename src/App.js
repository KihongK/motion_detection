/*
 
�ۼ� ������ ��� ����߽��ϴ�. (���� �������� �����մϴ�.)

1. Install dependencies  -- Done
����� ����� ��ġ�ϴ� �����Դϴ�.
#react webcam, tensorflow js, posenet model
npm install @tensorflow/tfjs @tensorflow-models/posenet react-webcam

2. Import dependencies -- DONE
��ġ�� ����� �ڵ����� package.json�� ����ǹǷ� ȣ�⸸ �ϸ� �˴ϴ�.


3. Setup webcam and canvas -- DONE
web cam�� ���״�� �����ϸ�Ȱ� canvas�� web cam�� ��µǴ� ȭ�鿡 �츮�� ���� �׷����� ���� ���մϴ�.

4. Define references to those -- DONE

5. Load posnet -- DONE

6. Detect function -- DONE

7. Drawing utilities from tensorflow -- DONE
 utilities.js �� �����ϰ� �ڵ带 ȣ���մϴ�.

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
    // scale �� ���̸� ��Ȯ�� ���߸� �ӵ�  trade off ����

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
