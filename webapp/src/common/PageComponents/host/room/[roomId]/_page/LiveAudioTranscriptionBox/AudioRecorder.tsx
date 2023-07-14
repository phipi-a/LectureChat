"use client";

import React, { useEffect } from "react";

export function AudioRecorder({
  newAudioBlobCallback,
  recordingStateCallback,
  longPauseCallback,
  recordingMuteState,
}: {
  newAudioBlobCallback: (blob: Blob) => void;
  recordingStateCallback: (state: "recording" | "stoped") => void;
  longPauseCallback: () => void;
  recordingMuteState: boolean;
}) {
  const animationFrameId = React.useRef<number | null>(null);
  const steamRef = React.useRef<MediaStream | null>(null);
  const [recording, setRecording] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(0);
  const maxValueRef = React.useRef(200);
  const [silence_border, setSilence_border] = React.useState(150);
  const silence_border_ref = React.useRef(silence_border);

  useEffect(() => {
    if (recording) {
      let currentAudioState = "longPause";
      let currentAudioStateTime = 0;
      let mediaRecorder: MediaRecorder | null = null;
      let audioAnalyser: AnalyserNode | null = null;
      const analyzeAudio = () => {
        const dataArray = new Uint8Array(audioAnalyser!.frequencyBinCount);
        audioAnalyser!.getByteFrequencyData(dataArray);
        // check if audio is loud enough
        let max = 0;
        for (let i = 0; i < dataArray.length; i++) {
          if (max < dataArray[i]) {
            max = dataArray[i];
          }
        }
        maxValueRef.current = Math.max(maxValueRef.current, max);
        setCurrentValue(max);
        console.log(silence_border_ref.current, max);
        if (max < silence_border_ref.current) {
          if (currentAudioState === "audio") {
            currentAudioStateTime = Date.now();
            currentAudioState = "silence";
          } else if (currentAudioState === "silence") {
            if (Date.now() - currentAudioStateTime > 500) {
              mediaRecorder?.stop();

              currentAudioState = "stoped";
            }
          } else if (currentAudioState === "stoped") {
            if (Date.now() - currentAudioStateTime > 3000) {
              longPauseCallback();
              currentAudioState = "longPause";
            }
          }
        } else {
          if (
            currentAudioState === "silence" ||
            currentAudioState === "stoped" ||
            currentAudioState === "longPause"
          ) {
            if (
              currentAudioState === "stoped" ||
              currentAudioState === "longPause"
            ) {
              mediaRecorder?.start();
            }
            currentAudioState = "audio";
          }
        }

        animationFrameId.current = requestAnimationFrame(analyzeAudio);
      };
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(function (stream) {
          steamRef.current = stream;
          const audioContext = new AudioContext();
          audioAnalyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(audioAnalyser);

          var options = {
            mimeType: "audio/webm;codecs=opus",
          };
          // add delay to recording
          let audioChunks: BlobPart[] = [];
          const delayNode = audioContext.createDelay();
          delayNode.delayTime.value = 0.5;
          microphone.connect(delayNode);

          const dest = audioContext.createMediaStreamDestination();
          delayNode.connect(dest);

          mediaRecorder = new MediaRecorder(dest.stream, options);
          mediaRecorder.addEventListener("dataavailable", function (event) {
            audioChunks.push(event.data);
          });
          mediaRecorder.addEventListener("start", function () {
            recordingStateCallback("recording");
          });
          mediaRecorder.addEventListener("stop", function () {
            recordingStateCallback("stoped");
            const audioBlob = new Blob(audioChunks);
            //check if audio is loud enough
            audioBlob.arrayBuffer().then((buffer) => {
              const audioContext = new AudioContext();
              audioContext.decodeAudioData(buffer, (audioBuffer) => {
                const channelData = audioBuffer.getChannelData(0);
                const bufferLength = channelData.length;
                // get max value from channel data
                let max = 0;
                for (let i = 0; i < bufferLength; i++) {
                  if (max < channelData[i]) {
                    max = channelData[i];
                  }
                }
                if (max < 0.1 || audioBuffer.duration < 1) {
                  return;
                } else {
                  newAudioBlobCallback(audioBlob);
                }
              });
            });
          });
          mediaRecorder.addEventListener("start", function () {
            audioChunks = [];
          });
          analyzeAudio();
        });
    }
  }, [recording]);
  useEffect(() => {
    return () => {
      stopAudioRecording();
    };
  }, []);
  function stopAudioRecording() {
    if (recordingMuteState) {
      setRecording(true);
    } else {
      setRecording(false);
      cancelAnimationFrame(animationFrameId.current!);
      if (steamRef.current === null) {
        return;
      }
      for (const track of steamRef.current!.getTracks()) {
        track.stop();
      }
    }
  }

  useEffect(() => {
    stopAudioRecording();
  }, [recordingMuteState]);
  return (
    <>
      <div
        style={{
          width: "20px",
          height: "70px",
          background: "rgba(0,0,0,0.5)",
          position: "relative",
          borderRadius: "5px",
        }}
        onClick={(e) => {
          //get position relative to div
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const height = rect.height;
          const value = (y / height) * maxValueRef.current;
          setSilence_border(value);
          silence_border_ref.current = value;
        }}
      >
        <div
          style={{
            top: 0,
            position: "absolute",
            left: 0,
            borderRadius: "2px",

            width: "20px",

            height: `${(currentValue * 70) / maxValueRef.current}px`,
            background: "red",
          }}
        />
        <div
          style={{
            width: "20px",
            height: `2px`,
            top: `${(silence_border * 70) / maxValueRef.current}px`,
            position: "absolute",
            background: "green",
          }}
        />
      </div>
    </>
  );
}
