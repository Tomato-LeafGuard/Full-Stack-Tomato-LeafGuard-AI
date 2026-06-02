import { useState } from "react";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/api";
import tomatoBg from "../assets/tomato-bg.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect ke halaman yang dituju sebelum login, atau ke /diagnosis
  const from = location.state?.from?.pathname || "/diagnosis";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // clear error saat user mengetik
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi client-side
    if (!form.email) return setError("Email tidak boleh kosong");
    if (!form.password) return setError("Password tidak boleh kosong");

    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-cover bg-center px-4 py-10 sm:px-6"
      style={{ backgroundImage: `url(${tomatoBg})` }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

      {/* LOGIN BOX */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex w-full max-w-md flex-col items-center px-2 sm:px-6"
      >
        {/* TITLE */}
        <h1 className="mb-10 text-center text-4xl font-bold tracking-tight text-[#355E3B] sm:mb-16 sm:text-5xl">
          Tomato LeafGuard
        </h1>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 w-full rounded-2xl border border-red-300 bg-red-50 px-5 py-3">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* EMAIL */}
        <div className="mb-6 w-full sm:mb-8">
          <label className="text-2xl text-white sm:text-3xl">Masukan E-mail</label>
          <div className="mt-3 flex items-center justify-between rounded-full border-2 border-transparent bg-white/20 px-5 py-3 backdrop-blur-md transition focus-within:border-white sm:px-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/70 sm:text-lg"
              required
            />
            <Mail size={30} className="shrink-0 text-white sm:size-9" />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-6 w-full">
          <label className="text-2xl text-white sm:text-3xl">Masukan Password</label>
          <div className="mt-3 flex items-center justify-between rounded-full border-2 border-transparent bg-white/20 px-5 py-3 backdrop-blur-md transition focus-within:border-white sm:px-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/70 sm:text-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="ml-2 shrink-0 text-white focus:outline-none"
            >
              {showPassword ? <EyeOff size={30} className="sm:size-9" /> : <Eye size={30} className="sm:size-9" />}
            </button>
          </div>
        </div>

        {/* LINKS */}
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="text-lg text-white sm:text-2xl">
            Belum punya akun?
            <Link
              to="/register"
              className="ml-2 text-lg font-bold text-green-900 hover:underline sm:text-2xl"
            >
              Daftar
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="mt-4 cursor-pointer text-lg text-white underline hover:text-green-200 sm:text-2xl"
          >
            Lupa Password?
          </Link>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full max-w-[260px] items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-xl font-semibold text-white shadow-xl shadow-green-900/30 transition hover:scale-105 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              Masuk...
            </>
          ) : (
            "Masuk"
          )}
        </button>
      </form>
    </div>
  );
}
