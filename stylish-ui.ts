export const STYLISH_UI_FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">';

export const STYLISH_UI_CSS = `<style id="gb-stylish-ui-css">
/* ==========================================================================
   GB STUDY — Architectural Cobalt & Obsidian Kinetic Design System
   Complete visual identity overhaul with multi-layer compositor animations
   ========================================================================== */
:root {
  --primary-color: #2563eb !important;
  --primary-hover: #1d4ed8 !important;
  --primary-rgb: 37 99 235 !important;
  --primary-color-rgb: 37, 99, 235 !important;
  --primary-color-dark: #1e40af !important;
  --secondary-color: #0ea5e9 !important;
  --accent-color: #10b981 !important;
  --indigo-color: #6366f1 !important;
  --text-primary: #0f172a !important;
  --text-secondary: #475569 !important;
  --text-tertiary: #64748b !important;
  --bg-primary: #f4f7fb !important;
  --bg-secondary: #eaf0fa !important;
  --bg-tertiary: #dfe8f7 !important;
  --card-bg: #ffffff !important;
  --card-border: rgba(15, 23, 42, 0.09) !important;
  --card-shadow: 0 10px 28px -8px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(37, 99, 235, 0.05) !important;
  --card-shadow-hover: 0 26px 52px -12px rgba(15, 23, 42, 0.16), 0 12px 28px -6px rgba(37, 99, 235, 0.26) !important;
  --skeleton-bg: #e2e8f0 !important;
  --skeleton-shine: rgba(255, 255, 255, 0.9) !important;
  --success-color: #059669 !important;
  --error-color: #dc2626 !important;
  --warning-color: #d97706 !important;
  --info-color: #0284c7 !important;
  --border-radius-sm: 10px !important;
  --border-radius: 14px !important;
  --border-radius-lg: 20px !important;
  --border-radius-xl: 26px !important;

  --gb-ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  --gb-ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --gb-glass-bg: rgba(255, 255, 255, 0.8);
  --gb-glass-strong: rgba(255, 255, 255, 0.92);
  --gb-glass-border: rgba(15, 23, 42, 0.09);
  --gb-glow-1: rgba(37, 99, 235, 0.18);
  --gb-glow-2: rgba(14, 165, 233, 0.16);
  --gb-glow-3: rgba(16, 185, 129, 0.13);
  --gb-glow-4: rgba(99, 102, 241, 0.14);
  --gb-cta-grad: linear-gradient(135deg, #2563eb 0%, #0284c7 48%, #0ea5e9 100%);
  --gb-surface-subtle: rgba(241, 245, 249, 0.82);
}

html.dark-mode, body.dark-mode, .dark-mode {
  --primary-color: #38bdf8 !important;
  --primary-hover: #0ea5e9 !important;
  --primary-rgb: 56 189 248 !important;
  --primary-color-rgb: 56, 189, 248 !important;
  --primary-color-dark: #0284c7 !important;
  --secondary-color: #818cf8 !important;
  --accent-color: #34d399 !important;
  --indigo-color: #a78bfa !important;
  --text-primary: #f1f5f9 !important;
  --text-secondary: #cbd5e1 !important;
  --text-tertiary: #94a3b8 !important;
  --bg-primary: #060a14 !important;
  --bg-secondary: #0b1222 !important;
  --bg-tertiary: #111c33 !important;
  --card-bg: #0f172a !important;
  --card-bg-dark: #0f172a !important;
  --text-primary-dark: #f1f5f9 !important;
  --text-secondary-dark: #cbd5e1 !important;
  --text-tertiary-dark: #94a3b8 !important;
  --card-border: rgba(148, 163, 184, 0.15) !important;
  --card-shadow: 0 14px 36px -10px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(56, 189, 248, 0.1) !important;
  --card-shadow-hover: 0 28px 60px -12px rgba(0, 0, 0, 0.88), 0 0 0 1px rgba(56, 189, 248, 0.42), 0 14px 36px rgba(37, 99, 235, 0.28) !important;
  --skeleton-bg: #111c33 !important;
  --skeleton-shine: rgba(56, 189, 248, 0.12) !important;
  --enhanced-shadow: 0 0 0 1px rgba(56, 189, 248, 0.2), 0 10px 28px rgba(0, 0, 0, 0.55) !important;
  --enhanced-shadow-hover: 0 0 0 1px rgba(56, 189, 248, 0.45), 0 16px 42px rgba(0, 0, 0, 0.75) !important;

  --gb-glass-bg: rgba(11, 18, 34, 0.82);
  --gb-glass-strong: rgba(15, 23, 42, 0.92);
  --gb-glass-border: rgba(148, 163, 184, 0.18);
  --gb-glow-1: rgba(37, 99, 235, 0.26);
  --gb-glow-2: rgba(56, 189, 248, 0.19);
  --gb-glow-3: rgba(16, 185, 129, 0.14);
  --gb-glow-4: rgba(129, 140, 248, 0.18);
  --gb-cta-grad: linear-gradient(135deg, #2563eb 0%, #0284c7 48%, #0ea5e9 100%);
  --gb-surface-subtle: rgba(15, 23, 42, 0.78);
}

#animationCanvas { display: none !important; }

body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.35s ease, color 0.3s ease;
}
body.dark-mode { letter-spacing: 0.008em; }

h1, h2, h3, h4,
.batch-title, .subject-title, .topic-title, .lecture-title,
.note-title, .dpp-title, .schedule-title, .page-title, #srTitle,
.tab-btn, .filter-btn, .load-more-btn, .gb-hero-title {
  font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif !important;
}

/* Subtle Architectural Grid Pattern Overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.45;
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(ellipse 90% 75% at 50% 15%, black 35%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 90% 75% at 50% 15%, black 35%, transparent 100%);
}
body.dark-mode::before { opacity: 0.24; }

/* Smooth Theme Switch Ripple Transition */
body.gb-theme-fade .app-container {
  animation: gbThemeCrossfade 0.42s var(--gb-ease-spring);
}

/* Top Kinetic Scroll Progress Beam */
#gb-scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 10000;
  transform-origin: left center;
  transform: scaleX(0);
  pointer-events: none;
  background: linear-gradient(90deg, #2563eb, #0ea5e9, #10b981, #6366f1, #2563eb);
  background-size: 240% 100%;
  box-shadow: 0 0 16px rgba(14, 165, 233, 0.72);
  animation: gbGradientSlide 3s linear infinite;
  transition: transform 0.08s linear;
}

/* Soft Desktop Cursor Ambient Light Field */
#gb-cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 440px;
  height: 440px;
  border-radius: 9999px;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transform: translate3d(-999px, -999px, 0);
  background: radial-gradient(circle, rgba(37, 99, 235, 0.11) 0%, rgba(14, 165, 233, 0.06) 42%, transparent 72%);
  transition: opacity 0.45s ease;
  will-change: transform;
}
body.dark-mode #gb-cursor-glow {
  background: radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(129, 140, 248, 0.07) 44%, transparent 72%);
}

/* Multi-Layer Ambient Aurora & Constellation Canvas */
#gb-aurora-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.gb-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(88px);
  opacity: 0.85;
  will-change: transform;
}
.gb-orb-1 {
  width: 540px; height: 540px; top: -180px; left: -120px;
  background: radial-gradient(circle, var(--gb-glow-1), transparent 70%);
  animation: gbOrbDrift1 15s ease-in-out infinite alternate;
}
.gb-orb-2 {
  width: 500px; height: 500px; top: 18%; right: -160px;
  background: radial-gradient(circle, var(--gb-glow-2), transparent 70%);
  animation: gbOrbDrift2 19s ease-in-out infinite alternate;
}
.gb-orb-3 {
  width: 460px; height: 460px; bottom: -140px; left: 26%;
  background: radial-gradient(circle, var(--gb-glow-3), transparent 70%);
  animation: gbOrbDrift3 17s ease-in-out infinite alternate;
}
.gb-orb-4 {
  width: 400px; height: 400px; top: 52%; left: -100px;
  background: radial-gradient(circle, var(--gb-glow-4), transparent 70%);
  animation: gbOrbDrift4 21s ease-in-out infinite alternate;
}
#gb-particles-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.app-container { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; }

/* ==========================================================================
   Floating Command Header (3-Zone Top Bar)
   ========================================================================== */
.app-header {
  position: fixed !important;
  top: 12px !important;
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%) !important;
  width: calc(100% - 32px) !important;
  max-width: 1400px !important;
  height: 64px !important;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 20px !important;
  background: var(--gb-glass-bg) !important;
  backdrop-filter: blur(22px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(22px) saturate(190%) !important;
  border: 1px solid var(--gb-glass-border) !important;
  box-shadow: 0 12px 34px -10px rgba(15, 23, 42, 0.13) !important;
  transition: transform 0.38s var(--gb-ease-spring), box-shadow 0.35s ease, background 0.3s ease !important;
  z-index: 200 !important;
  overflow: hidden;
}
.app-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 12%;
  right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.45), rgba(14, 165, 233, 0.55), transparent);
  background-size: 200% 100%;
  animation: gbGradientSlide 6s linear infinite;
  pointer-events: none;
}
body.dark-mode .app-header {
  box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.72), 0 0 0 1px rgba(56, 189, 248, 0.14) !important;
}
body.gb-scrolled .app-header {
  background: var(--gb-glass-strong) !important;
  box-shadow: 0 22px 48px -12px rgba(15, 23, 42, 0.2), 0 4px 20px rgba(37, 99, 235, 0.16) !important;
}
.app-header .container {
  height: 100%;
  max-width: 100% !important;
  padding: 0 20px !important;
}
.app-header .header-content {
  height: 100%;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 20px !important;
}
#app-logo {
  display: inline-flex !important;
  align-items: center !important;
  gap: 11px;
  white-space: nowrap;
  flex-shrink: 0;
}
#app-logo img {
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  object-fit: cover;
  border: 1.5px solid rgba(37, 99, 235, 0.35) !important;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.24);
  transition: transform 0.48s var(--gb-ease-bounce), box-shadow 0.35s ease !important;
}
#app-logo:hover img {
  transform: scale(1.1) rotate(-6deg) !important;
  box-shadow: 0 10px 26px rgba(37, 99, 235, 0.38);
}
#app-logo::after {
  content: "GB STUDY";
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 1.24rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
  background: linear-gradient(120deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gbGradientSlide 4.6s linear infinite;
}

/* Center Single-Line Navigation Links */
.gb-nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}
.gb-nav-link {
  position: relative;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-secondary) !important;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 6px 2px;
  transition: color 0.2s ease, transform 0.25s var(--gb-ease-spring) !important;
}
.gb-nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2.5px;
  border-radius: 999px;
  background: var(--gb-cta-grad);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s var(--gb-ease-spring);
}
.gb-nav-link:hover {
  transform: translateY(-1px);
  color: var(--text-primary) !important;
}
.gb-nav-link.active {
  color: var(--primary-color) !important;
}
.gb-nav-link:hover::after, .gb-nav-link.active::after {
  transform: scaleX(1);
}

.header-actions {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  flex-shrink: 0;
}
.icon-btn {
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  background: var(--gb-surface-subtle) !important;
  border: 1px solid var(--card-border) !important;
  color: var(--text-primary) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative;
  overflow: hidden;
  transition: transform 0.28s var(--gb-ease-bounce), background 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease !important;
}
.icon-btn:hover {
  transform: translateY(-3px) scale(1.04);
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
}
.icon-btn:active { transform: scale(0.9); }
.icon-btn:focus-visible, button:focus-visible, a:focus-visible, input:focus-visible {
  outline: 2px solid var(--primary-color) !important;
  outline-offset: 2px !important;
}
#reload-app:hover i { animation: gbSpinSlow 0.75s var(--gb-ease-spring); }
#theme-toggle:hover i { transform: rotate(28deg) scale(1.14); transition: transform 0.3s var(--gb-ease-bounce); }
a[href="#favorites"]:hover i { animation: gbHeartBeat 0.7s ease-in-out; color: #ef4444; }

.main-content {
  padding-top: 94px !important;
  padding-bottom: 48px !important;
}

@media (max-width: 768px) {
  .app-header {
    top: 8px !important;
    width: calc(100% - 16px) !important;
    height: 54px !important;
    border-radius: 16px !important;
  }
  .app-header .container { padding: 0 12px !important; }
  .gb-nav-links { display: none !important; }
  #app-logo img { width: 34px !important; height: 34px !important; border-radius: 10px !important; }
  #app-logo::after { font-size: 1.02rem; }
  .icon-btn { width: 38px !important; height: 38px !important; border-radius: 10px !important; }
  .main-content { padding-top: 76px !important; }
}

/* ==========================================================================
   Ultra-Animated 2-Column Hero Spotlight Deck (Home Page Only)
   ========================================================================== */
#gb-hero-deck {
  display: grid;
  grid-template-columns: minmax(0, 1.32fr) minmax(0, 0.98fr);
  gap: 26px;
  align-items: stretch;
  margin-bottom: 24px;
  padding: 34px;
  border-radius: 28px;
  background: var(--gb-glass-strong);
  backdrop-filter: blur(22px) saturate(165%);
  -webkit-backdrop-filter: blur(22px) saturate(165%);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
  animation: gbViewEnter 0.6s var(--gb-ease-spring) both;
}
#gb-hero-deck::before {
  content: "";
  position: absolute;
  inset: -1px;
  background:
    radial-gradient(460px circle at var(--gb-hx, 15%) var(--gb-hy, 15%), rgba(37, 99, 235, 0.14), transparent 58%),
    radial-gradient(520px circle at 92% 88%, rgba(16, 185, 129, 0.12), transparent 55%);
  pointer-events: none;
  transition: opacity 0.3s ease;
}
#gb-hero-deck::after {
  content: "";
  position: absolute;
  top: 0;
  left: -140%;
  width: 55%;
  height: 100%;
  background: linear-gradient(105deg, transparent 25%, rgba(255, 255, 255, 0.16) 50%, transparent 75%);
  transform: skewX(-18deg);
  pointer-events: none;
  animation: gbHeroShimmer 7.5s ease-in-out infinite;
}
body.dark-mode #gb-hero-deck::after {
  background: linear-gradient(105deg, transparent 25%, rgba(56, 189, 248, 0.09) 50%, transparent 75%);
}
.gb-hero-left {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
}
.gb-hero-eyebrow {
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--primary-color);
  animation: gbTextSlideUp 0.55s var(--gb-ease-spring) 0.04s both;
}
.gb-hero-title {
  font-size: clamp(1.9rem, 3.3vw, 2.95rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  text-wrap: balance;
  margin: 0;
  animation: gbTextSlideUp 0.6s var(--gb-ease-spring) 0.1s both;
}
.gb-hero-title span {
  background: linear-gradient(120deg, var(--primary-color), var(--secondary-color), var(--accent-color), var(--primary-color));
  background-size: 220% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gbGradientSlide 5s linear infinite;
}
.gb-hero-sub {
  font-size: 0.99rem;
  line-height: 1.62;
  color: var(--text-secondary);
  max-width: 56ch;
  margin: 0;
  animation: gbTextSlideUp 0.65s var(--gb-ease-spring) 0.16s both;
}
.gb-hero-ctas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  animation: gbTextSlideUp 0.7s var(--gb-ease-spring) 0.22s both;
}
.gb-btn-primary {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 24px;
  border-radius: 14px;
  background: var(--gb-cta-grad);
  background-size: 180% auto;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 0.94rem;
  white-space: nowrap;
  box-shadow: 0 12px 28px -6px rgba(37, 99, 235, 0.5);
  transition: transform 0.28s var(--gb-ease-bounce), box-shadow 0.28s ease !important;
  animation: gbGradientSlide 5s linear infinite;
}
.gb-btn-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(95deg, transparent, rgba(255, 255, 255, 0.34), transparent);
  transform: skewX(-20deg);
  animation: gbBtnSweep 3.8s ease-in-out infinite;
  pointer-events: none;
}
.gb-btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 18px 36px -6px rgba(37, 99, 235, 0.64);
}
.gb-btn-secondary {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 22px;
  border-radius: 14px;
  background: var(--gb-surface-subtle);
  border: 1px solid var(--card-border);
  color: var(--text-primary) !important;
  font-weight: 600;
  font-size: 0.94rem;
  white-space: nowrap;
  transition: transform 0.28s var(--gb-ease-bounce), border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease !important;
}
.gb-btn-secondary:hover {
  transform: translateY(-3px);
  border-color: var(--primary-color);
  color: var(--primary-color) !important;
  box-shadow: 0 12px 24px -8px rgba(37, 99, 235, 0.24);
}

.gb-hero-right {
  position: relative;
  z-index: 1;
  border-radius: 22px;
  background: linear-gradient(155deg, rgba(37, 99, 235, 0.09), rgba(14, 165, 233, 0.05) 55%, rgba(16, 185, 129, 0.06));
  border: 1px solid var(--card-border);
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  overflow: hidden;
  animation: gbTextSlideUp 0.65s var(--gb-ease-spring) 0.14s both;
}
.gb-orbit-wrap {
  position: relative;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s var(--gb-ease-spring);
}
.gb-orbit-halo {
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.24), rgba(14, 165, 233, 0.06) 60%, transparent 74%);
  animation: gbHaloBreathe 3.4s ease-in-out infinite;
  pointer-events: none;
}
.gb-orbit-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.gb-orbit-ring-1 {
  width: 124px; height: 124px;
  border: 1.5px dashed rgba(37, 99, 235, 0.36);
  animation: gbSpinSlow 15s linear infinite;
}
.gb-orbit-ring-2 {
  width: 96px; height: 96px;
  border: 2px solid transparent;
  border-top-color: rgba(14, 165, 233, 0.55);
  border-bottom-color: rgba(16, 185, 129, 0.5);
  animation: gbSpinReverse 8.5s linear infinite;
}
.gb-orbit-ring-3 {
  width: 72px; height: 72px;
  border: 1.5px dotted rgba(99, 102, 241, 0.48);
  animation: gbSpinSlow 6s linear infinite;
}
.gb-orbit-sat {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  box-shadow: 0 0 12px var(--secondary-color);
}
.gb-orbit-ring-1 .gb-orbit-sat { top: -4px; left: 50%; transform: translateX(-50%); }
.gb-orbit-ring-2 .gb-orbit-sat { bottom: -4px; left: 50%; transform: translateX(-50%); background: var(--accent-color); box-shadow: 0 0 12px var(--accent-color); }
.gb-hero-right:hover .gb-orbit-ring-1 { animation-duration: 7s; }
.gb-hero-right:hover .gb-orbit-ring-2 { animation-duration: 4.5s; }

.gb-orbit-core {
  position: relative;
  z-index: 2;
  width: 54px; height: 54px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(37, 99, 235, 0.45);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.32);
  animation: gbFloatBob 3.4s ease-in-out infinite;
  transition: transform 0.35s var(--gb-ease-bounce);
}
.gb-hero-right:hover .gb-orbit-core {
  transform: scale(1.08) rotate(-4deg);
}
.gb-orbit-core img { width: 100%; height: 100%; object-fit: cover; display: block; }

.gb-quick-deck {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.gb-deck-action {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 12px 13px;
  border-radius: 15px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary) !important;
  font-size: 0.81rem;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
  transition: transform 0.3s var(--gb-ease-bounce), border-color 0.25s ease, box-shadow 0.28s ease !important;
}
.gb-deck-action::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: var(--gb-cta-grad);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--gb-ease-spring);
}
.gb-deck-action i {
  font-size: 1rem;
  color: var(--primary-color);
  transition: transform 0.32s var(--gb-ease-bounce);
}
.gb-deck-action:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 14px 26px -8px rgba(37, 99, 235, 0.34);
}
.gb-deck-action:hover::after { transform: scaleX(1); }
.gb-deck-action:hover i { transform: scale(1.18) rotate(-8deg); }

@media (max-width: 960px) {
  #gb-hero-deck {
    grid-template-columns: 1fr;
    padding: 22px 18px;
    gap: 18px;
  }
  .gb-orbit-wrap { height: 96px; }
  .gb-orbit-ring-1 { width: 92px; height: 92px; }
  .gb-orbit-ring-2 { width: 70px; height: 70px; }
  .gb-orbit-ring-3 { width: 52px; height: 52px; }
  .gb-orbit-core { width: 42px; height: 42px; }
}
@media (max-width: 480px) {
  .gb-quick-deck { grid-template-columns: 1fr; }
  .gb-deck-action { flex-direction: row; align-items: center; gap: 10px; }
}

/* ==========================================================================
   Search Dock, Filter Controls, Tabs, Skeleton Wave & Community Banner
   ========================================================================== */
.search-container { margin-bottom: 16px !important; }
.search-input-wrapper {
  background: var(--gb-glass-strong) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1.5px solid var(--card-border) !important;
  border-radius: 18px !important;
  box-shadow: 0 8px 26px -10px rgba(15, 23, 42, 0.08) !important;
  transition: transform 0.3s var(--gb-ease-spring), box-shadow 0.3s ease, border-color 0.25s ease !important;
}
.search-input-wrapper:focus-within {
  transform: translateY(-3px);
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.16), 0 18px 36px -10px rgba(37, 99, 235, 0.24) !important;
}
.search-input-wrapper:focus-within .search-icon {
  color: var(--primary-color) !important;
  transform: scale(1.12);
  transition: transform 0.25s var(--gb-ease-bounce), color 0.25s ease;
}
#search-input {
  color: var(--text-primary) !important;
  font-weight: 500;
  border-radius: 18px !important;
}
.search-suggestions {
  background: var(--gb-glass-strong) !important;
  border: 1px solid var(--card-border) !important;
  border-radius: 16px !important;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  animation: gbDropdownIn 0.24s var(--gb-ease-spring);
}

.batch-filter {
  display: inline-flex !important;
  flex-wrap: wrap;
  gap: 8px !important;
  padding: 6px !important;
  margin-bottom: 24px !important;
  border-radius: 16px !important;
  background: var(--gb-surface-subtle) !important;
  border: 1px solid var(--card-border) !important;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
}
.filter-btn, .tab-btn, .quick-nav-btn, .load-more-btn, .back-link, .view-all-btn, .community-banner-btn {
  position: relative;
  overflow: hidden;
  border-radius: 12px !important;
  white-space: nowrap;
  transition: transform 0.3s var(--gb-ease-bounce), box-shadow 0.28s ease, background 0.25s ease, border-color 0.25s ease, color 0.22s ease !important;
}
.filter-btn {
  background: transparent !important;
  color: var(--text-secondary) !important;
  border: 1px solid transparent !important;
  padding: 9px 18px !important;
  font-weight: 600 !important;
}
.filter-btn:hover, .tab-btn:hover, .quick-nav-btn:hover, .load-more-btn:hover, .back-link:hover, .view-all-btn:hover {
  transform: translateY(-2px);
}
.filter-btn:active, .tab-btn:active, .quick-nav-btn:active, .load-more-btn:active, .back-link:active, .community-banner-btn:active {
  transform: scale(0.95) !important;
}
.filter-btn.active, .tab-btn.active {
  background: var(--gb-cta-grad) !important;
  background-size: 180% auto !important;
  color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 10px 24px -6px rgba(37, 99, 235, 0.48) !important;
  animation: gbTabPop 0.34s var(--gb-ease-bounce), gbGradientSlide 5s linear infinite;
}

.tabs-nav, .tabs, .content-tabs, .batch-tabs, .batch-tabs-container {
  background: var(--gb-surface-subtle) !important;
  border: 1px solid var(--card-border) !important;
  border-radius: 18px !important;
  padding: 6px !important;
  gap: 6px !important;
}
.tab-btn { color: var(--text-secondary) !important; border-radius: 12px !important; }
.back-link {
  background: var(--gb-glass-strong) !important;
  border: 1px solid var(--card-border) !important;
  color: var(--text-primary) !important;
  padding: 9px 16px !important;
}
.back-link:hover {
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
  box-shadow: 0 10px 22px -8px rgba(37, 99, 235, 0.24) !important;
}
.back-link i { transition: transform 0.25s var(--gb-ease-spring); }
.back-link:hover i { transform: translateX(-4px); }

.load-more-btn {
  background: var(--gb-cta-grad) !important;
  background-size: 200% auto !important;
  color: #ffffff !important;
  border-radius: 14px !important;
  padding: 13px 34px !important;
  font-weight: 700 !important;
  box-shadow: 0 12px 26px -6px rgba(37, 99, 235, 0.44) !important;
  animation: gbGradientSlide 4.5s linear infinite;
}
.community-banner-btn {
  background: var(--gb-cta-grad) !important;
  background-size: 220% auto !important;
  border: none !important;
  border-radius: 16px !important;
  color: #ffffff !important;
  animation: gbGradientSlide 4.5s linear infinite;
  box-shadow: 0 12px 28px -8px rgba(37, 99, 235, 0.44) !important;
}
.community-banner-btn:hover {
  transform: translateY(-3px) scale(1.015) !important;
  box-shadow: 0 20px 38px -8px rgba(37, 99, 235, 0.56) !important;
}

.page-header-bar {
  animation: gbTextSlideUp 0.45s var(--gb-ease-spring) both;
}

/* Cobalt Skeleton Shimmer */
.skeleton-bg, .skeleton-text {
  background: linear-gradient(100deg, var(--skeleton-bg) 25%, var(--skeleton-shine) 50%, var(--skeleton-bg) 75%) !important;
  background-size: 200% 100% !important;
  animation: gbSkeletonWave 1.4s ease-in-out infinite !important;
}

/* ==========================================================================
   Redesigned Cards + Prismatic Edge Glow + Sheen + 3D Magnetic Tilt
   ========================================================================== */
.batches-container {
  gap: 22px !important;
  padding: 4px 0 !important;
}
.batch-card, .subject-card, .topic-card, .lecture-card, .note-card,
.dpp-card, .quiz-card, .dpp-quiz-card, .schedule-card, .schedule-item,
.test-card, .announcement-card, .khazana-chapter-card, .original-lecture-card,
.original-note-card, .original-dpp-card, .khazana-note-card, .batch-header {
  background: var(--card-bg) !important;
  border: 1px solid var(--card-border) !important;
  border-left: 1px solid var(--card-border) !important;
  border-radius: 22px !important;
  box-shadow: var(--card-shadow) !important;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.36s var(--gb-ease-spring), box-shadow 0.36s var(--gb-ease-spring), border-color 0.28s ease !important;
}
.batch-card { margin: 0 !important; }

/* Prismatic Top/Border Glow Bar that illuminates on Hover */
.batch-card::before, .subject-card::before, .topic-card::before, .lecture-card::before,
.note-card::before, .dpp-card::before, .quiz-card::before, .dpp-quiz-card::before,
.test-card::before, .khazana-chapter-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2563eb, #0ea5e9, #10b981, #6366f1);
  background-size: 200% 100%;
  opacity: 0;
  transform: scaleX(0.35);
  transition: opacity 0.32s ease, transform 0.4s var(--gb-ease-spring);
  z-index: 4;
  pointer-events: none;
}
.batch-card:hover::before, .subject-card:hover::before, .topic-card:hover::before,
.lecture-card:hover::before, .note-card:hover::before, .dpp-card:hover::before,
.quiz-card:hover::before, .dpp-quiz-card:hover::before, .test-card:hover::before,
.khazana-chapter-card:hover::before {
  opacity: 1;
  transform: scaleX(1);
  animation: gbGradientSlide 3s linear infinite;
}

/* Diagonal Holographic Glass Sheen Sweep on Card Hover */
.batch-card::after, .subject-card::after, .topic-card::after, .lecture-card::after,
.note-card::after, .dpp-card::after, .quiz-card::after, .dpp-quiz-card::after,
.test-card::after, .khazana-chapter-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 65%;
  height: 100%;
  background: linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.25) 50%, transparent 80%);
  transform: skewX(-18deg);
  pointer-events: none;
  transition: transform 0.72s var(--gb-ease-spring);
  z-index: 3;
}
body.dark-mode .batch-card::after, body.dark-mode .subject-card::after,
body.dark-mode .topic-card::after, body.dark-mode .lecture-card::after,
body.dark-mode .note-card::after, body.dark-mode .dpp-card::after {
  background: linear-gradient(105deg, transparent 20%, rgba(56, 189, 248, 0.16) 50%, transparent 80%);
}
.batch-card:hover::after, .subject-card:hover::after, .topic-card:hover::after,
.lecture-card:hover::after, .note-card:hover::after, .dpp-card:hover::after,
.quiz-card:hover::after, .dpp-quiz-card:hover::after, .test-card:hover::after,
.khazana-chapter-card:hover::after {
  transform: translateX(340%) skewX(-18deg);
}

.gb-pre-anim {
  opacity: 0.01;
  transform: translateY(24px) scale(0.96);
}
.gb-anim-in {
  animation: gbCardCascade 0.58s var(--gb-ease-spring) var(--gb-d, 0ms) both;
}

@media (hover: hover) and (pointer: fine) {
  .batch-card:hover, .subject-card:hover, .topic-card:hover, .lecture-card:hover,
  .note-card:hover, .dpp-card:hover, .quiz-card:hover, .dpp-quiz-card:hover,
  .schedule-item:hover, .test-card:hover, .announcement-card:hover,
  .khazana-chapter-card:hover, .original-lecture-card:hover, .original-note-card:hover,
  .original-dpp-card:hover, .khazana-note-card:hover {
    transform: perspective(1000px) rotateX(var(--gb-rx, 0deg)) rotateY(var(--gb-ry, 0deg)) translateY(-9px) scale(1.018) !important;
    border-color: rgba(37, 99, 235, 0.46) !important;
    box-shadow: var(--card-shadow-hover) !important;
    background-image: radial-gradient(circle 300px at var(--gb-mx, 50%) var(--gb-my, 50%), rgba(37, 99, 235, 0.09), transparent 72%) !important;
  }
  body.dark-mode .batch-card:hover, body.dark-mode .subject-card:hover,
  body.dark-mode .topic-card:hover, body.dark-mode .lecture-card:hover,
  body.dark-mode .note-card:hover, body.dark-mode .dpp-card:hover,
  body.dark-mode .quiz-card:hover, body.dark-mode .dpp-quiz-card:hover,
  body.dark-mode .schedule-item:hover, body.dark-mode .test-card:hover {
    border-color: rgba(56, 189, 248, 0.56) !important;
    background-image: radial-gradient(circle 300px at var(--gb-mx, 50%) var(--gb-my, 50%), rgba(56, 189, 248, 0.13), transparent 72%) !important;
  }
}

/* Internal Micro-Motion Inside Cards */
.batch-card .batch-title, .subject-card .subject-title, .topic-card .topic-title, .lecture-card .lecture-title {
  transition: color 0.25s ease, transform 0.3s var(--gb-ease-spring);
}
.batch-card:hover .batch-title, .subject-card:hover .subject-title,
.topic-card:hover .topic-title, .lecture-card:hover .lecture-title {
  color: var(--primary-color) !important;
  transform: translateX(3px);
}
.batch-link i, .view-all-btn i { transition: transform 0.28s var(--gb-ease-spring); }
.batch-card:hover .batch-link i, .view-all-btn:hover i { transform: translateX(4px); }
.favorite-btn { transition: transform 0.28s var(--gb-ease-bounce), color 0.2s ease !important; }
.favorite-btn:hover { transform: scale(1.22) !important; }
.favorite-btn.active i { animation: gbHeartBeat 0.6s ease; }

/* Smooth Thumbnail Image Zoom (preserves blur-up on .loading images) */
.batch-card .batch-image, .subject-card .subject-icon-container, .lecture-card .lecture-image {
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}
.batch-card img:not(.loading), .subject-card img:not(.loading), .lecture-card img:not(.loading) {
  transition: transform 0.62s var(--gb-ease-spring), filter 0.42s ease !important;
}
.batch-card:hover img:not(.loading), .subject-card:hover img:not(.loading), .lecture-card:hover img:not(.loading) {
  transform: scale(1.08) !important;
  filter: saturate(1.1) contrast(1.03);
}

.batch-tag, .schedule-tag {
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: transform 0.25s var(--gb-ease-bounce) !important;
}
.schedule-status.live {
  background: rgba(220, 38, 38, 0.12) !important;
  color: #dc2626 !important;
  border: 1px solid rgba(220, 38, 38, 0.28) !important;
  animation: gbLivePulse 1.8s ease-in-out infinite;
}
body.dark-mode .schedule-status.live {
  background: rgba(248, 113, 113, 0.16) !important;
  color: #fca5a5 !important;
}

.breadcrumb-nav {
  background: var(--gb-glass-bg) !important;
  border: 1px solid var(--card-border) !important;
  border-radius: 14px !important;
  backdrop-filter: blur(12px);
}

.gb-ripple-dot {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6), rgba(56, 189, 248, 0.18));
  pointer-events: none;
  animation: gbRippleAnim 0.56s var(--gb-ease-spring) forwards;
  z-index: 5;
}

.gb-view-enter { animation: gbViewEnter 0.45s var(--gb-ease-spring) both; }
.tab-pane.active { animation: gbViewEnter 0.36s var(--gb-ease-spring) both; }

/* Community Popup & Profile Modal Restyled */
#srOverlay {
  backdrop-filter: blur(14px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(160%) !important;
  background: rgba(6, 10, 20, 0.6) !important;
}
#srPopup, .profile-modal-content {
  background: var(--gb-glass-strong) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--card-border) !important;
  border-radius: 26px !important;
  box-shadow: 0 32px 72px rgba(0, 0, 0, 0.34), 0 0 0 1px rgba(255, 255, 255, 0.08) inset !important;
  animation: gbPopupSpring 0.48s var(--gb-ease-bounce) both !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
}
#srTitle { color: var(--text-primary) !important; }
#srSub { color: var(--text-secondary) !important; }
#srClose {
  background: var(--gb-surface-subtle) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--card-border) !important;
}
#srBtn {
  background: var(--gb-cta-grad) !important;
  color: #ffffff !important;
  border-radius: 14px !important;
  box-shadow: 0 12px 26px -6px rgba(37, 99, 235, 0.46) !important;
  transition: transform 0.28s var(--gb-ease-bounce), box-shadow 0.28s ease !important;
}
#srBtn:hover {
  transform: translateY(-2px) scale(1.03) !important;
  box-shadow: 0 18px 36px -6px rgba(37, 99, 235, 0.6) !important;
}

/* Redesigned Footer */
.app-footer {
  background: var(--gb-glass-bg) !important;
  backdrop-filter: blur(14px);
  border-top: 1px solid var(--card-border) !important;
  color: var(--text-secondary) !important;
  padding: 20px 0 !important;
}
.gb-footer-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.gb-footer-links { display: flex; align-items: center; gap: 18px; }
.gb-footer-links a {
  color: var(--text-secondary) !important;
  font-weight: 600;
  font-size: 0.86rem;
  transition: color 0.2s ease, transform 0.2s ease;
}
.gb-footer-links a:hover { color: var(--primary-color) !important; transform: translateY(-1px); }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.32); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(37, 99, 235, 0.6); }

/* Keyframes */
@keyframes gbCardCascade {
  from { opacity: 0.01; transform: translateY(28px) scale(0.95); filter: blur(5px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes gbViewEnter {
  from { opacity: 0.01; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes gbTextSlideUp {
  from { opacity: 0.01; transform: translateY(16px); filter: blur(3px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes gbThemeCrossfade {
  0% { opacity: 0.78; transform: scale(0.996); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes gbGradientSlide {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes gbBtnSweep {
  0%, 45% { transform: translateX(0) skewX(-20deg); }
  75%, 100% { transform: translateX(460%) skewX(-20deg); }
}
@keyframes gbHeroShimmer {
  0%, 55% { transform: translateX(0) skewX(-18deg); }
  85%, 100% { transform: translateX(480%) skewX(-18deg); }
}
@keyframes gbHaloBreathe {
  0%, 100% { transform: scale(0.95); opacity: 0.72; }
  50% { transform: scale(1.16); opacity: 1; }
}
@keyframes gbSkeletonWave {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes gbTabPop {
  0% { transform: scale(0.93); }
  60% { transform: scale(1.04); }
  100% { transform: scale(1); }
}
@keyframes gbSpinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes gbSpinReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
@keyframes gbFloatBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}
@keyframes gbHeartBeat {
  0%, 100% { transform: scale(1); }
  30% { transform: scale(1.3); }
  55% { transform: scale(0.92); }
  75% { transform: scale(1.18); }
}
@keyframes gbRippleAnim {
  to { transform: translate(-50%, -50%) scale(16); opacity: 0; }
}
@keyframes gbDropdownIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes gbPopupSpring {
  from { opacity: 0; transform: translateY(26px) scale(0.88); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes gbLivePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.42); }
  50% { box-shadow: 0 0 0 7px rgba(220, 38, 38, 0); }
}
@keyframes gbOrbDrift1 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(110px, 75px, 0) scale(1.18); }
}
@keyframes gbOrbDrift2 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(-100px, -65px, 0) scale(1.16); }
}
@keyframes gbOrbDrift3 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(75px, -85px, 0) scale(1.14); }
}
@keyframes gbOrbDrift4 {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(90px, -55px, 0) scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .gb-orb, #gb-particles-canvas, #gb-scroll-progress, #gb-cursor-glow, .gb-orbit-ring, .gb-orbit-halo {
    animation: none !important;
    display: none !important;
  }
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
</style>`;

export const STYLISH_UI_JS = `<script id="gb-stylish-ui-js">(function(){
  if (window.__gbUiLoaded) return;
  window.__gbUiLoaded = true;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function setupChrome() {
    if (!document.body) return;
    if (!document.getElementById('gb-scroll-progress')) {
      var bar = document.createElement('div');
      bar.id = 'gb-scroll-progress';
      document.body.appendChild(bar);
    }
    if (!document.getElementById('gb-aurora-layer')) {
      var aurora = document.createElement('div');
      aurora.id = 'gb-aurora-layer';
      aurora.innerHTML = '<div class="gb-orb gb-orb-1"></div><div class="gb-orb gb-orb-2"></div><div class="gb-orb gb-orb-3"></div><div class="gb-orb gb-orb-4"></div>';
      document.body.insertBefore(aurora, document.body.firstChild);
    }
    if (!reduced && finePointer && !document.getElementById('gb-cursor-glow')) {
      var glow = document.createElement('div');
      glow.id = 'gb-cursor-glow';
      document.body.insertBefore(glow, document.body.firstChild);
      initCursorGlow(glow);
    }
    if (!reduced && !document.getElementById('gb-particles-canvas')) {
      var canvas = document.createElement('canvas');
      canvas.id = 'gb-particles-canvas';
      document.body.insertBefore(canvas, document.body.firstChild);
      initParticles(canvas);
    }
    injectHeaderNav();
    upgradeFooter();
    ensureHeroDeck();
    bindThemeCrossfade();
  }

  function initCursorGlow(glow) {
    var tx = -999, ty = -999, cx = -999, cy = -999, active = false, raf = null;
    function step() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glow.style.transform = 'translate3d(' + (cx - 220).toFixed(1) + 'px,' + (cy - 220).toFixed(1) + 'px,0)';
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        raf = requestAnimationFrame(step);
      } else {
        raf = null;
      }
    }
    window.addEventListener('mousemove', function(e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) { active = true; glow.style.opacity = '1'; }
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });
    document.addEventListener('mouseleave', function() {
      active = false;
      glow.style.opacity = '0';
    }, { passive: true });
  }

  function bindThemeCrossfade() {
    var tt = document.getElementById('theme-toggle');
    if (!tt || tt.dataset.gbFadeBound) return;
    tt.dataset.gbFadeBound = '1';
    tt.addEventListener('click', function() {
      if (!document.body || reduced) return;
      document.body.classList.remove('gb-theme-fade');
      void document.body.offsetWidth;
      document.body.classList.add('gb-theme-fade');
    });
  }

  function syncNavActive() {
    var nav = document.getElementById('gb-header-nav');
    if (!nav) return;
    var hash = (window.location.hash || '#batches').toLowerCase();
    var links = nav.querySelectorAll('.gb-nav-link');
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').toLowerCase();
      if (href.indexOf('#') === 0) {
        var isMatch = (href === '#favorites' && hash.indexOf('#favorites') === 0) ||
                      (href === '#batches' && hash.indexOf('#favorites') !== 0);
        links[i].classList.toggle('active', isMatch);
      }
    }
  }

  function injectHeaderNav() {
    var headerContent = document.querySelector('.app-header .header-content');
    var actions = document.querySelector('.app-header .header-actions');
    if (!headerContent || !actions || document.getElementById('gb-header-nav')) return;
    var nav = document.createElement('nav');
    nav.id = 'gb-header-nav';
    nav.className = 'gb-nav-links';
    nav.setAttribute('aria-label', 'Primary');
    nav.innerHTML =
      '<a href="#batches" class="gb-nav-link active">Batches</a>' +
      '<a href="#favorites" class="gb-nav-link">Favorites</a>' +
      '<a href="https://t.me/GBFreestudy" target="_blank" rel="noopener" class="gb-nav-link">Community</a>';
    headerContent.insertBefore(nav, actions);
    window.addEventListener('hashchange', syncNavActive);
    syncNavActive();
  }

  function upgradeFooter() {
    var footerContainer = document.querySelector('.app-footer .container');
    if (!footerContainer || footerContainer.dataset.gbUpgraded) return;
    footerContainer.dataset.gbUpgraded = '1';
    footerContainer.innerHTML =
      '<div class="gb-footer-row">' +
      '<span>&copy; 2022–2026 GB STUDY Learning Studio. All Rights Reserved.</span>' +
      '<div class="gb-footer-links">' +
      '<a href="#batches">All Batches</a>' +
      '<a href="#favorites">Favorites</a>' +
      '<a href="https://t.me/GBFreestudy" target="_blank" rel="noopener">Telegram</a>' +
      '</div></div>';
  }

  function ensureHeroDeck() {
    var batchesPage = document.querySelector('#app-view .batches-page');
    if (!batchesPage || document.getElementById('gb-hero-deck')) return;
    var hero = document.createElement('section');
    hero.id = 'gb-hero-deck';
    hero.setAttribute('aria-label', 'Study Workspace Overview');
    hero.innerHTML =
      '<div class="gb-hero-left">' +
        '<span class="gb-hero-eyebrow">GB Study Learning Studio</span>' +
        '<h1 class="gb-hero-title">Master Every Subject in a <span>Focused Study Workspace</span></h1>' +
        '<p class="gb-hero-sub">Stream live and recorded classes, review lecture slides, practice daily DPPs, and organize your batches in one fast, distraction-free interface.</p>' +
        '<div class="gb-hero-ctas">' +
          '<button type="button" class="gb-btn-primary" id="gb-explore-btn"><i class="fa-solid fa-compass"></i> Explore Batches</button>' +
          '<a href="https://t.me/GBFreestudy" target="_blank" rel="noopener" class="gb-btn-secondary"><i class="fa-brands fa-telegram"></i> Join Community</a>' +
        '</div>' +
      '</div>' +
      '<div class="gb-hero-right">' +
        '<div class="gb-orbit-wrap">' +
          '<div class="gb-orbit-halo"></div>' +
          '<div class="gb-orbit-ring gb-orbit-ring-1"><span class="gb-orbit-sat"></span></div>' +
          '<div class="gb-orbit-ring gb-orbit-ring-2"><span class="gb-orbit-sat"></span></div>' +
          '<div class="gb-orbit-ring gb-orbit-ring-3"></div>' +
          '<div class="gb-orbit-core"><img src="/gb-icon.png" alt="GB STUDY"></div>' +
        '</div>' +
        '<div class="gb-quick-deck">' +
          '<a href="#favorites" class="gb-deck-action"><i class="fa-solid fa-heart"></i><span>Saved Batches</span></a>' +
          '<button type="button" class="gb-deck-action" id="gb-deck-search"><i class="fa-solid fa-magnifying-glass"></i><span>Quick Search</span></button>' +
          '<button type="button" class="gb-deck-action" id="gb-deck-theme"><i class="fa-solid fa-circle-half-stroke"></i><span>Switch Theme</span></button>' +
        '</div>' +
      '</div>';

    batchesPage.insertBefore(hero, batchesPage.firstChild);

    if (!reduced && finePointer) {
      var orbit = hero.querySelector('.gb-orbit-wrap');
      hero.addEventListener('mousemove', function(e) {
        var r = hero.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        hero.style.setProperty('--gb-hx', (px * 100).toFixed(1) + '%');
        hero.style.setProperty('--gb-hy', (py * 100).toFixed(1) + '%');
        if (orbit) {
          orbit.style.transform = 'translate3d(' + ((px - 0.5) * 14).toFixed(1) + 'px,' + ((py - 0.5) * 10).toFixed(1) + 'px,0)';
        }
      }, { passive: true });
      hero.addEventListener('mouseleave', function() {
        if (orbit) orbit.style.transform = '';
      }, { passive: true });
    }

    var exploreBtn = document.getElementById('gb-explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function() {
        var grid = document.getElementById('batches-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    var deckSearch = document.getElementById('gb-deck-search');
    if (deckSearch) {
      deckSearch.addEventListener('click', function() {
        var inp = document.getElementById('search-input');
        if (inp) {
          inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function() { inp.focus(); }, 220);
        }
      });
    }
    var deckTheme = document.getElementById('gb-deck-theme');
    if (deckTheme) {
      deckTheme.addEventListener('click', function() {
        var tt = document.getElementById('theme-toggle');
        if (tt) tt.click();
      });
    }
  }

  function initParticles(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mouse = { x: -9999, y: -9999 };
    var count = window.innerWidth < 640 ? 22 : 42;
    var pts = [];
    var meteor = null;
    var frame = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

    for (var i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: 1.4 + Math.random() * 2.3,
        a: 0.2 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        tone: i % 3
      });
    }

    var rafId = null;
    function tick() {
      if (document.hidden) { rafId = null; return; }
      frame++;
      ctx.clearRect(0, 0, w, h);
      var dark = document.body.classList.contains('dark-mode') || document.documentElement.classList.contains('dark-mode');
      var palette = dark
        ? ['56, 189, 248', '129, 140, 248', '52, 211, 153']
        : ['37, 99, 235', '14, 165, 233', '16, 185, 129'];

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        var twinkle = 0.72 + 0.28 * Math.sin(frame * 0.03 + p.phase);
        var cStr = palette[p.tone];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + cStr + ',' + (p.a * twinkle).toFixed(3) + ')';
        ctx.fill();

        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(' + palette[0] + ',' + (0.095 * (1 - dist / 120)).toFixed(3) + ')';
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        var mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 165) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(' + palette[1] + ',' + (0.26 * (1 - md / 165)).toFixed(3) + ')';
          ctx.lineWidth = 1.15;
          ctx.stroke();
        }
      }

      if (!meteor && frame % 260 === 120 && w > 500) {
        meteor = {
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.35,
          vx: 7.5,
          vy: 3.2,
          life: 1
        };
      }
      if (meteor) {
        var grad = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * 14, meteor.y - meteor.vy * 14);
        grad.addColorStop(0, 'rgba(' + palette[0] + ',' + (0.55 * meteor.life).toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(' + palette[0] + ',0)');
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.vx * 14, meteor.y - meteor.vy * 14);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= 0.028;
        if (meteor.life <= 0) meteor = null;
      }

      rafId = requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden && !rafId) rafId = requestAnimationFrame(tick);
    });
    rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (document.body) {
      document.body.classList.toggle('gb-scrolled', y > 16);
    }
    var bar = document.getElementById('gb-scroll-progress');
    if (bar) {
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var ratio = Math.max(0, Math.min(1, y / max));
      bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var CARD_SEL = '.batch-card,.subject-card,.topic-card,.lecture-card,.note-card,.dpp-card,.quiz-card,.dpp-quiz-card,.schedule-card,.schedule-item,.test-card,.announcement-card,.khazana-chapter-card,.original-lecture-card,.original-note-card,.original-dpp-card,.khazana-note-card';
  var animSeq = 0;
  var resetTimer = null;

  function triggerCardAnim(el) {
    if (!el || el.dataset.gbShown) return;
    el.dataset.gbShown = '1';
    el.classList.remove('gb-pre-anim');
    var delay = Math.min(animSeq * 42, 340);
    animSeq++;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(function() { animSeq = 0; }, 160);
    el.style.setProperty('--gb-d', delay + 'ms');
    el.classList.add('gb-anim-in');
  }

  var io = (!reduced && typeof IntersectionObserver === 'function')
    ? new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            triggerCardAnim(entries[i].target);
            io.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.04, rootMargin: '60px 0px' })
    : null;

  function revealCard(el) {
    if (!el || el.dataset.gbAnim) return;
    el.dataset.gbAnim = '1';
    if (io) {
      var rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      if (rect && rect.top < (window.innerHeight || 900) + 40) {
        triggerCardAnim(el);
      } else {
        el.classList.add('gb-pre-anim');
        io.observe(el);
      }
    } else {
      triggerCardAnim(el);
    }
  }

  function scanCards(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.matches && root.matches(CARD_SEL)) revealCard(root);
    var list = root.querySelectorAll(CARD_SEL);
    for (var i = 0; i < list.length; i++) revealCard(list[i]);
  }

  function initObservers() {
    scanCards(document.body);
    ensureHeroDeck();
    syncNavActive();
    var appView = document.getElementById('app-view');
    var mo = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.target && m.target.id === 'app-view' && m.addedNodes.length > 0) {
          appView.classList.remove('gb-view-enter');
          void appView.offsetWidth;
          appView.classList.add('gb-view-enter');
          ensureHeroDeck();
          syncNavActive();
        }
        for (var j = 0; j < m.addedNodes.length; j++) {
          var n = m.addedNodes[j];
          if (n && n.nodeType === 1) {
            if (n.classList && n.classList.contains('batches-page')) ensureHeroDeck();
            scanCards(n);
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // 3D Magnetic Perspective Tilt & Cursor Spotlight on Desktop Hover
  if (!reduced && finePointer) {
    var activeCard = null;
    document.addEventListener('mousemove', function(e) {
      var card = e.target && e.target.closest ? e.target.closest(CARD_SEL) : null;
      if (activeCard && activeCard !== card) {
        activeCard.style.removeProperty('--gb-rx');
        activeCard.style.removeProperty('--gb-ry');
        activeCard = null;
      }
      if (!card || card.classList.contains('schedule-card')) return;
      activeCard = card;
      var rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty('--gb-mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gb-my', (py * 100).toFixed(1) + '%');
      card.style.setProperty('--gb-rx', ((0.5 - py) * 6).toFixed(2) + 'deg');
      card.style.setProperty('--gb-ry', ((px - 0.5) * 6).toFixed(2) + 'deg');
    }, { passive: true });
    document.addEventListener('mouseleave', function() {
      if (activeCard) {
        activeCard.style.removeProperty('--gb-rx');
        activeCard.style.removeProperty('--gb-ry');
        activeCard = null;
      }
    }, { passive: true });
  }

  // Material Liquid Ripple on Interactive Controls
  if (!reduced) {
    var BTN_SEL = '.filter-btn,.tab-btn,.quick-nav-btn,.load-more-btn,.back-link,.community-banner-btn,.icon-btn,.view-all-btn,.gb-btn-primary,.gb-btn-secondary,.gb-deck-action';
    document.addEventListener('pointerdown', function(e) {
      var btn = e.target && e.target.closest ? e.target.closest(BTN_SEL) : null;
      if (!btn) return;
      var rect = btn.getBoundingClientRect();
      var dot = document.createElement('span');
      dot.className = 'gb-ripple-dot';
      var size = Math.max(rect.width, rect.height) * 0.26;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = (e.clientX - rect.left) + 'px';
      dot.style.top = (e.clientY - rect.top) + 'px';
      btn.appendChild(dot);
      setTimeout(function() { if (dot.parentNode) dot.parentNode.removeChild(dot); }, 580);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setupChrome(); initObservers(); onScroll(); });
  } else {
    setupChrome(); initObservers(); onScroll();
  }
})();</script>`;

export function injectStylishUi(html: string): string {
  let out = html;
  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `${STYLISH_UI_FONTS}${STYLISH_UI_CSS}</head>`);
  } else {
    out = `${STYLISH_UI_FONTS}${STYLISH_UI_CSS}${out}`;
  }
  if (/<\/body>/i.test(out)) {
    out = out.replace(/<\/body>/i, `${STYLISH_UI_JS}</body>`);
  } else {
    out = `${out}${STYLISH_UI_JS}`;
  }
  return out;
}
