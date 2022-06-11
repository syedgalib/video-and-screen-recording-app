import { useEffect, useRef, useState } from "react";

function App() {
  const [recorder, setRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [audio, setAudio] = useState(null);
  const [mixedStream, setMixedStream] = useState(null);
  const [chunks, setChunks] = useState([]);

  const [downloadLink, setdownloadLink] = useState("#");

  const [initRecording, setInitRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDoneRecording, setIsDoneRecording] = useState(false);

  const recordingVideo = useRef();
  const recordedVideo = useRef();

  // Start Recording
  useEffect(() => {
    console.log({ stream, audio, isInitRecording: initRecording });

    if (!initRecording) {
      return;
    }

    startRecording();
  }, [initRecording]);

  // Setup Streamers
  async function setupStream() {
    try {
      // Setup Screen Recorder
      const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      setStream(newScreenStream);

      // Setup Audio Recorder
      const newAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setAudio(newAudioStream);

      // setIsInitRecording
      setInitRecording(true);
    } catch (error) {
      console.warn("setupStream:", { error });
    }
  }

  // setupVideoFeedback
  function setupVideoFeedback() {
    if (!stream) {
      console.warn("No Stream Available");
      return;
    }

    if (recordingVideo.current.srcObject) {
      return;
    }

    recordingVideo.current.srcObject = stream;
    recordingVideo.current.play();
  }

  // Start Recording
  async function startRecording() {
    if (isRecording) {
      return;
    }

    console.log("startRecording");

    if (!stream || !audio) {
      console.warn("Something went wrong!");
      console.log({ stream, audio });
      return;
    }

    // Setup Mixed Stream
    setMixedStream((currentMixedStream) => {
      currentMixedStream = new MediaStream([
        ...stream.getTracks(),
        ...audio.getTracks(),
      ]);

      // Setup Recorder
      const _recorder = new MediaRecorder(currentMixedStream);
      _recorder.ondataavailable = handleDataAvailable;
      _recorder.onstop = handleDataStop;
      _recorder.start(1000);

      setRecorder(_recorder);

      setIsRecording(true);

      // Setup Video Feedback
      setupVideoFeedback();

      console.log("Recording has started");

      return currentMixedStream;
    });
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
    stream.getTracks().forEach((track) => track.stop());
    audio.getTracks().forEach((track) => track.stop());

    setInitRecording(false);
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
          <h2 className="text-xl text-gray-500 uppercase font-light mb-4">
            Preview
          </h2>

          <video
            ref={recordingVideo}
            src=""
            autoPlay
            className="video-feedback bg-black w-full h-auto mb-4"
          ></video>

          {!isRecording && (
            <div className="flex justify-center items-center -mx-4">
              <button
                type="button"
                className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
                onClick={setupStream}
              >
                Record Video
              </button>
              <button
                type="button"
                className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
                onClick={setupStream}
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
          <h2 className="text-xl text-gray-500 uppercase font-light mb-4">
            Recoded Video
          </h2>

          <video
            ref={recordedVideo}
            src=""
            autoPlay
            className="recorded-video bg-black w-full h-auto mb-4"
          ></video>

          <div className="flex justify-center items-center -mx-4">
            <button
              type="button"
              className="download-video text-center mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
              onClick={() => recordedVideo.current.play()}
            >
              Play
            </button>
            <a
              href={downloadLink}
              download="video.mp4"
              type="button"
              className="download-video text-center mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 rounded-md"
              disabled={!downloadLink}
            >
              Download Video
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
