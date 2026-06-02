import { useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ImagePlus, Info, Loader2, Sparkles, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CameraComponent from "../components/CameraComponent";
import logo from "../assets/logo.png";
import diagnosisService from "../services/diagnosisService";
import { getErrorMessage } from "../services/api";

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  const addFiles = (files) => {
    const incomingFiles = Array.from(files || []);
    const validFiles = incomingFiles.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      return ["jpg", "jpeg", "png", "webp"].includes(ext) && file.size <= 5 * 1024 * 1024;
    });

    if (validFiles.length !== incomingFiles.length) {
      setError("Beberapa file tidak valid. Gunakan JPG/PNG/WEBP maks 5MB.");
    } else {
      setError("");
    }

    if (validFiles.length === 0) return;

    const availableSlots = Math.max(10 - selectedFiles.length, 0);
    const filesToAdd = validFiles.slice(0, availableSlots);

    if (filesToAdd.length < validFiles.length) {
      setError("Maksimal 10 gambar untuk sekali analisis.");
    }

    const urls = filesToAdd.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    setPreviewUrls((prev) => [...prev, ...urls]);
    setResults([]);
  };

  const handleCameraCapture = async (file) => {
    const previewUrl = URL.createObjectURL(file);

    setSelectedFiles([file]);
    setPreviewUrls((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [previewUrl];
    });
    setResults([]);
    setError("");
    setLoading(true);
    setUploadProgress(0);

    try {
      const result = await diagnosisService.diagnose(file, (progress) => setUploadProgress(progress));
      setResults([{ ...result, previewUrl }]);
    } catch (err) {
      setResults([
        {
          error: getErrorMessage(err),
          previewUrl,
          filename: file.name,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setResults([]);
  };

  const clearAll = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    setResults([]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      setError("Pilih minimal satu gambar daun tomat terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    const newResults = [];

    for (let i = 0; i < selectedFiles.length; i += 1) {
      setUploadProgress(0);
      try {
        const result = await diagnosisService.diagnose(
          selectedFiles[i],
          (progress) => setUploadProgress(progress)
        );
        newResults.push({ ...result, previewUrl: previewUrls[i] });
      } catch (err) {
        newResults.push({
          error: getErrorMessage(err),
          previewUrl: previewUrls[i],
          filename: selectedFiles[i].name,
        });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  const goToSolution = (diagnosis) => {
    navigate("/solution", { state: { diagnosis } });
  };

  const getSeverityBadge = (severity) => {
    const label = diagnosisService.getSeverityLabel(severity);
    const colors = {
      Rendah: "bg-lime-100 text-lime-700",
      Sedang: "bg-yellow-100 text-yellow-700",
      Tinggi: "bg-red-100 text-red-600",
      "Tidak Diketahui": "bg-gray-100 text-gray-600",
    };
    return { label, className: colors[label] || colors["Tidak Diketahui"] };
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8F4]">
      <header className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          <Link to="/" aria-label="Kembali ke beranda" className="shrink-0">
            <ArrowLeft size={32} className="text-green-800 transition hover:text-green-600 sm:size-10" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">Diagnosis Daun</h1>
            <p className="mt-1 text-sm text-green-600 sm:text-base">
              Unggah gambar atau gunakan kamera untuk dianalisis oleh AI.
            </p>
          </div>
        </div>
        <img src={logo} alt="Tomato LeafGuard" className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16" />
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 sm:px-6 sm:py-4">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-500" />
            <p className="text-sm font-medium text-red-600 sm:text-base">{error}</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(e.dataTransfer.files);
            }}
            className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-green-300 bg-[#EAF1E7] px-5 py-10 text-center transition hover:border-green-500 sm:min-h-[340px] sm:px-8"
          >
            <ImagePlus size={58} className="mb-5 text-green-600 sm:size-20" />
            <h2 className="text-2xl font-semibold text-gray-700 sm:text-3xl">Seret gambar ke sini</h2>
            <p className="mt-2 text-lg text-green-600 sm:text-xl">atau klik untuk unggah</p>
            <div className="mt-6 rounded-xl bg-[#DCE9D8] px-4 py-3 text-sm text-gray-700 sm:px-8 sm:text-base">
              JPG, PNG, WEBP - Maks 5 MB/gambar
            </div>
          </div>

          <CameraComponent onCapture={handleCameraCapture} disabled={loading} />
        </section>

        {previewUrls.length > 0 && (
          <section className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xl font-semibold text-gray-700 sm:text-2xl">
                Gambar yang dipilih ({previewUrls.length}/10)
              </p>
              <button type="button" className="self-start text-red-500 hover:underline" onClick={clearAll}>
                Hapus semua
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {previewUrls.map((url, index) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt={`Daun tomat ${index + 1}`}
                    className="aspect-[4/5] w-full rounded-2xl object-cover shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600"
                    aria-label="Hapus gambar"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-4 rounded-2xl bg-[#EAF1E7] p-5 sm:p-6">
              <Info size={30} className="shrink-0 text-green-600 sm:size-9" />
              <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
                Tips terbaik untuk hasil akurat: pastikan gambar jelas, fokus pada daun, dan pencahayaan cukup baik.
              </p>
            </div>

            {loading && (
              <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Loader2 size={24} className="shrink-0 animate-spin text-green-600" />
                  <p className="font-medium text-gray-700">Menganalisis gambar dengan AI...</p>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-green-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-sm text-gray-500">{uploadProgress}%</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || selectedFiles.length === 0}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-5 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:py-5 sm:text-2xl"
            >
              {loading ? (
                <>
                  <Loader2 size={28} className="animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Sparkles size={28} />
                  Analisis Sekarang ({selectedFiles.length} gambar)
                </>
              )}
            </button>
          </section>
        )}

        {results.length > 0 && (
          <section className="mt-14 sm:mt-20">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-semibold text-gray-800 sm:text-4xl">Hasil Analisis</h1>
              <Link
                to="/history"
                className="self-start rounded-xl bg-[#EEF5EA] px-5 py-3 text-green-600 transition hover:bg-green-100 sm:px-8"
              >
                Lihat History
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              {results.map((result, index) => {
                if (result.error) {
                  return (
                    <div key={`${result.filename}-${index}`} className="flex flex-col gap-5 rounded-3xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:p-8">
                      <img src={result.previewUrl} alt="Daun gagal dianalisis" className="h-40 w-full rounded-2xl object-cover sm:h-[150px] sm:w-[120px]" />
                      <div className="min-w-0">
                        <p className="text-xl font-semibold text-red-600">Gagal menganalisis</p>
                        <p className="mt-2 break-words text-red-500">{result.error}</p>
                      </div>
                    </div>
                  );
                }

                const severity = getSeverityBadge(result.severity_percent);
                const imageUrl = diagnosisService.getImageUrl(result.image_path);

                return (
                  <article key={result.id || index} className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:p-8">
                    <img
                      src={imageUrl || result.previewUrl}
                      alt="Daun hasil analisis"
                      className="h-56 w-full rounded-2xl object-cover md:h-[190px] md:w-[160px] md:shrink-0"
                    />

                    <div className="grid min-w-0 flex-1 gap-6 lg:grid-cols-2 lg:gap-8">
                      <div className="min-w-0">
                        <h2 className="break-words text-2xl font-semibold text-gray-700 sm:text-3xl">
                          {index + 1}. {result.disease?.display_name || "Tidak Dikenali"}
                        </h2>

                        <div className="mt-6 flex items-center justify-between gap-3">
                          <p className="text-base text-gray-400 sm:text-lg">Keparahan</p>
                          <span className={`rounded-lg px-4 py-1 text-sm font-medium sm:text-base ${severity.className}`}>
                            {severity.label}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-4">
                          <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full transition-all ${
                                severity.label === "Tinggi"
                                  ? "bg-red-500"
                                  : severity.label === "Sedang"
                                  ? "bg-yellow-500"
                                  : severity.label === "Tidak Diketahui"
                                  ? "bg-gray-400"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${result.severity_percent ?? 0}%` }}
                            />
                          </div>
                          <span className="text-base text-gray-500 sm:text-lg">
                            {result.severity_percent === null || result.severity_percent === undefined
                              ? "-"
                              : `${result.severity_percent.toFixed(0)}%`}
                          </span>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-3">
                          <p className="text-base text-gray-400 sm:text-lg">Confidence</p>
                          <span className="text-base text-gray-500 sm:text-lg">
                            {((result.confidence_score || 0) * 100).toFixed(0)}%
                          </span>
                        </div>

                        {result.disease && (
                          <button
                            type="button"
                            onClick={() => goToSolution(result)}
                            className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-base text-white transition hover:bg-green-700 sm:text-lg"
                          >
                            Lihat Solusi
                          </button>
                        )}
                      </div>

                      <div className="min-w-0 rounded-2xl border border-[#E3E8DF] bg-[#F7FAF5] p-5 sm:p-6">
                        <h3 className="mb-3 text-lg font-semibold text-gray-700 sm:text-xl">
                          Tentang Penyakit
                        </h3>
                        <p className="break-words text-base leading-relaxed text-gray-500 sm:text-lg">
                          {result.disease?.description || result.notes || "Tidak ada deskripsi tersedia."}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {previewUrls.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center text-center text-gray-400 sm:mt-16">
            <ImagePlus size={72} className="mb-4 opacity-30 sm:size-20" />
            <p className="text-lg sm:text-xl">Belum ada gambar yang dipilih</p>
          </div>
        )}
      </main>
    </div>
  );
}
