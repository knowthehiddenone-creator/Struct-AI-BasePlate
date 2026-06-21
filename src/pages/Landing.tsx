import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Ruler, FileText } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="px-6 pt-20 pb-16">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="max-w-[900px] mx-auto bg-surface border border-borderLight rounded-card shadow-cardElevated text-center px-8 md:px-16 py-16"
        >
          <h1 className="text-[30px] md:text-[36px] font-bold text-textPrimary leading-tight mb-3">
            <span className="text-primary">StructAI</span> BasePlate
          </h1>
          <p className="text-2xl font-semibold text-textPrimary mb-3">
            AI Copilot for Steel Base Plate Design
          </p>
          <p className="text-base text-[#64748B] mb-9">AISC LRFD · AISC ASD · IS 800:2007</p>
          <button
            onClick={() => navigate("/design")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-btn bg-primary text-white text-[17px] font-medium
              hover:bg-primaryDark hover:-translate-y-[2px] hover:shadow-cardHover transition-all duration-150 shadow-sm"
          >
            Start New Design <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      {/* FEATURE CARDS */}
      <section className="px-6 pb-16">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Zap,
              title: "AI Extraction",
              desc: "Describe your base plate in plain language — parameters are extracted automatically.",
              color: "#2563EB",
            },
            {
              icon: Ruler,
              title: "Code Compliant",
              desc: "Every check runs against AISC 360 or IS 800:2007 with correct units and grades.",
              color: "#16A34A",
            },
            {
              icon: FileText,
              title: "PDF Report",
              desc: "Export a 21-section consulting-grade design report in seconds.",
              color: "#0891B2",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
              className="bg-surface border border-borderLight rounded-card shadow-card p-6 transition-shadow duration-200"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${f.color}15` }}
              >
                <f.icon size={22} color={f.color} />
              </div>
              <h3 className="text-base font-semibold text-textPrimary mb-1.5">{f.title}</h3>
              <p className="text-sm text-textSecondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-surfaceGray border-y border-borderLight py-12">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-6">
          {[
            { value: "28", label: "Calculation Modules" },
            { value: "3", label: "Design Codes" },
            { value: "21", label: "Section PDF Report" },
            { value: "<30s", label: "Design to Result" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary mb-1">{s.value}</p>
              <p className="text-xs font-medium text-textSecondary uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-[20px] font-semibold text-textPrimary text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { n: 1, title: "Describe your connection", desc: "Type your base plate design in plain English — loads, sections, concrete grade, anchors." },
              { n: 2, title: "AI extracts, code calculates", desc: "Parameters are extracted, engineering checks run, and every result is verified against code." },
              { n: 3, title: "Download your report", desc: "Get a professional, code-referenced PDF design report — ready to share." },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="text-center relative"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.n}
                </div>
                <h3 className="text-base font-semibold text-textPrimary mb-2">{step.title}</h3>
                <p className="text-sm text-textSecondary leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
