import { useEffect, useState } from "react";
import { AlertCircle, Bell, Loader2, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import diagnosisService from "../services/diagnosisService";
import historyService from "../services/historyService";
import { getAvatarUrl, getErrorMessage } from "../services/api";

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await historyService.getHistory(1, 50);
      setHistory(data);
      setFilteredHistory(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHistory(history);
      return;
    }

    const q = searchQuery.toLowerCase();
    setFilteredHistory(
      history.filter(
        (item) =>
          item.disease?.display_name?.toLowerCase().includes(q) ||
          item.disease?.class_name?.toLowerCase().includes(q) ||
          new Date(item.diagnosed_at).toLocaleDateString("id-ID").includes(q)
      )
    );
  }, [searchQuery, history]);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus riwayat ini?")) return;
    setDeletingId(id);
    try {
      await historyService.deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8F4]">
      <header className="bg-[#EEF5EA] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/profile" className="flex min-w-0 items-center gap-3 sm:gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="profile" className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-16 sm:w-16" />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold text-gray-800 sm:text-4xl">
                Hallo, {user?.full_name?.split(" ")[0] || "User"}
              </h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-lg">Semua riwayat tanamanmu ada di sini</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => alert("Fitur notifikasi segera hadir!")}
            className="shrink-0 rounded-full bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4"
            aria-label="Notifikasi"
          >
            <Bell size={24} className="text-gray-700 sm:size-7" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#EEF5EA] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <Search size={28} className="shrink-0 text-gray-500 sm:size-9" />
            <input
              type="text"
              placeholder="Cari riwayat tanaman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-0 bg-transparent text-lg outline-none placeholder:text-gray-400 sm:text-2xl"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="shrink-0 text-gray-400 hover:text-gray-600">
                X
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={50} className="animate-spin text-green-500" />
              <p className="text-xl text-gray-500">Memuat riwayat...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:px-6">
            <AlertCircle size={24} className="mt-0.5 shrink-0 text-red-500" />
            <div className="min-w-0">
              <p className="break-words font-medium text-red-600">{error}</p>
              <button type="button" onClick={fetchHistory} className="mt-1 text-sm text-red-500 underline">
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
            <div className="text-6xl sm:text-8xl">TL</div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-700">
                {searchQuery ? "Tidak ditemukan" : "Belum ada riwayat"}
              </h2>
              <p className="mt-3 text-lg text-gray-500 sm:text-xl">
                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Mulai diagnosis pertamamu sekarang!"}
              </p>
            </div>
            {!searchQuery && (
              <Link
                to="/diagnosis"
                className="rounded-2xl bg-green-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-green-700 sm:px-10 sm:text-xl"
              >
                Mulai Diagnosis
              </Link>
            )}
          </div>
        )}

        {!loading && !error && filteredHistory.length > 0 && (
          <section className="mt-8 flex flex-col gap-6 sm:gap-8">
            <p className="text-base text-gray-500 sm:text-lg">{filteredHistory.length} riwayat ditemukan</p>

            {filteredHistory.map((item) => {
              const imageUrl = diagnosisService.getImageUrl(item.image_path);
              const severity = diagnosisService.getSeverityLabel(item.severity_percent);

              return (
                <article
                  key={item.id}
                  className="flex cursor-pointer flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6 md:flex-row md:items-start md:gap-8"
                  onClick={() => navigate("/solution", { state: { diagnosis: item } })}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Daun tomat"
                      className="h-48 w-full rounded-2xl object-cover md:h-[140px] md:w-[140px] md:shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-green-100 md:h-[140px] md:w-[140px] md:shrink-0">
                      <span className="text-3xl font-bold text-green-700">TL</span>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="break-words text-xl font-semibold text-gray-800 sm:text-2xl">
                          {formatDate(item.diagnosed_at)}
                        </h2>
                        <p className="mt-1 break-words text-xl font-bold text-green-700 sm:text-2xl">
                          {item.disease?.display_name || "Tidak Dikenali"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        disabled={deletingId === item.id}
                        className="shrink-0 rounded-xl p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Hapus riwayat"
                      >
                        {deletingId === item.id ? <Loader2 size={22} className="animate-spin" /> : <Trash2 size={22} />}
                      </button>
                    </div>

                    <p className="mt-3 break-words text-base leading-relaxed text-gray-600 sm:text-xl">
                      {item.disease?.description?.substring(0, 120) || "Tidak ada deskripsi"}
                      {item.disease?.description?.length > 120 ? "..." : ""}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 sm:gap-4">
                      <span
                        className={`rounded-lg px-3 py-1 text-sm font-medium ${
                          severity === "Rendah"
                            ? "bg-lime-100 text-lime-700"
                            : severity === "Sedang"
                            ? "bg-yellow-100 text-yellow-700"
                            : severity === "Tinggi"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Keparahan: {severity}
                      </span>
                      <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        Confidence: {((item.confidence_score || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
