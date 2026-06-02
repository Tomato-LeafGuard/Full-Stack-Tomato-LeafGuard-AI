import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Camera, ClipboardCheck, Globe, Leaf, Mail, Menu, Phone } from "lucide-react";
import logo from "../assets/logo.png";
import question from "../assets/question.png";
import tomatoBg from "../assets/tomato-bg.jpg";

export default function LandingPage() {
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Diagnosis", to: "/diagnosis" },
    { label: "Riwayat", to: "/history" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen overflow-x-hidden bg-white"
    >
      <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8 lg:py-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={logo} alt="Tomato LeafGuard" className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" />
          <h1 className="truncate text-xl font-bold text-green-700 sm:text-2xl">Tomato LeafGuard</h1>
        </Link>

        <div className="flex items-center gap-2 lg:hidden">
          <Menu size={24} className="text-green-700" />
        </div>

        <ul className="order-3 flex w-full flex-wrap justify-center gap-4 text-sm font-medium text-green-600 sm:gap-8 sm:text-base lg:order-2 lg:w-auto lg:gap-10 lg:text-lg">
          {navLinks.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="transition hover:text-green-800">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="order-2 flex shrink-0 gap-2 sm:gap-3 lg:order-3">
          <Link
            to="/login"
            className="rounded-full border border-green-500 px-4 py-2 text-sm text-green-600 transition hover:bg-green-50 sm:px-6 sm:text-base"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-cyan-500 px-4 py-2 text-sm text-white transition hover:bg-cyan-600 sm:px-6 sm:text-base"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold leading-tight text-green-600 sm:text-5xl md:text-6xl lg:text-7xl">
          Tomato LeafGuard
        </h1>
        <p className="mt-6 max-w-4xl text-xl leading-relaxed text-gray-800 sm:text-2xl md:text-3xl">
          Diagnosis akurat dalam hitungan detik. Hemat biaya pestisida hingga 60% dengan targeted treatment.
        </p>
        <Link
          to="/diagnosis"
          className="mt-10 inline-flex max-w-full items-center justify-center rounded-full bg-green-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-green-600 sm:px-10 sm:text-lg"
        >
          Mulai Diagnosis Sekarang
        </Link>
      </section>

      <section
        className="relative bg-cover bg-center px-4 py-20 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(rgba(115, 190, 90, 0.85), rgba(115, 190, 90, 0.85)), url(${tomatoBg})`,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Layanan Kami
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-center text-lg leading-relaxed text-white sm:text-xl md:text-2xl">
            Penuh dengan fitur yang membuat perawatan tanaman terasa mudah, bukan beban.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
            {[
              {
                icon: Camera,
                title: "Deteksi Penyakit",
                text: "Analisis bertenaga AI mengidentifikasi penyakit, hama, dan kekurangan nutrisi dari satu foto.",
              },
              {
                icon: ClipboardCheck,
                title: "Panduan Perawatan",
                text: "Rencana perawatan langkah demi langkah dengan pelacakan kemajuan.",
              },
              {
                icon: BookOpen,
                title: "Jurnal Penyakit Tomat",
                text: "Lacak kesehatan tanaman Anda dari waktu ke waktu dengan foto dan riwayat perawatan.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border-2 border-white p-6 text-white sm:p-8">
                <Icon size={56} className="mb-6 text-white sm:size-16" />
                <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
                <div className="my-4 h-px w-full bg-white" />
                <p className="text-base leading-relaxed sm:text-lg">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F3F3F3] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="flex justify-center">
            <img src={question} alt="Ilustrasi cara penggunaan" className="w-full max-w-[360px] object-contain md:max-w-[450px]" />
          </div>

          <div className="min-w-0">
            <h1 className="mb-10 text-4xl font-bold text-gray-700 sm:text-5xl lg:mb-16 lg:text-6xl">
              Cara Penggunaan
            </h1>

            {[
              {
                title: "Ambil foto/Upload Foto",
                text: "Arahkan kamera ke tanaman yang terlihat sehat, layu, atau di antaranya.",
              },
              {
                title: "Dapatkan diagnosis AI",
                text: "AI menganalisis foto Anda dan mengidentifikasi penyakit, kekurangan nutrisi, atau hama.",
              },
              {
                title: "Ikuti rencana perawatan",
                text: "Terima rekomendasi perawatan dan instruksi langkah demi langkah.",
              },
            ].map((step, index) => (
              <div key={step.title} className="flex gap-5 sm:gap-8">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-lg font-bold text-white sm:h-14 sm:w-14 sm:text-xl">
                    {index + 1}
                  </div>
                  {index < 2 && <div className="h-20 w-1 bg-cyan-500 sm:h-28" />}
                </div>

                <div className={index < 2 ? "pb-8 sm:pb-12" : ""}>
                  <h2 className="text-2xl font-bold text-gray-700 sm:text-3xl">{step.title}</h2>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-500 sm:mt-4 sm:text-lg">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-green-600 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <img src={logo} alt="Tomato LeafGuard" className="h-12 w-12 shrink-0" />
            <h1 className="text-xl font-bold sm:text-2xl">Tomato LeafGuard</h1>
          </div>

          <div className="flex flex-wrap gap-5 text-base sm:gap-10 sm:text-xl">
            <Link to="/">Home</Link>
            <Link to="/diagnosis">Services</Link>
            <Link to="/profile">About Us</Link>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            {[Globe, Mail, Phone, Leaf].map((Icon, index) => (
              <div key={index} className="flex h-10 w-10 items-center justify-center rounded bg-white text-green-600 transition hover:scale-105">
                <Icon size={20} />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto my-8 h-px max-w-7xl bg-white/40 sm:my-10" />
        <p className="text-center text-sm">© 2026 Tomato LeafGuard</p>
      </footer>
    </motion.div>
  );
}
