import logo from "../assets/logo.png";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import diagnosisService from "../services/diagnosisService";

// Mapping solusi generik berdasarkan jenis penyakit
const DISEASE_SOLUTIONS = {
  Tomato_Early_blight: [
    "Semprotkan fungisida berbahan aktif mancozeb atau chlorothalonil",
    "Buang dan musnahkan daun yang terinfeksi agar tidak menyebar",
    "Perbaiki sirkulasi udara di sekitar tanaman",
    "Hindari penyiraman langsung pada daun, siram di pangkal batang",
  ],
  Tomato_Bacterial_spot: [
    "Semprotkan campuran tembaga sulfat atau antibiotik yang diizinkan",
    "Buang tanaman yang terinfeksi parah dan musnahkan",
    "Hindari bekerja di kebun saat tanaman basah",
    "Gunakan benih bebas penyakit untuk musim berikutnya",
  ],
  Tomato_Late_blight: [
    "Semprotkan fungisida sistemik segera setelah gejala terdeteksi",
    "Buang dan musnahkan semua bagian tanaman yang terinfeksi",
    "Hindari kelembapan berlebih, perbaiki drainase",
    "Gunakan varietas tomat yang tahan terhadap penyakit ini",
  ],
  Tomato_Leaf_Mold: [
    "Kurangi kelembapan dengan meningkatkan ventilasi",
    "Semprotkan fungisida jika serangan parah",
    "Hindari penyiraman pada daun, siram di tanah",
    "Pangkas daun yang rapat untuk meningkatkan sirkulasi udara",
  ],
  Tomato_Septoria_leaf_spot: [
    "Buang daun yang terinfeksi dan musnahkan",
    "Semprotkan fungisida mancozeb atau copper-based",
    "Mulsa tanah untuk mencegah percikan air membawa spora",
    "Lakukan rotasi tanaman minimal 2 tahun",
  ],
  Tomato_Spider_mites: [
    "Semprotkan insektisida/akarisida yang direkomendasikan",
    "Cuci tanaman dengan air bertekanan untuk mengurangi populasi tungau",
    "Gunakan predator alami seperti Phytoseiidae",
    "Jaga kelembapan udara agar tidak terlalu kering",
  ],
  Tomato_Target_Spot: [
    "Semprotkan fungisida azoxystrobin atau chlorothalonil",
    "Buang daun yang terinfeksi secara berkala",
    "Lakukan rotasi tanaman setiap musim tanam",
    "Hindari kelembapan berlebih, perbaiki drainase tanah",
  ],
  Tomato_Yellow_Leaf_Curl_Virus: [
    "Musnahkan tanaman yang terinfeksi untuk mencegah penyebaran",
    "Kendalikan populasi kutu kebul dengan insektisida sistemik",
    "Pasang mulsa plastik perak untuk menolak kutu kebul",
    "Gunakan varietas tomat yang tahan terhadap virus ini",
  ],
  Tomato_mosaic_virus: [
    "Musnahkan tanaman yang terinfeksi virus",
    "Cuci tangan dan desinfeksi alat sebelum menyentuh tanaman sehat",
    "Kendalikan serangga vektor (kutu daun, thrips)",
    "Gunakan benih bersertifikat bebas virus",
  ],
  Tomato_healthy: [
    "Lanjutkan perawatan rutin yang sudah baik",
    "Siram secara teratur di pangkal tanaman, jangan di daun",
    "Berikan pupuk berimbang N-P-K sesuai kebutuhan",
    "Pantau tanaman secara rutin untuk deteksi dini masalah",
  ],
  Tidak_Terdefinisi: [
    "Ulangi diagnosis dengan foto daun tomat yang jelas dan fokus",
    "Pastikan objek utama adalah daun tomat, bukan tanah, pot, buah, atau tanaman lain",
    "Gunakan pencahayaan cukup agar tekstur dan warna daun terlihat",
    "Ambil foto dari jarak lebih dekat hingga daun memenuhi sebagian besar gambar",
  ],
};

export default function SolutionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const diagnosis = location.state?.diagnosis;

  // Langkah penanganan: gunakan data terperinci dari DISEASE_SOLUTIONS
  // (lebih lengkap, step-by-step) jika tersedia. Jika tidak, fallback ke
  // disease.treatment dari API, lalu fallback generik.
  const className = diagnosis?.disease?.class_name;
  const solutions = (className && DISEASE_SOLUTIONS[className])
    ? DISEASE_SOLUTIONS[className]
    : diagnosis?.disease?.treatment
    ? diagnosis.disease.treatment.split(". ").filter(Boolean)
    : [
        "Konsultasikan dengan ahli pertanian untuk penanganan lebih lanjut",
        "Pantau perkembangan gejala setiap hari",
        "Isolasi tanaman yang terinfeksi dari tanaman sehat",
      ];

  const [doneSteps, setDoneSteps] = useState(
    solutions.map((_, i) => i === 0) // Step pertama otomatis done
  );

  const toggleStep = (index) => {
    setDoneSteps((prev) => prev.map((done, i) => (i === index ? !done : done)));
  };

  const completedCount = doneSteps.filter(Boolean).length;
  const progressPercent = solutions.length > 0
    ? Math.round((completedCount / solutions.length) * 100)
    : 0;

  const imageUrl = diagnosis
    ? diagnosisService.getImageUrl(diagnosis.image_path) || diagnosis.previewUrl
    : null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8F4] px-4 py-5 sm:px-6 lg:px-8">

      {/* HEADER */}
      <div className="mx-auto mb-8 flex max-w-7xl items-center gap-3 sm:gap-4">
        <button onClick={() => navigate(-1)} className="text-green-800 hover:text-green-600 transition">
          <ArrowLeft size={30} />
        </button>
        <img src={logo} alt="logo" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
        <h1 className="min-w-0 text-2xl font-bold tracking-tight text-[#2E4B3A] sm:text-4xl">
          Rekomendasi Perawatan
        </h1>
      </div>

      <main className="mx-auto max-w-7xl">
      {/* DIAGNOSIS INFO */}
      {diagnosis && (
        <div className="mb-10 flex flex-col gap-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:gap-6">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="leaf"
              className="h-52 w-full rounded-2xl object-cover md:h-[120px] md:w-[120px] md:shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-2xl font-bold text-gray-800">
              {diagnosis.disease?.display_name || "Penyakit Tidak Dikenali"}
            </h2>
            <p className="mt-2 break-words text-base text-gray-500 sm:text-lg">
              {diagnosis.disease?.description || diagnosis.notes || ""}
            </p>
            <div className="flex gap-4 mt-4 flex-wrap">
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-lg text-sm font-medium">
                Confidence: {((diagnosis.confidence_score || 0) * 100).toFixed(0)}%
              </span>
              <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-lg text-sm font-medium">
                Keparahan: {
                  diagnosis.severity_percent === null || diagnosis.severity_percent === undefined
                    ? "Tidak diketahui"
                    : `${diagnosis.severity_percent.toFixed(0)}%`
                }
              </span>
            </div>
          </div>

          {/* PROGRESS LINGKARAN */}
          <div className="flex shrink-0 flex-col items-center gap-2 md:min-w-[100px]">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#E5E7EB" strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#22C55E" strokeWidth="3"
                  strokeDasharray={`${progressPercent}, 100`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-green-600">
                {progressPercent}%
              </span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              {completedCount}/{solutions.length} selesai
            </p>
          </div>
        </div>
      )}

      {/* PREVENTION */}
      {diagnosis?.disease?.prevention && (
        <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">🛡️ Pencegahan</h3>
          <p className="text-blue-700">{diagnosis.disease.prevention}</p>
        </div>
      )}

      {/* SOLUTION LIST */}
      <h2 className="mb-6 text-2xl font-bold text-gray-700">Langkah Penanganan</h2>
      <div className="flex flex-col gap-6">
        {solutions.map((solution, index) => (
          <div key={index} className="flex items-start gap-3 sm:gap-5">
            {/* ICON TOGGLE */}
            <button
              onClick={() => toggleStep(index)}
              className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-xl font-bold transition sm:h-[55px] sm:w-[55px] sm:text-2xl ${
                doneSteps[index]
                  ? "bg-green-500 text-white shadow-lg shadow-green-200"
                  : "bg-[#B8D4B3] text-gray-800 hover:bg-green-200"
              }`}
            >
              {doneSteps[index] ? "✓" : index + 1}
            </button>

            {/* CARD */}
            <div className={`flex min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl px-4 py-4 transition sm:px-6 sm:py-5 ${
              doneSteps[index] ? "bg-[#DFF0DA]" : "bg-[#EDF4EA]"
            }`}>
              <p className={`max-w-4xl break-words text-lg transition sm:text-2xl ${
                doneSteps[index] ? "text-gray-500 line-through" : "text-gray-800"
              }`}>
                {solution}
              </p>
              {doneSteps[index] && (
                <CheckCircle2 size={28} className="text-green-500 shrink-0 ml-4" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          to="/diagnosis"
          className="flex-1 rounded-2xl border-2 border-green-600 bg-white py-4 text-center text-lg font-semibold text-green-600 transition hover:bg-green-50 sm:text-xl"
        >
          Diagnosis Baru
        </Link>
        <Link
          to="/history"
          className="flex-1 rounded-2xl bg-green-600 py-4 text-center text-lg font-semibold text-white transition hover:bg-green-700 sm:text-xl"
        >
          Lihat History
        </Link>
      </div>
      </main>
    </div>
  );
}
