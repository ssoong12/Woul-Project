import { useEffect, useState } from "react";
import RecordRTC from "recordrtc";

/**
 * 
 * @param {*} props .setAudioFile : {setstate} 상위 state에서 제출에 사용할 audio 파일설정
 * @returns 음성을 녹음할 수 있는 state
 */
const AudioRecorder = (props) => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audio, setAudio] = useState(null);
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    getMicrophonePermission()
  }, [])

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");

    let tempRecorder = RecordRTC(stream, {
      type: "audio",
      mimeType: "audio/wav",
      recorderType: RecordRTC.StereoAudioRecorder,
    });

    console.log(recorder);
    tempRecorder.startRecording();
    setRecorder(tempRecorder);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");

    recorder.stopRecording(function () {
      // 레코더에 저장된 데이터를 blob 형식으로 얻음
      let blob = recorder.getBlob();
      const audioUrl = URL.createObjectURL(blob);
      console.log(audioUrl);
      setAudio(audioUrl);

      // 파일 생성
      const sound = new File([blob], "soundBlob", {
        lastModified: new Date().getTime(),
        type: "audio/wav",
      });
      props.setAudioFile(sound);
      console.log("파일:", URL.createObjectURL(sound));
    });
  };

  return (
    <div>
      {/* <h2>Audio Recorder</h2> */}
      <main>
        <div className="audio-controls">
          {/* {!permission ? (
            <button onClick={getMicrophonePermission} type="button">
              마이크 사용 권한 획득
            </button>
          ) : null} */}
          {permission && recordingStatus === "inactive" ? (
            <button className="back_white_btn" onClick={startRecording} type="button">
              녹음 시작
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button className="back_white_btn" onClick={stopRecording} type="button">
              녹음 정지
            </button>
          ) : null}
        </div>
        {audio ? (
          <div className="audio-container" style={{ marginTop : '20px' }}>
            <audio src={audio} controls></audio>
            {/* <a download href={audio}>
              Download Recording
            </a> */}
          </div>
        ) : null}
      </main>
    </div>
  );
};
export default AudioRecorder;
