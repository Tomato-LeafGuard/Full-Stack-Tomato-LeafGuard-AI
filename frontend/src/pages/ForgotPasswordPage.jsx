import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import { getErrorMessage } from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Email tidak boleh kosong");

    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      setSuccess(true);
      if (data.reset_token) {
        setResetToken(data.reset_token);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[#F7F8F4] px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2 lg:rounded-[40px]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-green-600 to-green-700 p-6 sm:p-10 lg:p-14">
          <div>
            <Link
              to="/login"
              className="mb-8 flex items-center gap-3 text-lg text-white transition hover:opacity-80 sm:mb-10 sm:text-xl"
            >
              <ArrowLeft size={24} />
              Kembali ke Login
            </Link>

            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-3xl font-bold text-white sm:mb-10 sm:h-24 sm:w-24 sm:text-4xl">
              TL
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Lupa Password?
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-green-100 sm:mt-8 sm:text-2xl">
              Masukkan email akunmu dan kami akan mengirimkan link untuk reset password.
            </p>
          </div>

          <div className="mt-10 rounded-3xl bg-white/15 p-6 backdrop-blur-md sm:mt-16 sm:p-8">
            <h3 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Keamanan Akun</h3>
            <p className="text-base leading-relaxed text-green-100 sm:text-lg">
              Pastikan email yang digunakan aktif agar proses pemulihan akun berjalan lancar.
            </p>
          </div>

          <div className="absolute -bottom-24 -right-24 h-[220px] w-[220px] rounded-full bg-white/10 sm:h-[260px] sm:w-[260px]" />
          <div className="absolute right-10 top-10 h-[100px] w-[100px] rounded-full bg-white/10 sm:h-[120px] sm:w-[120px]" />
        </section>

        <section className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-16">
          {success ? (
            <div className="flex flex-col items-center gap-6 text-center">
              <CheckCircle2 size={80} className="text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">Email Terkirim!</h2>
              <p className="break-words text-lg leading-relaxed text-gray-500 sm:text-xl">
                Instruksi reset password telah dikirim ke <strong>{email}</strong>. Periksa inbox atau folder spam kamu.
              </p>

              {resetToken && (
                <div className="w-full rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-left">
                  <p className="mb-1 text-sm font-semibold text-yellow-700">Token Reset (Demo/Testing):</p>
                  <p className="break-all font-mono text-xs text-gray-600">{resetToken}</p>
                  <p className="mt-2 text-xs text-yellow-600">
                    Di production, token ini dikirim via email. Hapus bagian ini.
                  </p>
                </div>
              )}

              <Link to="/login" className="text-lg font-semibold text-green-600 hover:underline">
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 sm:mb-10">
                <h2 className="text-4xl font-bold text-gray-800 sm:text-5xl">Reset Password</h2>
                <p className="mt-4 text-lg leading-relaxed text-gray-500 sm:text-xl">
                  Kami akan mengirimkan instruksi reset password ke email kamu.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div>
                  <label className="mb-3 block text-lg font-medium text-gray-700">Email</label>
                  <div className="flex items-center rounded-2xl border-2 border-transparent bg-[#F5F7F3] px-5 py-4 transition focus-within:border-green-500 sm:px-6 sm:py-5">
                    <Mail size={24} className="shrink-0 text-green-600" />
                    <input
                      type="email"
                      placeholder="Masukkan email akun"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      disabled={loading}
                      className="ml-4 w-full min-w-0 bg-transparent text-base outline-none sm:text-lg"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 text-xl font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-10 sm:py-5 sm:text-2xl"
                >
                  {loading ? (
                    <>
                      <Loader2 size={26} className="animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Link Reset"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center sm:mt-10">
                <p className="text-base text-gray-500 sm:text-lg">
                  Ingat password?
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
