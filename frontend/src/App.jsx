import { useMemo, useState } from "react";
import axios from "axios";
import "./index.css";

import {
  Shield,
  Upload,
  AlertTriangle,
  ScanText,
  Brain,
  Tag,
  Activity,
  Eye,
  Zap,
  Sparkles,
  ArrowRight,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function App() {
  const [fileName, setFileName] = useState(null);
  const [preview, setPreview] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Floating particles
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 18,
        duration: 14 + Math.random() * 16,
        drift: (Math.random() - 0.5) * 120,
        color: Math.random() > 0.78 ? "red" : "cyan",
      })),
    []
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData
      );

      setAnalysis(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFileName(null);
    setPreview(null);
    setAnalysis(null);
  };

  const scamProbability =
    parseInt(analysis?.scam_probability) || 0;

  const threatLevel = analysis?.threat_level || "Waiting";

  const ocrText =
    analysis?.extracted_text ||
    "Upload a screenshot to begin AI-powered scam analysis.";

  const keywords = analysis?.suspicious_keywords || [];

  const emotions = analysis?.emotions || [
    {
      label: "Neutral",
      value: 20,
      color: "cyan",
    },
  ];

  return (
    <div className="min-h-screen bg-[#04060b] text-slate-100 relative overflow-hidden antialiased font-sans">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="cs-aurora-1 absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-cyan-500/20 blur-[120px]" />

        <div className="cs-aurora-2 absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-red-500/15 blur-[120px]" />

        <div className="cs-aurora-3 absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-fuchsia-600/10 blur-[120px]" />

        {particles.map((p) => (
          <span
            key={p.id}
            className="cs-particle absolute bottom-0 rounded-full"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `-${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--cs-x": `${p.drift}px`,
              background:
                p.color === "red"
                  ? "rgba(248,113,113,0.9)"
                  : "rgba(103,232,249,0.9)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 cs-pulse-ring rounded-2xl bg-cyan-400/40" />

              <div className="relative w-12 h-12 rounded-2xl bg-slate-950/70 backdrop-blur-xl flex items-center justify-center border border-cyan-500/20">
                <Shield className="w-6 h-6 text-cyan-300" />
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
                ThreatScale{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>

              <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-[0.25em]">
                Emotion-Aware Scam Detection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>

              <span className="text-xs font-medium text-cyan-200">
                System Online
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-300" />
              v3.0
            </div>
          </div>
        </header>

        {/* Hero Strip */}
        <div className="mb-8 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
            <Sparkles className="w-3 h-3" />
            Neural Engine Active
          </span>

          <span className="text-slate-500">
            AI-powered phishing & manipulation detection
          </span>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Upload */}
          <GlassCard tone="cyan">
            <CardTitle
              icon={<Upload className="w-4 h-4" />}
              title="Upload Screenshot"
            />

            <label className="group mt-5 block cursor-pointer">
              <div className="relative rounded-2xl border-2 border-dashed border-cyan-400/25 bg-cyan-400/[0.03] hover:border-cyan-400/70 transition-all duration-300 p-6 text-center overflow-hidden min-h-[280px] flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="rounded-xl max-h-64 object-contain"
                  />
                ) : (
                  <div>
                    <div className="mx-auto w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-cyan-300" />
                    </div>

                    <p className="text-sm font-medium text-slate-200">
                      Click to upload scam screenshot
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      PNG, JPG & JPEG supported
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </div>
            </label>

            {fileName && (
              <div className="mt-3 flex items-center gap-2 text-xs text-cyan-300">
                <CheckCircle2 className="w-4 h-4" />
                {fileName}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                disabled
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-cyan-500 text-black"
              >
                Analyze Complete
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearAll}
                className="rounded-xl px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>

          {/* Threat */}
          <GlassCard tone="red">
            <CardTitle
              icon={<AlertTriangle className="w-4 h-4" />}
              title="Threat Level"
            />

            <div className="mt-8 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-900/10 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>

              <p className="mt-5 text-2xl font-bold tracking-[0.2em] text-red-400">
                {loading ? "SCANNING..." : threatLevel}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                AI threat intelligence analysis
              </p>
            </div>
          </GlassCard>

          {/* Probability */}
          <GlassCard tone="red">
            <CardTitle
              icon={<Zap className="w-4 h-4" />}
              title="Scam Probability"
            />

            <div className="mt-6">
              <div className="flex items-end justify-between mb-3">
                <span className="text-5xl font-bold bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
                  {loading ? "--" : scamProbability}
                  <span className="text-2xl">%</span>
                </span>

                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                  Confidence
                </span>
              </div>

              <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-yellow-400 to-red-500"
                  style={{ width: `${scamProbability}%` }}
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Middle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* OCR */}
          <GlassCard tone="cyan">
            <CardTitle
              icon={<ScanText className="w-4 h-4" />}
              title="OCR Extracted Text"
            />

            <div className="relative mt-4 rounded-xl bg-black/40 p-4 font-mono text-sm leading-relaxed text-slate-300 max-h-64 overflow-auto border border-cyan-500/10">
              {loading ? (
                <div className="flex items-center gap-2 text-cyan-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning image...
                </div>
              ) : (
                <>
                  <span className="text-cyan-400">{">"} </span>
                  {ocrText}
                </>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <Eye className="w-3.5 h-3.5 text-cyan-300" />
              OCR analysis powered by AI engine
            </div>
          </GlassCard>

          {/* Emotion */}
          <GlassCard tone="cyan">
            <CardTitle
              icon={<Brain className="w-4 h-4" />}
              title="Emotion Detection"
            />

            <div className="mt-4 space-y-4">
              {emotions.map((e) => (
                <div key={e.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">
                      {e.label}
                    </span>

                    <span
                      className={
                        e.color === "red"
                          ? "text-red-400"
                          : "text-cyan-300"
                      }
                    >
                      {e.value}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        e.color === "red"
                          ? "bg-gradient-to-r from-red-500 to-red-300"
                          : "bg-gradient-to-r from-cyan-500 to-cyan-300"
                      }`}
                      style={{ width: `${e.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Keywords */}
        <GlassCard tone="red">
          <CardTitle
            icon={<Tag className="w-4 h-4" />}
            title="Suspicious Keywords"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {keywords.length > 0 ? (
              keywords.map((k) => (
                <span
                  key={k}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 text-red-200 border border-red-500/30"
                >
                  #{k}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">
                No suspicious keywords detected
              </span>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            AI identifies phishing language, urgency signals and
            social engineering patterns.
          </p>
        </GlassCard>

        {/* Footer */}
        <footer className="mt-14 border-t border-white/5 pt-6 text-center">
          <p className="text-sm text-slate-500">
            ThreatScale AI • Emotion-Aware Scam Detection System
          </p>

          <p className="mt-2 text-xs text-slate-600">
            © 2026 Abhinandan Chatterjee. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

function GlassCard({ children, className = "", tone = "cyan" }) {
  const glow =
    tone === "red"
      ? "hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.35)]"
      : "hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.35)]";

  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${glow} ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

      <div className="relative">{children}</div>
    </div>
  );
}

function CardTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5 text-slate-200">
      <span className="w-7 h-7 rounded-lg border border-cyan-500/20 bg-slate-950/60 flex items-center justify-center text-cyan-300">
        {icon}
      </span>

      <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase">
        {title}
      </h2>
    </div>
  );
}