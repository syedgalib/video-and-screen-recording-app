import "./../sass/tailwind.css";

function App() {
  return (
    <>
      {/* Navbar */}
      <header className="bg-gray-900">
        <div className="container max-auto flex justify-center items-center py-4">
          <h1 className="text-2xl font-bold uppercase">Recorder App</h1>
        </div>
      </header>

      <main className="overflow-hidden max-w-3xl mr-auto ml-auto">
        {/* recording-video-wrap */}
        <div className="recording-video-wrap container mx-auto py-8 px-4 mb-4">
          <h2 className="text-xl text-gray-500 uppercase font-light mb-4">
            Video Recoder
          </h2>

          <video
            src=""
            autoPlay
            className="video-feedback bg-black w-full h-auto mb-4"
          ></video>

          <div className="flex justify-center items-center -mx-4">
            <button
              type="button"
              className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50"
            >
              Start Recording
            </button>
            <button
              type="button"
              className="start-recording mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50"
              disabled
            >
              Stop Recording
            </button>
          </div>
        </div>

        {/* recorded-video-wrap */}
        <div className="recorded-video-wrap hidden container mx-auto py-8 px-4">
          <h2 className="text-xl text-gray-500 uppercase font-light mb-4">
            Recoded Video
          </h2>

          <video
            src=""
            autoPlay
            className="recorded-video bg-black w-full h-auto mb-4"
          ></video>

          <div className="flex justify-center items-center -mx-4">
            <a
              href="#"
              type="button"
              className="download-video text-center mx-4 p-4 flex-1 bg-gradient-to-br from-purple-400 to-pink-400 uppercase text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50"
              disabled
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
