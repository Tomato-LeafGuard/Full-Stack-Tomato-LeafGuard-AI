import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Camera,
  Check,
  Leaf,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ScanLine,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";
import { getAvatarUrl, getErrorMessage } from "../services/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, uploadAvatar } = useAuth();
  const fileInputRef = useRef(null);

  const [stats, setStats] = useState({ total_scan: 0, total_diseases: 0, success_rate: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", location: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      await uploadAvatar(file);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaveError("");
    if (!form.full_name.trim()) return setSaveError("Nama tidak boleh kosong");

    setSaving(true);
    try {
      await updateProfile({
        full_name: form.full_name,
        phone: form.phone || null,
        location: form.location || null,
      });
      setIsEditing(false);
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Yakin ingin logout?")) {
      logout();
      navigate("/login");
    }
  };

  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8F4] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <main className="mx-auto w-full max-w-7xl">
        <section className="relative flex flex-col items-center rounded-3xl bg-white p-6 shadow-sm sm:p-10 lg:rounded-[40px]">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="absolute right-4 top-4 rounded-full bg-green-500 p-3 shadow-md transition hover:bg-green-600 sm:right-8 sm:top-8 sm:p-4"
              aria-label="Edit profil"
            >
              <Pencil size={22} className="text-white sm:size-6" />
            </button>
          ) : (
            <div className="absolute right-4 top-4 flex gap-2 sm:right-8 sm:top-8 sm:gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-green-500 p-3 shadow-md transition hover:bg-green-600 disabled:opacity-70 sm:p-4"
                aria-label="Simpan profil"
              >
                {saving ? <Loader2 size={20} className="animate-spin text-white" /> : <Check size={22} className="text-white" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setSaveError("");
                }}
                className="rounded-full bg-gray-400 p-3 shadow-md transition hover:bg-gray-500 sm:p-4"
                aria-label="Batal edit"
              >
                <X size={22} className="text-white" />
              </button>
            </div>
          )}

          <div className="relative mt-6 sm:mt-0">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-green-200 sm:h-[150px] sm:w-[150px]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-green-500 text-5xl font-bold text-white sm:text-6xl">
                  {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 size={30} className="animate-spin text-white" />
                </div>
              )}
            </div>

            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-green-500 p-2 transition hover:bg-green-600"
              aria-label="Ganti foto profil"
            >
              <Camera size={16} className="text-white" />
            </button>
          </div>

          {isEditing ? (
            <div className="mt-6 w-full max-w-sm">
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                className="w-full rounded-2xl border-2 border-green-300 bg-[#F0F7EE] px-4 py-3 text-center text-2xl font-bold text-[#2E4B3A] outline-none sm:text-3xl"
                placeholder="Nama lengkap"
              />
              {saveError && <p className="mt-2 text-center text-sm text-red-500">{saveError}</p>}
            </div>
          ) : (
            <div className="mt-6 text-center">
              <h1 className="break-words text-3xl font-bold text-[#2E4B3A] sm:text-5xl">
                Hallo, {user?.full_name?.split(" ")[0] || "User"}
              </h1>
              <p className="mt-2 text-xl text-green-600 sm:text-2xl">Petani Tomat</p>
            </div>
          )}
        </section>

        <section className="mt-8 flex flex-col gap-5 rounded-3xl bg-[#EEF5EA] p-5 sm:mt-10 sm:gap-6 sm:p-8 lg:rounded-[35px]">
          <ProfileRow icon={Mail}>
            <p className="break-all text-lg text-gray-700 sm:text-2xl">{user?.email || "-"}</p>
          </ProfileRow>

          <ProfileRow icon={Phone}>
            {isEditing ? (
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Nomor telepon"
                className="min-w-0 flex-1 rounded-2xl border-2 border-green-300 bg-white px-4 py-3 text-lg text-gray-700 outline-none sm:text-2xl"
              />
            ) : (
              <p className="break-words text-lg text-gray-700 sm:text-2xl">{user?.phone || "-"}</p>
            )}
          </ProfileRow>

          <ProfileRow icon={MapPin}>
            {isEditing ? (
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Lokasi (kota, provinsi)"
                className="min-w-0 flex-1 rounded-2xl border-2 border-green-300 bg-white px-4 py-3 text-lg text-gray-700 outline-none sm:text-2xl"
              />
            ) : (
              <p className="break-words text-lg text-gray-700 sm:text-2xl">{user?.location || "-"}</p>
            )}
          </ProfileRow>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          <StatCard icon={ScanLine} value={stats.total_scan} label="Total Scan" loading={loadingStats} />
          <StatCard icon={Leaf} value={stats.total_diseases} label="Penyakit" loading={loadingStats} />
          <StatCard icon={Activity} value={`${stats.success_rate}%`} label="Keberhasilan" loading={loadingStats} />
        </section>

        <section className="mt-8 rounded-3xl bg-[#DFF3D8] p-5 sm:mt-10 sm:p-8 lg:rounded-[35px]">
          <h1 className="text-2xl font-bold text-[#2E4B3A] sm:text-3xl">Tips Hari Ini</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-700 sm:text-2xl">
            Hindari menyiram daun tomat pada malam hari untuk mencegah pertumbuhan jamur dan bakteri.
          </p>
        </section>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-3xl border-2 border-red-200 bg-red-50 py-4 text-xl font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-100 sm:mt-10 sm:py-5 sm:text-2xl"
        >
          <LogOut size={26} className="sm:size-7" />
          Keluar dari Akun
        </button>
      </main>
    </div>
  );
}

function ProfileRow({ icon: Icon, children }) {
  return (
    <div className="flex min-w-0 items-center gap-4 sm:gap-5">
      <div className="shrink-0 rounded-full bg-white p-3 sm:p-4">
        <Icon size={24} className="text-green-600 sm:size-7" />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, loading }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-sm sm:p-8">
      <Icon size={36} className="text-green-600 sm:size-10" />
      <h1 className="mt-4 text-4xl font-bold text-[#2E4B3A] sm:text-5xl">
        {loading ? <Loader2 size={36} className="animate-spin" /> : value}
      </h1>
      <p className="mt-2 text-lg text-gray-500 sm:text-xl">{label}</p>
    </div>
  );
}
