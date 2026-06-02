import { Camera, Loader2, VideoOff } from "lucide-react";
import useCamera from "../hooks/useCamera";

export default function CameraComponent({ onCapture, disabled = false }) {
  const {
    videoRef,
    cameraError,
    isCameraOpen,
    openCamera,
    closeCamera,
    setCameraError,
  } = useCamera();

  const captureImage = () => {
    const video = videoRef.current;

    if (!video || video.readyState < 2) {
      setCameraError("Camera preview is not ready yet.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Failed to capture image from camera.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Failed to capture image from camera.");
          return;
        }

        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="w-full rounded-3xl border border-green-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">Live Camera</h2>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Ambil foto daun langsung dari kamera perangkat.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {!isCameraOpen ? (
            <button
              type="button"
              onClick={openCamera}
              disabled={disabled}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
            >
              <Camera size={20} />
              Open Camera
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={captureImage}
                disabled={disabled}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
              >
                {disabled ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                Capture
              </button>
              <button
                type="button"
                onClick={closeCamera}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:text-base"
              >
                <VideoOff size={20} />
                Close Camera
              </button>
            </>
          )}
        </div>
      </div>

      {cameraError && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {cameraError}
        </p>
      )}

      {isCameraOpen && (
        <div className="mt-5 overflow-hidden rounded-2xl bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="aspect-[4/3] w-full object-cover sm:aspect-video"
          />
        </div>
      )}
    </div>
  );
}
