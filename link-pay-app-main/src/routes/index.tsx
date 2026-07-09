import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PayLink — Send, receive, and manage money instantly" },
      {
        name: "description",
        content:
          "PayLink is a modern digital wallet. Send money in seconds with @handles, request payments, top up your balance, and track every transaction.",
      },
    ],
  }),
  component: Landing,
});
// ── Scramble hook ──────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+";

function useScramble(original: string) {
  const [display, setDisplay] = useState(original);
  const raf = useRef<number | null>(null);
  const iteration = useRef(0);

  const scramble = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    iteration.current = 0;

    const step = () => {
      const progress = iteration.current / (original.length * 3);
      setDisplay(
        original
          .split("")
          .map((char, idx) => {
            if (char === "." || char === "%" || char === "+" || char === "s") return char;
            if (idx < Math.floor(progress * original.length)) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iteration.current += 1;
      if (iteration.current < original.length * 4) {
        raf.current = requestAnimationFrame(step);
      } else {
        setDisplay(original);
      }
    };
    raf.current = requestAnimationFrame(step);
  }, [original]);

  return { display, scramble };
}

// ── Stat item ──────────────────────────────────────────────────────────────
function StatItem({
  value,
  label,
  gradient,
  glow,
}: {
  value: string;
  label: string;
  gradient: string;
  glow: string;
}) {
  const { display, scramble } = useScramble(value);

  return (
    <div
      className="flex flex-col items-center text-center group cursor-default"
      onMouseEnter={scramble}
      style={{ padding: "0 8px" }}
    >
      {/* Number */}
      <p
        style={{
          fontSize: "clamp(32px, 4vw, 48px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 12,
          background: gradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          transition: "filter 0.3s",
          fontFamily: "'Montserrat', sans-serif",
          fontVariantNumeric: "tabular-nums",
          filter: "drop-shadow(0 0 0px transparent)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.filter = `drop-shadow(0 0 16px ${glow})`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 0 0px transparent)";
        }}
      >
        {display}
      </p>
      {/* Label */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#bec6e0",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {label}
      </p>
      {/* Underline accent */}
      <div
        style={{
          marginTop: 12,
          height: 2,
          width: 0,
          borderRadius: 2,
          background: gradient,
          transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
        className="group-hover:!w-full"
      />
    </div>
  );
}

// ── Stats Strip ────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    {
      value: "50K+",
      label: "Transactions/mo",
      gradient: "linear-gradient(135deg, #d2bbff 0%, #a78bfa 100%)",
      glow: "rgba(167,139,250,0.5)",
    },
    {
      value: "99.9%",
      label: "Service Uptime",
      gradient: "linear-gradient(135deg, #7bd0ff 0%, #38bdf8 100%)",
      glow: "rgba(56,189,248,0.5)",
    },
    {
      value: "180+",
      label: "Active Merchants",
      gradient: "linear-gradient(135deg, #6ee7b7 0%, #10B981 100%)",
      glow: "rgba(16,185,129,0.5)",
    },
    {
      value: "2s",
      label: "Avg. Settlement",
      gradient: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
      glow: "rgba(245,158,11,0.5)",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#0c1929",
        borderTop: "1px solid rgba(74,68,85,0.2)",
        borderBottom: "1px solid rgba(74,68,85,0.2)",
        padding: "72px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial bg glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(210,187,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "40px 24px",
        }}
        className="grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
      <style>{`
        .group:hover .group-hover\\:!w-full {
          width: 100% !important;
        }
      `}</style>
    </div>
  );
}

// ── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  desc,
  gradient,
  shadow,
}: {
  icon: string;
  title: string;
  desc: string;
  gradient: string;
  shadow: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(145deg, #16253e 0%, #1a2f4a 100%)"
          : "linear-gradient(145deg, #0f1d30 0%, #131e2e 100%)",
        borderRadius: 24,
        padding: 36,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
        boxShadow: hovered
          ? `0 24px 56px -12px rgba(0,0,0,0.55), 0 0 40px -8px ${shadow}, inset 0 1px 0 rgba(255,255,255,0.06)`
          : "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line that reveals on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: gradient,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
          borderRadius: "24px 24px 0 0",
        }}
      />
      {/* Subtle background glow blob */}
      <div
        style={{
          position: "absolute",
          top: -30,
          left: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: shadow.replace("0.25", hovered ? "0.12" : "0"),
          filter: "blur(40px)",
          transition: "all 0.5s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: hovered ? gradient : "rgba(210,187,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 22,
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: hovered ? "translateY(-4px) scale(1.12)" : "none",
          boxShadow: hovered ? `0 12px 28px -6px ${shadow}` : "none",
          position: "relative",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 26,
            color: hovered ? "#ffffff" : "#d2bbff",
            transition: "color 0.3s",
            fontVariationSettings: hovered ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {icon}
        </span>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: hovered ? "#ffffff" : "#d8e3fb", marginBottom: 10, transition: "color 0.3s" }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#bec6e0", lineHeight: 1.7, marginBottom: 22 }}>{desc}</p>
      <a
        href="#"
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#d2bbff",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 0.3s",
        }}
      >
        Learn more
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 16,
            transform: hovered ? "translateX(5px)" : "none",
            transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          arrow_forward
        </span>
      </a>
    </div>
  );
}

function Landing() {

  return (
    <div
      style={{ backgroundColor: "#081425", color: "#d8e3fb", fontFamily: "'Montserrat', sans-serif" }}
      className="overflow-x-hidden min-h-screen"
    >
      {/* ── Top Navigation ── */}
      <header
        style={{
          backgroundColor: "rgba(8,20,37,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(74,68,85,0.3)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "24px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #d2bbff 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#081425", fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#d8e3fb",
                letterSpacing: "-0.03em",
              }}
            >
              PayLink
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {["Products", "Company", "Pricing", "Developers"].map((item, i) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 14,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? "#d2bbff" : "#bec6e0",
                  textDecoration: "none",
                  borderBottom: i === 0 ? "2px solid #d2bbff" : "none",
                  paddingBottom: 2,
                  transition: "color 0.2s",
                }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#bec6e0",
                textDecoration: "none",
                letterSpacing: "0.03em",
                padding: "8px 16px",
              }}
            >
              Log in
            </Link>
            <Link
              to="/auth"
              search={{ mode: "register" }}
              style={{
                fontSize: 13,
                fontWeight: 700,
                background: "#d2bbff",
                color: "#3f008e",
                textDecoration: "none",
                letterSpacing: "0.05em",
                padding: "10px 24px",
                borderRadius: 9999,
                boxShadow: "0 4px 20px rgba(210,187,255,0.25)",
                transition: "all 0.2s",
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero Section ── */}
        <section
          style={{ position: "relative", paddingTop: 80, paddingBottom: 100, overflow: "hidden" }}
        >
          {/* Glow backdrop */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 1000,
              height: 500,
              background: "radial-gradient(circle at 50% 40%, rgba(210,187,255,0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            {/* Left — Hero Copy */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 mb-8"
                style={{
                  background: "rgba(210,187,255,0.1)",
                  border: "1px solid rgba(210,187,255,0.25)",
                  borderRadius: 9999,
                  padding: "6px 16px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "#d2bbff",
                    display: "inline-block",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#d2bbff",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Now live for businesses in Ghana
                </span>
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontSize: "clamp(32px, 4.5vw, 52px)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: "#d8e3fb",
                  marginBottom: 24,
                  maxWidth: "540px",
                }}
                className="mx-auto lg:mx-0"
              >
                Money at the <br className="hidden lg:inline" />
                <span
                  style={{
                    background: "linear-gradient(135deg, #d2bbff 0%, #7bd0ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                  }}
                >
                  speed of a message.
                </span>
              </h1>

              {/* Subheading */}
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: "#bec6e0",
                  marginBottom: 40,
                  maxWidth: 480,
                }}
                className="mx-auto lg:mx-0"
              >
                PayLink is a modern digital wallet built for humans. Send, receive,
                and track your money with a beautiful, secure experience that scales
                with your ambition.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link
                  to="/auth"
                  search={{ mode: "register" }}
                  className="flex items-center gap-2 group"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    padding: "14px 32px",
                    borderRadius: 14,
                    textDecoration: "none",
                    boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
                    transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(124,58,237,0.55)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(124,58,237,0.4)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  Get started free
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18, transition: "transform 0.2s" }}
                  >
                    arrow_forward
                  </span>
                </Link>
                <Link
                  to="/auth"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#d8e3fb",
                    textDecoration: "none",
                    padding: "14px 32px",
                    borderRadius: 14,
                    border: "1.5px solid rgba(74,68,85,0.6)",
                    transition: "all 0.2s",
                  }}
                >
                  Log in
                </Link>
              </div>

              {/* Trust row */}
              <div
                style={{
                  borderTop: "1px solid rgba(74,68,85,0.3)",
                  paddingTop: 28,
                }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDKDVfED3z0C5hmiTJNZ_Isj86ROI2xgc1n91WMhE7wne-Novl6QX-Mur_ff2VWy4EX2-w5qkTA4bRPSb-JWH38euCkXMBwNB9456d_YdGPbJAelq1uXE-z75uiu0Za_YGsARnVxwRGJ-Dn8n5JlyyQvSVCpXtpvMul00RBaIG7QbR9oj0p4m6H4uEE7Snjr73rSFS02oL66ec8fQ2-0CK1fQ-Pa2QcYk74nY5LENTtOVMFyD5Giw",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc80OSI8kjcDzDJe-bZIjFTNRtwi9aPxL8XeP7-79tYgHiO9SJPdQF9y6fvrgmNuIkNenwv45jLig90rOU5D8Ko4Vw1ndKvSgbu2F8WkT1MtW_DltoXMU6fGagdZWa3sg2dAq2Ngy6o5MfNexvnhL5C6mJW2Xko56e1XEVYuKgMD2aK3hJ7A6QieMiNAIUdoepoaVA4UbLVuWooS-GlZb7djK9ybTHVpi_c_RIoYn8Oh5rh0FYJhw",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBld-w3OYb7OvlPD8QuKgS2-HmOc_fdleDBTWohFA0yGR6piBJloS5HrbiYyvwSWpoZA2-hfmwqZjVC2598emQra-1nSQL0hMnjsDKZS71B01ThN5yt7GHDX0IdEa5FNSOJLUUz3We2lNxyNBzOUcGp727MWj3D3niWHKw7MWOHs1SL-UYMuE9bbwEsaXAKVmjF34xZiZI944HsOvQmcvygFw78bsO0sxbjgkfUNmxK01g8lRs05Q",
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt="User"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: "2px solid #081425",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "2px solid #081425",
                        background: "#7c3aed",
                        color: "#ede0ff",
                        fontSize: 10,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +10k
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#d8e3fb" }}>
                    Join 10,000+ users worldwide
                  </span>
                </div>
                <div
                  className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2"
                  style={{ fontSize: 13, color: "#bec6e0" }}
                >
                  {[
                    "Bank-grade security",
                    "No hidden fees",
                    "Instant settlement",
                    "Trusted by 180+ businesses",
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 15, color: "#10B981", fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — App Visual */}
            <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
              {/* Glow behind card */}
              <div
                style={{
                  position: "absolute",
                  inset: -40,
                  background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
                  filter: "blur(60px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />
              {/* Wallet card visual */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 420,
                  borderRadius: 28,
                  background: "linear-gradient(145deg, #152031 0%, #1f2a3c 100%)",
                  border: "1px solid rgba(210,187,255,0.15)",
                  padding: 28,
                  boxShadow: "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(210,187,255,0.05)",
                }}
              >
                {/* Card header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#bec6e0", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                      Total Balance
                    </p>
                    <p style={{ fontSize: 34, fontWeight: 800, color: "#d8e3fb", letterSpacing: "-0.03em", lineHeight: 1 }}>
                      $12,480.55
                    </p>
                    <p style={{ fontSize: 12, color: "#10B981", fontWeight: 600, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                      +28% this month
                    </p>
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #d2bbff, #7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#fff", fontVariationSettings: "'FILL' 1" }}>
                      account_balance_wallet
                    </span>
                  </div>
                </div>

                {/* Sparkline placeholder */}
                <div
                  style={{
                    height: 60,
                    borderRadius: 10,
                    background: "linear-gradient(90deg, rgba(124,58,237,0.15) 0%, rgba(210,187,255,0.08) 50%, rgba(124,58,237,0.2) 100%)",
                    marginBottom: 24,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <svg viewBox="0 0 400 60" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d2bbff" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#d2bbff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,50 C40,45 80,30 120,35 S200,15 240,20 S320,10 360,5 L360,60 L0,60 Z"
                      fill="url(#lineGrad)"
                    />
                    <path
                      d="M0,50 C40,45 80,30 120,35 S200,15 240,20 S320,10 360,5"
                      fill="none"
                      stroke="#d2bbff"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: "send", label: "Send" },
                    { icon: "call_received", label: "Receive" },
                    { icon: "add_card", label: "Top up" },
                    { icon: "qr_code_scanner", label: "Scan" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          background: "rgba(210,187,255,0.08)",
                          border: "1px solid rgba(210,187,255,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#d2bbff" }}>
                          {icon}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "#bec6e0" }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Recent transactions */}
                <p style={{ fontSize: 11, fontWeight: 700, color: "#bec6e0", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                  Recent Transactions
                </p>
                {[
                  { name: "Starbucks", amount: "-$9.50", icon: "local_cafe", color: "#f59e0b" },
                  { name: "Amazon", amount: "-$45.20", icon: "shopping_bag", color: "#7bd0ff" },
                  { name: "Salary", amount: "+$3,200.00", icon: "payments", color: "#10B981" },
                ].map(({ name, amount, icon, color }) => (
                  <div
                    key={name}
                    className="flex justify-between items-center"
                    style={{ padding: "10px 0", borderBottom: "1px solid rgba(74,68,85,0.2)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: `${color}18`,
                          border: `1px solid ${color}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color, fontVariationSettings: "'FILL' 1" }}>
                          {icon}
                        </span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#d8e3fb" }}>{name}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: amount.startsWith("+") ? "#10B981" : "#d8e3fb",
                      }}
                    >
                      {amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Strip ── */}
        <StatsStrip />

        {/* ── Features ── */}
        <section style={{ padding: "100px 0", backgroundColor: "#081425" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ maxWidth: 700, marginBottom: 64, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#d2bbff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                Features
              </p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#d8e3fb", lineHeight: 1.15, marginBottom: 16 }}>
                Everything you need to move money
              </h2>
              <p style={{ fontSize: 16, color: "#bec6e0", lineHeight: 1.7 }}>
                A wallet designed to feel effortless — with the polish of a modern fintech and none of the traditional friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "speed",
                  title: "Instant transfers",
                  desc: "Send money to any @handle in seconds. Balances update the moment the transfer completes.",
                  gradient: "linear-gradient(135deg, #d2bbff 0%, #8b5cf6 100%)",
                  shadow: "rgba(139, 92, 246, 0.25)",
                },
                {
                  icon: "link",
                  title: "Request with a link",
                  desc: "Share a payment link or QR code. Set an amount or leave it open — collect on your terms.",
                  gradient: "linear-gradient(135deg, #7bd0ff 0%, #3b82f6 100%)",
                  shadow: "rgba(59, 130, 246, 0.25)",
                },
                {
                  icon: "analytics",
                  title: "Track everything",
                  desc: "See your balance history, filter transactions, and download receipts whenever you need them.",
                  gradient: "linear-gradient(135deg, #ff9eb5 0%, #ec4899 100%)",
                  shadow: "rgba(236, 72, 153, 0.25)",
                },
                {
                  icon: "account_balance",
                  title: "Simple wallet",
                  desc: "Link accounts, top up your balance, and see your total at a glance. No complexity.",
                  gradient: "linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)",
                  shadow: "rgba(16, 185, 129, 0.25)",
                },
                {
                  icon: "verified_user",
                  title: "Secure by default",
                  desc: "Two-factor authentication, biometric login, and encrypted sessions keep your money safe.",
                  gradient: "linear-gradient(135deg, #a5b4fc 0%, #4f46e5 100%)",
                  shadow: "rgba(79, 70, 229, 0.25)",
                },
                {
                  icon: "devices",
                  title: "Built for the web",
                  desc: "A responsive, accessible experience that feels great on every device you own.",
                  gradient: "linear-gradient(135deg, #fcd34d 0%, #d97706 100%)",
                  shadow: "rgba(217, 119, 6, 0.25)",
                },
              ].map((feat) => (
                <FeatureCard key={feat.title} {...feat} />
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section style={{ padding: "100px 0", backgroundColor: "#040e1f", overflow: "hidden" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
            <div className="text-center" style={{ marginBottom: 64 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#d2bbff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                How it works
              </p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#d8e3fb", lineHeight: 1.15, marginBottom: 12 }}>
                Up and running in 3 minutes
              </h2>
              <p style={{ fontSize: 16, color: "#bec6e0", maxWidth: 480, margin: "0 auto" }}>
                Get up and running with PayLink faster than making a cup of coffee.
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
              {/* Connector */}
              <div
                style={{
                  display: "none",
                }}
                className="md:block absolute"
                aria-hidden
              />
              {[
                { num: "01", title: "Create account", desc: "Sign up on the web. Verifying your identity takes under 60 seconds." },
                { num: "02", title: "Send or Request", desc: "Enter a handle or phone number. Send funds or request payments instantly." },
                { num: "03", title: "Track & Scale", desc: "Monitor every transaction with detailed analytics and tax-ready reporting." },
              ].map(({ num, title, desc }, i) => (
                <div key={num} className="relative text-center" style={{ zIndex: 1 }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: i === 0 ? "50%" : 22,
                      background: i === 0
                        ? "linear-gradient(135deg, #d2bbff 0%, #7c3aed 100%)"
                        : "rgba(210,187,255,0.06)",
                      border: i === 0 ? "none" : "1px solid rgba(210,187,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      boxShadow: i === 0 ? "0 12px 40px rgba(210,187,255,0.25)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? "#3f008e" : "#d2bbff" }}>{num}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#d8e3fb", marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "#bec6e0", lineHeight: 1.65, maxWidth: 280, margin: "0 auto" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section style={{ padding: "100px 0", backgroundColor: "#081425" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
            <div className="text-center" style={{ marginBottom: 64 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#d2bbff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                Testimonials
              </p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#d8e3fb", lineHeight: 1.15 }}>
                Loved by ambitious founders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "PayLink has completely transformed how we handle vendor payments in Accra. It's faster than any bank we've used.",
                  name: "Kofi Mensah",
                  role: "Founder, TechSpace GH",
                  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1B4c1EXOuCCYEi5X07-U4buI273gnDTMlRi_4w6SDTCnp7gKhqw_LhonyrFGUnLSosx1-I_jfD8vncPtFJ6iJ5xFblCgd05jm5Los3_QMqgGkx0kgUjPzbHJ5aoWkMOp9Fobiu2d3hiW7DH62qd0zTo56P3uriPkOPwtgYcXtNXsoAEd7YunKI2ySJDrjmaUvmj0uCuY2dS25w6FHrzAFYr-QfYHMyBViCKqnfKAPPXJpSSUqIlA",
                },
                {
                  quote: "The API documentation is incredible. We integrated PayLink into our store in less than an afternoon.",
                  name: "Sarah Jenkins",
                  role: "CTO, Bloom Retail",
                  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp06kOR-e4EAdruT-pMwvr4fWgx2fjQvTdgi6YTRLAxfaltDEPL74kTnPE-KlkeXEDHg6dV-5RFzdFNEABy4tEF-GUEkWGqhBBi97e-G3jLALBGseVZXCC7cBY32lPGchyMtCeCK2dPAZJ4QbMxcuWnd0w9sMWCJStqDLBuXzv-BepJaElz-a6qndrNft7Lb59peIq4hBoUXPHUeQetZgk0BGq-TQvtUqxrtm87YZVd39f-3ef1CM",
                },
                {
                  quote: "Finally, a fintech app that looks as good as it works. The UX is miles ahead of anything else on the market.",
                  name: "Marco Rossi",
                  role: "Designer, Studio M",
                  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiF0sZy170BQkxPnf3oGX-IKrJlBPK7DMI-nz7NB4h6KDbXz-8CdcidNxk-SaCdnaWLZknAV0lwNSBGSTWND5vOkW-EtnmRMKf6rYpIdjwsW-SeqPhyCsRs9MAt6EP3py5Hz6DHzV7QTuGylDatJinYxu-0gVfCxXCZGxAxZ6ODGruHwXr1F9q2qUFBSUnO8hEIxjJA-eUxJ_M7dK4_Vx06KKT7tDfmNYnhthWFA3_8D5aabzahfQ",
                },
              ].map(({ quote, name, role, avatar }) => (
                <div
                  key={name}
                  style={{
                    background: "linear-gradient(160deg, #0f1d30 0%, #131e2e 60%, #101929 100%)",
                    borderRadius: 24,
                    padding: 34,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0.5px rgba(210,187,255,0.06)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 30px -5px rgba(210,187,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0.5px rgba(210,187,255,0.06)";
                  }}
                >
                  {/* Subtle purple orb top-right */}
                  <div
                    style={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(210,187,255,0.07) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Quote mark accent */}
                  <div
                    style={{
                      fontSize: 56,
                      lineHeight: 1,
                      color: "rgba(210,187,255,0.12)",
                      fontFamily: "Georgia, serif",
                      marginBottom: -10,
                      marginTop: -6,
                      fontWeight: 900,
                    }}
                  >
                    &ldquo;
                  </div>
                  {/* Stars */}
                  <div className="flex gap-1" style={{ marginBottom: 16 }}>
                    {Array(5).fill(0).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontSize: 16, color: "#d2bbff", fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: "#c8d6f0", lineHeight: 1.75, fontStyle: "italic", marginBottom: 28 }}>
                    {quote}
                  </p>
                  <div style={{ height: 1, background: "linear-gradient(90deg, rgba(210,187,255,0.12) 0%, transparent 100%)", marginBottom: 24 }} />
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={name}
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        objectFit: "cover",
                        boxShadow: "0 0 0 2px rgba(210,187,255,0.25), 0 4px 12px rgba(0,0,0,0.4)",
                      }}
                    />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#d8e3fb" }}>{name}</p>
                      <p style={{ fontSize: 12, color: "#8a96b0" }}>{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section style={{ padding: "100px 0", backgroundColor: "#040e1f" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
            <div className="text-center" style={{ marginBottom: 64 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#d2bbff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                Pricing
              </p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#d8e3fb", lineHeight: 1.15, marginBottom: 12 }}>
                Simple, transparent pricing
              </h2>
              <p style={{ fontSize: 16, color: "#bec6e0" }}>No hidden fees, no surprises. Choose the plan that fits your scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {[
                {
                  name: "Personal",
                  sub: "For individuals and friends.",
                  price: "$0",
                  period: "/mo",
                  features: ["Unlimited P2P transfers", "Virtual card included"],
                  missing: ["Priority support"],
                  highlight: false,
                  cta: "Get started",
                  ctaLink: true,
                },
                {
                  name: "Business",
                  sub: "For growing teams and startups.",
                  price: "$29",
                  period: "/mo",
                  features: ["Everything in Personal", "Business Dashboard", "3% Cash back on ads", "Multi-user access"],
                  missing: [],
                  highlight: true,
                  badge: "Most Popular",
                  cta: "Try 14 days free",
                  ctaLink: true,
                },
                {
                  name: "Enterprise",
                  sub: "For global organizations.",
                  price: "Custom",
                  period: "",
                  features: ["Custom API limits", "Dedicated account manager", "White-label options"],
                  missing: [],
                  highlight: false,
                  cta: "Contact sales",
                  ctaLink: false,
                },
              ].map(({ name, sub, price, period, features, missing, highlight, badge, cta, ctaLink }) => (
                <div
                  key={name}
                  style={{
                    background: highlight ? "#152031" : "#111c2d",
                    border: highlight ? "2px solid #d2bbff" : "1px solid rgba(74,68,85,0.3)",
                    borderRadius: 24,
                    padding: 36,
                    position: "relative",
                    boxShadow: highlight ? "0 0 60px rgba(210,187,255,0.1)" : "none",
                    transform: highlight ? "scale(1.03)" : "none",
                    zIndex: highlight ? 1 : 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: -14,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#d2bbff",
                        color: "#3f008e",
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        padding: "4px 16px",
                        borderRadius: 9999,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {badge}
                    </div>
                  )}

                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#d8e3fb", marginBottom: 6 }}>{name}</h3>
                  <p style={{ fontSize: 13, color: "#bec6e0", marginBottom: 24 }}>{sub}</p>
                  <div style={{ marginBottom: 28 }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: "#d8e3fb", letterSpacing: "-0.03em" }}>{price}</span>
                    {period && <span style={{ fontSize: 14, color: "#bec6e0" }}>{period}</span>}
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flexGrow: 1 }}>
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-3" style={{ fontSize: 14, color: "#d8e3fb", marginBottom: 14 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#10B981", fontVariationSettings: "'FILL' 1", flexShrink: 0 }}>check_circle</span>
                        {f}
                      </li>
                    ))}
                    {missing.map((f) => (
                      <li key={f} className="flex items-center gap-3" style={{ fontSize: 14, color: "rgba(190,198,224,0.4)", marginBottom: 14 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "rgba(190,198,224,0.3)", flexShrink: 0 }}>cancel</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {ctaLink ? (
                    <Link
                      to="/auth"
                      search={highlight ? { mode: "register" } : undefined}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "14px 0",
                        borderRadius: 12,
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        textDecoration: "none",
                        background: highlight ? "#d2bbff" : "transparent",
                        color: highlight ? "#3f008e" : "#d2bbff",
                        border: highlight ? "none" : "2px solid #d2bbff",
                        transition: "all 0.2s",
                        boxSizing: "border-box",
                      }}
                    >
                      {cta}
                    </Link>
                  ) : (
                    <Link
                      to="/auth"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "14px 0",
                        borderRadius: 12,
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        textDecoration: "none",
                        background: "transparent",
                        color: "#d8e3fb",
                        border: "2px solid rgba(74,68,85,0.6)",
                        transition: "all 0.2s",
                        boxSizing: "border-box",
                      }}
                    >
                      {cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: "100px 0", backgroundColor: "#081425" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px" }}>
            <div className="text-center" style={{ marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#d2bbff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                FAQ
              </p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#d8e3fb", lineHeight: 1.15 }}>
                Frequently Asked Questions
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  q: "How secure is PayLink?",
                  a: "We use AES-256 bank-grade encryption for all data and 2FA for every account. Your funds are held in regulated partner banks and are fully insured.",
                },
                {
                  q: "Are there really no fees for P2P transfers?",
                  a: "Yes! Sending money to other PayLink users is completely free, anywhere in the world. We only charge for business-specific features and currency conversions.",
                },
                {
                  q: "Can I use PayLink for my business in Ghana?",
                  a: "Absolutely. We are fully operational in Ghana, supporting local settlements and mobile money integrations for registered businesses.",
                },
                {
                  q: "How long does a withdrawal take?",
                  a: "Withdrawals to linked bank accounts typically take 1-3 business days, while withdrawals to supported debit cards or mobile wallets are often instant.",
                },
                {
                  q: "Is there a developer API?",
                  a: "Yes, we provide robust REST APIs for automated payments, subscription billing, and real-time transaction webhooks.",
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  style={{
                    background: "#111c2d",
                    border: "1px solid rgba(74,68,85,0.3)",
                    borderRadius: 16,
                    padding: "20px 24px",
                  }}
                >
                  <summary
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#d8e3fb",
                      cursor: "pointer",
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    {q}
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#bec6e0", flexShrink: 0 }}>
                      expand_more
                    </span>
                  </summary>
                  <p style={{ fontSize: 14, color: "#bec6e0", lineHeight: 1.7, marginTop: 16 }}>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={{ padding: "60px 40px" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              background: "linear-gradient(135deg, #1f2a3c 0%, #2a1a4a 50%, #3f008e 100%)",
              borderRadius: 36,
              padding: "80px 60px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Dot grid overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.07) 1px, transparent 0)",
                backgroundSize: "28px 28px",
                pointerEvents: "none",
              }}
            />
            {/* Glow blobs */}
            <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, background: "rgba(255,255,255,0.06)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, background: "rgba(124,58,237,0.2)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#ede0ff", lineHeight: 1.1, marginBottom: 20 }}>
                Your money,<br />beautifully organized.
              </h2>
              <p style={{ fontSize: 17, color: "rgba(237,224,255,0.75)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
                Sign up in seconds and start sending money like a message. Join thousands of users who have upgraded their daily banking experience.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/auth"
                  search={{ mode: "register" }}
                  className="flex items-center justify-center gap-2"
                  style={{
                    background: "#ede0ff",
                    color: "#3f008e",
                    fontSize: 15,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    padding: "16px 40px",
                    borderRadius: 9999,
                    textDecoration: "none",
                    boxShadow: "0 8px 30px rgba(237,224,255,0.2)",
                  }}
                >
                  Create your account
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                </Link>
                <Link
                  to="/auth"
                  style={{
                    background: "transparent",
                    color: "#ede0ff",
                    fontSize: 15,
                    fontWeight: 700,
                    padding: "16px 40px",
                    borderRadius: 9999,
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: "#040e1f", padding: "80px 0 40px", borderTop: "1px solid rgba(74,68,85,0.15)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-8" style={{ marginBottom: 60 }}>
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: "linear-gradient(135deg, #d2bbff 0%, #7c3aed 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#081425", fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#d8e3fb", letterSpacing: "-0.03em" }}>PayLink</span>
              </div>
              <p style={{ fontSize: 13, color: "#bec6e0", lineHeight: 1.7, maxWidth: 260, marginBottom: 24 }}>
                Empowering the next generation of global commerce with seamless financial infrastructure.
              </p>
              <div className="flex gap-3">
                {["public", "terminal", "alternate_email"].map((icon) => (
                  <a
                    key={icon}
                    href="#"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "#111c2d",
                      border: "1px solid rgba(74,68,85,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#bec6e0",
                      textDecoration: "none",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { heading: "Product", links: ["Personal Wallet", "Business Account", "Virtual Cards", "Payment Links"] },
              { heading: "Company", links: ["About Us", "Careers", "Newsroom", "Sustainability"] },
              { heading: "Resources", links: ["Help Center", "Developer API", "Community", "Status"] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <h4 style={{ fontSize: 11, fontWeight: 700, color: "#d8e3fb", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 20 }}>
                  {heading}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {links.map((link) => (
                    <li key={link} style={{ marginBottom: 12 }}>
                      <a href="#" style={{ fontSize: 13, color: "#bec6e0", textDecoration: "none", transition: "color 0.2s" }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter */}
            <div className="col-span-2 lg:col-span-1">
              <h4 style={{ fontSize: 11, fontWeight: 700, color: "#d8e3fb", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 20 }}>
                Stay Updated
              </h4>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    placeholder="Email address"
                    style={{
                      width: "100%",
                      background: "#111c2d",
                      border: "1px solid rgba(74,68,85,0.4)",
                      borderRadius: 12,
                      padding: "12px 52px 12px 16px",
                      fontSize: 13,
                      color: "#d8e3fb",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      position: "absolute",
                      right: 6,
                      top: 6,
                      bottom: 6,
                      background: "#d2bbff",
                      color: "#3f008e",
                      border: "none",
                      borderRadius: 8,
                      width: 36,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </button>
                </div>
                <p style={{ fontSize: 11, color: "#bec6e0" }}>Receive weekly updates. No spam.</p>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              paddingTop: 28,
              borderTop: "1px solid rgba(74,68,85,0.2)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <p style={{ fontSize: 12, color: "rgba(190,198,224,0.5)" }}>
              © 2025 PayLink Technologies Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" style={{ fontSize: 12, color: "rgba(190,198,224,0.5)", textDecoration: "none" }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        details[open] > summary span.material-symbols-outlined {
          transform: rotate(180deg);
        }
        details > summary span.material-symbols-outlined {
          transition: transform 0.2s;
        }
        a:hover { opacity: 0.85; }
        input::placeholder { color: rgba(190,198,224,0.4); }
      `}</style>
    </div>
  );
}
