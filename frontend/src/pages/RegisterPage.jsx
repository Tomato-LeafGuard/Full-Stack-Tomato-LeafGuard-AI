import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.full_name.trim()) return "Nama lengkap tidak boleh kosong";
    if (!form.email) return "Email tidak boleh kosong";
    if (form.password.length < 8) return "Password minimal 8 karakter";
    if (form.password !== form.confirmPassword) return "Konfirmasi password tidak cocok";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[#F7F8F4] px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2 lg:rounded-[40px]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-green-600 to-green-700 p-6 sm:p-10 lg:p-14">
          <div>
            <div className="mb-8 flex min-w-0 items-center gap-4 sm:mb-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl sm:h-16 sm:w-16">
                <span aria-hidden="true">TL</span>
              </div>
              <div className="min-w-0">
                <h1 className="break-words text-3xl font-bold text-white sm:text-4xl">Tomato LeafGuard</h1>
                <p className="mt-1 text-base text-green-100 sm:text-lg">Smart AI Plant Diagnosis</p>
              </div>
            </div>

            <h2 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Rawat tanaman tomat lebih mudah bersama AI.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-green-100 sm:mt-8 sm:text-2xl">
              Analisis penyakit daun, pantau riwayat tanaman, dan dapatkan rekomendasi perawatan terbaik secara real-time.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 sm:mt-16 sm:gap-6">
            <div className="rounded-3xl bg-white/15 px-6 py-5 backdrop-blur-md sm:px-8">
              <h3 className="text-3xl font-bold text-white sm:text-4xl">98%</h3>
              <p className="mt-2 text-base text-green-100 sm:text-lg">Akurasi Deteksi</p>
            </div>
            <div className="rounded-3xl bg-white/15 px-6 py-5 backdrop-blur-md sm:px-8">
              <h3 className="text-3xl font-bold text-white sm:text-4xl">24/7</h3>
              <p className="mt-2 text-base text-green-100 sm:text-lg">Monitoring Tanaman</p>
            </div>
          </div>

          <div className="absolute -bottom-24 -right-24 h-[220px] w-[220px] rounded-full bg-white/10 sm:h-[260px] sm:w-[260px]" />
          <div className="absolute right-10 top-10 h-[100px] w-[100px] rounded-full bg-white/10 sm:h-[120px] sm:w-[120px]" />
        </section>

        <section className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-16">
          {success ? (
            <div className="flex flex-col items-center gap-6 text-center">
              <CheckCircle2 size={80} className="text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">Berhasil Daftar!</h2>
              <p className="text-lg text-gray-500 sm:text-xl">
                Akun kamu berhasil dibuat. Mengarahkan ke halaman login...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 sm:mb-10">
                <h2 className="text-4xl font-bold text-gray-800 sm:text-5xl">Buat Akun</h2>
                <p className="mt-4 text-lg leading-relaxed text-gray-500 sm:text-xl">
                  Daftar untuk mulai memantau kesehatan tanaman tomatmu.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="mb-3 block text-lg font-medium text-gray-700">Nama Lengkap</label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Masukkan nama lengkap"
                    value={form.full_name}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-2xl border-2 border-transparent bg-[#F5F7F3] px-5 py-4 text-base outline-none transition focus:border-green-500 sm:px-6 sm:py-5 sm:text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-lg font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Masukkan email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-2xl border-2 border-transparent bg-[#F5F7F3] px-5 py-4 text-base outline-none transition focus:border-green-500 sm:px-6 sm:py-5 sm:text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-lg font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Minimal 8 karakter"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full rounded-2xl border-2 border-transparent bg-[#F5F7F3] px-5 py-4 pr-14 text-base outline-none transition focus:border-green-500 sm:px-6 sm:py-5 sm:text-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-lg font-medium text-gray-700">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Masukkan ulang password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full rounded-2xl border-2 bg-[#F5F7F3] px-5 py-4 pr-14 text-base outline-none transition sm:px-6 sm:py-5 sm:text-lg ${
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? "border-red-400"
                          : "border-transparent focus:border-green-500"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="ml-2 mt-1 text-sm text-red-500">Password tidak cocok</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 text-xl font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 sm:py-5 sm:text-2xl"
                >
                  {loading ? (
                    <>
                      <Loader2 size={26} className="animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center sm:mt-10">
                <p className="text-base text-gray-500 sm:text-lg">
                  Sudah punya akun?
                  <Link to="/login" className="ml-2 font-semibold text-green-600 hover:underline">
                    Masuk
                  </Link>
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
