import { useEffect, useRef, useState } from "react";

function App() {
  const [recorder, setRecorder] = useState(null);

  const [screenStream, setScreenStream] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const [chunks, setChunks] = useState([]);
  const [downloadLink, setdownloadLink] = useState("#");

  const [initVideoRecording, setInitVideoRecording] = useState(false);
  const [initScreenRecording, setInitScreenRecording] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isDoneRecording, setIsDoneRecording] = useState(false);

  const recordingVideo = useRef();
  const recordedVideo = useRef();

  // Start Recording
  useEffect(() => {
    console.log({
      videoStream: videoStream,
      screenStream: screenStream,
      audioStream: audioStream,
      initVideoRecording: initVideoRecording,
      initScreenRecording: initScreenRecording,
    });

    if (initScreenRecording) {
      startScreenRecording();
      return;
    }

    if (initVideoRecording) {
      startVideoRecording();
      return;
    }
  }, [initVideoRecording, initScreenRecording]);

  // Setup Video Recording
  async function setupVideoRecording() {
    try {
      // Setup Video Recorder
      const newVideoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setVideoStream(newVideoStream);

      // setInitVideoRecording
      setInitVideoRecording(true);
    } catch (error) {
      console.warn("setupStream:", { error });
    }
  }

  // Setup Screen Recording
  async function setupScreenRecording() {
    try {
      // Setup Screen Recorder
      const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      setScreenStream(newScreenStream);

      // Setup Audio Recorder
      const newAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setAudioStream(newAudioStream);

      // setIsInitRecording
      setInitScreenRecording(true);
    } catch (error) {
      console.warn("setupStream:", { error });
    }
  }

  // setupVideoFeedback
  function setupVideoFeedback() {
    if (!videoStream && !screenStream) {
      console.warn("No Stream Available");
      return;
    }

    if (recordingVideo.current.srcObject) {
      return;
    }

    if (videoStream) {
      recordingVideo.current.srcObject = videoStream;
    } else if (screenStream) {
      recordingVideo.current.srcObject = screenStream;
    }

    recordingVideo.current.play();
  }

  // Start Video Recording
  async function startVideoRecording() {
    if (isRecording) {
      return;
    }

    console.log("Start Video Recording");

    if (!videoStream) {
      console.warn("Something went wrong!");
      console.log({ stream: videoStream });
      return;
    }

    // Setup Recorder
    const _recorder = new MediaRecorder(videoStream);
    _recorder.ondataavailable = handleDataAvailable;
    _recorder.onstop = handleDataStop;
    _recorder.start(1000);

    setRecorder(_recorder);
    setIsRecording(true);

    // Setup Video Feedback
    setupVideoFeedback();

    console.log("Recording has started");
  }

  // Start Screen Recording
  async function startScreenRecording() {
    if (isRecording) {
      return;
    }

    console.log("Start Screen Recording");

    if (!screenStream || !audioStream) {
      console.warn("Something went wrong!");
      console.log({ stream: screenStream, audio: audioStream });
      return;
    }

    const newMixedStream = new MediaStream([
      ...screenStream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    // Setup Recorder
    const _recorder = new MediaRecorder(newMixedStream);
    _recorder.ondataavailable = handleDataAvailable;
    _recorder.onstop = handleDataStop;
    _recorder.start(1000);

    setRecorder(_recorder);

    setIsRecording(true);

    // Setup Video Feedback
    setupVideoFeedback();

    console.log("Recording has started");
  }

  // Handle Data Available
  function handleDataAvailable(event) {
    setChunks((currentChunks) => {
      console.log({ currentChunks, data: event.data });

      if (!currentChunks) {
        currentChunks = [];
      }

      return [...currentChunks, event.data];
    });
  }

  // Stop Recording
  function stopRecording() {
    recorder.stop();

    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setInitVideoRecording(false);
    } else if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      audioStream.getTracks().forEach((track) => track.stop());
      setInitScreenRecording(false);
    }

    setIsRecording(false);
  }

  // Handle Data Available
  function handleDataStop(event) {
    setChunks((currentChunks) => {
      const blob = new Blob(currentChunks, { type: "video/mp4" });

      const _downloadLink = URL.createObjectURL(blob);
      setdownloadLink(_downloadLink);

      recordedVideo.current.src = _downloadLink;
      recordedVideo.current.load();
      recordedVideo.current.onLoadedData = function () {
        recordedVideo.current.play();
        console.log("play recordedVideo");
      };

      console.log({
        currentChunks,
        blob,
        _downloadLink,
        recordedVideo,
      });

      return [];
    });

    setIsDoneRecording(true);
  }

  // reset
  function reset() {
    setRecorder(null);
    setScreenStream(null);
    setVideoStream(null);
    setAudioStream(null);
    setChunks([]);
    setdownloadLink("#");
    setInitVideoRecording(false);
    setInitScreenRecording(false);
    setIsRecording(false);
    setIsDoneRecording(false);

    if (recordingVideo.current.srcObject) {
      recordingVideo.current.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
        recordingVideo.current.srcObject.removeTrack(track);
      });
    }

    if (recordedVideo.current.srcObject) {
      recordedVideo.current.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
        recordedVideo.current.srcObject.removeTrack(track);
      });
    }
  }

  return (
    <>
      {/* Navbar */}
      <header className="bg-gray-900">
        <div className="container max-auto flex justify-center items-center py-4">
          <h1 className="text-2xl font-bold uppercase">
            Screen & Video Recoder
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="overflow-hidden max-w-3xl mr-auto ml-auto">
        {/* recording-video-wrap */}
        <div
          className={
            "recording-video-wrap container mx-auto py-8 px-4 mb-4" +
            (isDoneRecording ? " hidden" : "")
          }
        >
          <video
            ref={recordingVideo}
            src=""
            autoPlay
            className="video-feedback bg-black w-full aspect-video mb-4"
          ></video>

          {!isRecording && (
            <div className="flex justify-center items-center -mx-4">
              <button
                type="button"
                className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
                onClick={setupVideoRecording}
              >
                Record Video
              </button>
              <button
                type="button"
                className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
                onClick={setupScreenRecording}
              >
                Record Screen
              </button>
            </div>
          )}

          {isRecording && (
            <div className="flex justify-center items-center -mx-4">
              <button
                type="button"
                className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
                disabled={!isRecording}
                onClick={stopRecording}
              >
                Stop Recording
              </button>
            </div>
          )}
        </div>

        {/* recorded-video-wrap */}
        <div
          className={
            "recorded-video-wrap container mx-auto py-8 px-4" +
            (!isDoneRecording ? " hidden" : "")
          }
        >
          <video
            ref={recordedVideo}
            src=""
            autoPlay
            controls
            className="recorded-video bg-black w-full aspect-video mb-4"
          ></video>

          <div className="flex justify-center items-center -mx-4">
            <a
              href={downloadLink}
              download="video.mp4"
              type="button"
              className="download-video text-center mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
            >
              Download Video
            </a>
            <button
              download="video.mp4"
              type="button"
              className="download-video text-center mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
              onClick={reset}
            >
              Record Another One
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
