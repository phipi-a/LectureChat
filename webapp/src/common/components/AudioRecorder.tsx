"use client";

import React, { useEffect } from "react";

export function AudioRecorder({
  newAudioBlobCallback,
  recordingStateCallback,
  longPauseCallback,
}: {
  newAudioBlobCallback: (blob: Blob) => void;
  recordingStateCallback: (state: "recording" | "stoped") => void;
  longPauseCallback: () => void;
}) {
  const animationFrameId = React.useRef<number | null>(null);
  const steamRef = React.useRef<MediaStream | null>(null);
  const [recording, setRecording] = React.useState(false);
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
        if (max < 150) {
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
  return {
    stopAudioRecording: () => {
      setRecording(false);
      cancelAnimationFrame(animationFrameId.current!);
      if (steamRef.current === null) {
        return;
      }
      for (const track of steamRef.current!.getTracks()) {
        track.stop();
      }
    },
    startAudioRecording: () => {
      setRecording(true);
    },
  };
}
