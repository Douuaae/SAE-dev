import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #07090d;
  --s1:       #0d1017;
  --s2:       #131720;
  --s3:       #1a2030;
  --border:   #1e2535;
  --border2:  #252e42;
  --accent:   #00f0a0;
  --accent2:  #0090ff;
  --warn:     #ffb830;
  --danger:   #ff3355;
  --purple:   #a855f7;
  --text:     #dde3f0;
  --muted:    #4a5570;
  --muted2:   #6a7590;
  --font-display: 'Syne', sans-serif;
  --font-mono:    'Space Mono', monospace;
}

html, body, #root { height: 100%; }
body { background: var(--bg); color: var(--text); font-family: var(--font-display); font-size: 14px; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

/* ── SHELL ─────────────────────────────────────────────── */
.shell { display: flex; height: 100vh; overflow: hidden; }

/* ── SIDEBAR ───────────────────────────────────────────── */
.sidebar {
  width: 230px; flex-shrink: 0;
  background: var(--s1);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
}
.sidebar-brand {
  padding: 22px 20px 18px;
  border-bottom: 1px solid var(--border);
}
.brand-eyebrow {
  display: flex; align-items: center; gap: 7px;
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--accent); margin-bottom: 6px;
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 10px var(--accent);
  animation: livepulse 2s ease-in-out infinite;
}
@keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
.brand-name { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #fff; }
.brand-sub { font-size: 11px; color: var(--muted2); margin-top: 2px; }

.nav { flex: 1; padding: 14px 12px; overflow-y: auto; }
.nav-section { font-family: var(--font-mono); font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted); padding: 0 8px; margin: 18px 0 6px; }
.nav-section:first-child { margin-top: 4px; }
.nav-btn {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 10px; border-radius: 8px;
  background: none; border: none; cursor: pointer;
  font-family: var(--font-display); font-size: 13px; font-weight: 600;
  color: var(--muted2); text-align: left;
  transition: background .15s, color .15s;
  margin-bottom: 1px; position: relative;
}
.nav-btn:hover { background: var(--s2); color: var(--text); }
.nav-btn.active { background: rgba(0,240,160,.08); color: var(--accent); }
.nav-btn.active::before {
  content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
  width: 3px; background: var(--accent); border-radius: 0 3px 3px 0;
  box-shadow: 0 0 8px var(--accent);
}
.nav-ico { font-size: 16px; width: 20px; text-align: center; }
.nav-badge {
  margin-left: auto; background: var(--danger); color: #fff;
  font-family: var(--font-mono); font-size: 9px; font-weight: 700;
  padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center;
}
.nav-badge.orange { background: var(--warn); color: #000; }

.sidebar-footer {
  padding: 12px 20px; border-top: 1px solid var(--border);
  font-size: 11px; color: var(--muted);
}
.sidebar-footer strong { color: var(--accent); font-family: var(--font-mono); }

/* ── MAIN ──────────────────────────────────────────────── */
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* ── TOPBAR ────────────────────────────────────────────── */
.topbar {
  height: 58px; flex-shrink: 0;
  background: var(--s1); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; gap: 16px;
}
.topbar-left { display: flex; align-items: center; gap: 12px; }
.page-title { font-size: 16px; font-weight: 800; color: #fff; }
.page-sub { font-size: 11px; color: var(--muted2); }
.topbar-right { display: flex; align-items: center; gap: 10px; }
.pill {
  display: flex; align-items: center; gap: 6px;
  background: var(--s2); border: 1px solid var(--border2);
  border-radius: 20px; padding: 5px 12px;
  font-family: var(--font-mono); font-size: 11px; color: var(--text);
}
.pill-dot { width: 6px; height: 6px; border-radius: 50%; }
.pill-dot.g { background: var(--accent); box-shadow: 0 0 6px var(--accent); }
.pill-dot.r { background: var(--danger); box-shadow: 0 0 6px var(--danger); }
.pill-dot.o { background: var(--warn); }
.topbar-clock { font-family: var(--font-mono); font-size: 13px; color: var(--muted2); }

/* ── PAGE CONTENT ──────────────────────────────────────── */
.page { flex: 1; overflow-y: auto; padding: 24px 28px; }

/* ── CARDS ─────────────────────────────────────────────── */
.card {
  background: var(--s1); border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
}
.card-head {
  padding: 14px 20px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted2); }
.card-body { padding: 18px 20px; }

/* ── STAT CARDS ────────────────────────────────────────── */
.stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
.stat-card {
  background: var(--s1); border: 1px solid var(--border);
  border-radius: 12px; padding: 18px 20px; position: relative; overflow: hidden;
}
.stat-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  border-radius: 12px 12px 0 0;
}
.sc-g::after { background: linear-gradient(90deg,var(--accent),transparent); }
.sc-r::after { background: linear-gradient(90deg,var(--danger),transparent); }
.sc-o::after { background: linear-gradient(90deg,var(--warn),transparent); }
.sc-b::after { background: linear-gradient(90deg,var(--accent2),transparent); }
.sc-p::after { background: linear-gradient(90deg,var(--purple),transparent); }
.stat-lbl { font-size: 10px; color: var(--muted2); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
.stat-val { font-family: var(--font-mono); font-size: 30px; font-weight: 700; line-height: 1; }
.stat-val.g { color: var(--accent); }
.stat-val.r { color: var(--danger); }
.stat-val.o { color: var(--warn); }
.stat-val.b { color: var(--accent2); }
.stat-val.p { color: var(--purple); }
.stat-hint { font-size: 11px; color: var(--muted); margin-top: 6px; line-height: 1.4; }

/* ── LAYOUT HELPERS ────────────────────────────────────── */
.row { display: flex; gap: 14px; margin-bottom: 14px; }
.row > * { min-width: 0; }
.flex1 { flex: 1; }
.flex2 { flex: 2; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.mb14 { margin-bottom: 14px; }
.mb20 { margin-bottom: 20px; }
.section-hd {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px;
  text-transform: uppercase; color: var(--muted2);
  margin-bottom: 12px; margin-top: 4px;
}

/* ── ALERT BANNER ──────────────────────────────────────── */
.alert-banner {
  display: flex; align-items: center; gap: 12px;
  border-radius: 10px; padding: 12px 16px; margin-bottom: 16px;
  font-size: 13px;
}
.ab-danger { background: rgba(255,51,85,.07); border: 1px solid rgba(255,51,85,.3); }
.ab-warn   { background: rgba(255,184,48,.07); border: 1px solid rgba(255,184,48,.3); }
.ab-ico { font-size: 18px; }
.ab-txt { flex: 1; line-height: 1.5; }
.ab-txt strong { color: var(--danger); }
.ab-txt.warn strong { color: var(--warn); }

/* ── BUTTONS ───────────────────────────────────────────── */
.btn {
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  padding: 7px 16px; border-radius: 8px; border: none;
  cursor: pointer; transition: opacity .15s, transform .1s; letter-spacing: .5px;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn:hover { opacity: .85; }
.btn:active { transform: scale(.97); }
.btn-accent { background: var(--accent); color: #000; }
.btn-danger { background: var(--danger); color: #fff; }
.btn-warn   { background: var(--warn); color: #000; }
.btn-ghost  { background: var(--s2); color: var(--text); border: 1px solid var(--border2); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
.btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
.btn-sm { padding: 5px 12px; font-size: 10px; }
.btn-lg { padding: 10px 24px; font-size: 12px; }

/* ── LECTEUR CARDS ─────────────────────────────────────── */
.lect-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 16px; }
.lect-card {
  background: var(--s2); border: 1px solid var(--border);
  border-radius: 12px; padding: 16px; transition: border-color .2s;
}
.lect-card:hover { border-color: var(--border2); }
.lect-card.ko  { border-color: rgba(255,51,85,.3); background: rgba(255,51,85,.03); }
.lect-card.wrn { border-color: rgba(255,184,48,.25); background: rgba(255,184,48,.03); }
.lect-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.lect-name { font-size: 13px; font-weight: 700; color: #fff; }
.lect-loc  { font-size: 10px; color: var(--muted2); margin-top: 3px; }
.status-tag {
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  padding: 3px 9px; border-radius: 20px; letter-spacing: 1px;
  white-space: nowrap;
}
.st-up   { background: rgba(0,240,160,.12); color: var(--accent); border: 1px solid rgba(0,240,160,.25); }
.st-ko   { background: rgba(255,51,85,.12);  color: var(--danger); border: 1px solid rgba(255,51,85,.25); }
.st-warn { background: rgba(255,184,48,.12); color: var(--warn);   border: 1px solid rgba(255,184,48,.25); }

.now-label { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
.now-track { font-size: 12px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
.type-chip {
  font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  padding: 2px 6px; border-radius: 4px; white-space: nowrap; flex-shrink: 0;
}
.tc-music  { background: rgba(0,144,255,.2); color: var(--accent2); }
.tc-pub    { background: rgba(255,184,48,.2); color: var(--warn); }
.tc-urgent { background: rgba(255,51,85,.2);  color: var(--danger); animation: blink 1s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.sync-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
.sync-label { font-size: 10px; color: var(--muted); flex-shrink: 0; }
.sync-track { flex: 1; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
.sync-fill { height: 100%; border-radius: 2px; transition: width 1.5s; }
.sf-ok  { background: var(--accent); }
.sf-wrn { background: var(--warn); }
.sf-ko  { background: var(--danger); }
.sync-pct { font-family: var(--font-mono); font-size: 10px; }

.lect-meta { display: flex; gap: 12px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.lm-item { font-size: 10px; color: var(--muted); }
.lm-item span { color: var(--text); font-weight: 600; }

/* uptime strip */
.uptime-strip { display: flex; gap: 2px; margin-top: 8px; }
.us-seg { flex: 1; height: 16px; border-radius: 2px; cursor: default; transition: opacity .15s; }
.us-seg:hover { opacity: .8; }

/* wave anim */
.wave { display: flex; align-items: center; gap: 2px; }
.wb { width: 3px; background: var(--accent); border-radius: 2px; animation: wav .7s ease-in-out infinite alternate; }
.wb:nth-child(2){animation-delay:.1s} .wb:nth-child(3){animation-delay:.2s}
.wb:nth-child(4){animation-delay:.3s} .wb:nth-child(5){animation-delay:.15s}
@keyframes wav { from{height:3px} to{height:13px} }
.wave.off .wb { animation: none; height: 3px; background: var(--muted); }

/* ── TABLE ─────────────────────────────────────────────── */
.tbl { width: 100%; border-collapse: collapse; }
.tbl th {
  font-family: var(--font-mono); font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--muted); padding: 0 10px 10px; text-align: left;
  border-bottom: 1px solid var(--border);
}
.tbl td { padding: 10px 10px; font-size: 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.tbl tr:last-child td { border-bottom: none; }
.tbl tr.playing td { color: var(--accent); }
.tbl tr:hover td { background: var(--s2); }
.tbl tr.playing td { background: rgba(0,240,160,.04); }
.play-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 7px var(--accent); display: inline-block; margin-right: 6px; }
.mono-sm { font-family: var(--font-mono); font-size: 11px; color: var(--muted2); }

/* ── LOG LIST ──────────────────────────────────────────── */
.log-list { list-style: none; }
.log-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.log-item:last-child { border-bottom: none; }
.log-t { font-family: var(--font-mono); font-size: 10px; color: var(--muted); white-space: nowrap; padding-top: 1px; }
.log-ico { font-size: 15px; padding-top: 1px; }
.log-body { flex: 1; font-size: 12px; line-height: 1.5; }
.log-tag {
  display: inline-block; font-family: var(--font-mono); font-size: 9px; font-weight: 700;
  padding: 1px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-left: 7px; vertical-align: middle;
}
.lt-err  { background: rgba(255,51,85,.15);  color: var(--danger); }
.lt-warn { background: rgba(255,184,48,.15); color: var(--warn); }
.lt-ok   { background: rgba(0,240,160,.12);  color: var(--accent); }
.lt-info { background: rgba(0,144,255,.15);  color: var(--accent2); }

/* filter pills */
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.fpill {
  font-family: var(--font-mono); font-size: 10px; padding: 4px 12px; border-radius: 20px;
  border: 1px solid var(--border2); background: var(--s2); color: var(--muted2);
  cursor: pointer; transition: all .15s;
}
.fpill:hover { border-color: var(--accent2); color: var(--text); }
.fpill.on { border-color: var(--accent); color: var(--accent); background: rgba(0,240,160,.08); }

/* ── ALERT CARDS ───────────────────────────────────────── */
.alert-card {
  border-radius: 10px; padding: 14px 16px; margin-bottom: 10px;
  display: flex; gap: 14px; align-items: flex-start;
  position: relative; overflow: hidden;
}
.alert-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px; border-radius:0; }
.ac-err { background: rgba(255,51,85,.06); border: 1px solid rgba(255,51,85,.2); }
.ac-err::before { background: var(--danger); }
.ac-warn { background: rgba(255,184,48,.06); border: 1px solid rgba(255,184,48,.2); }
.ac-warn::before { background: var(--warn); }
.ac-info { background: rgba(0,144,255,.06); border: 1px solid rgba(0,144,255,.2); }
.ac-info::before { background: var(--accent2); }
.ac-ico { font-size: 20px; margin-top: 1px; }
.ac-body { flex: 1; }
.ac-title { font-size: 13px; font-weight: 700; margin-bottom: 3px; }
.ac-title.err  { color: var(--danger); }
.ac-title.warn { color: var(--warn); }
.ac-title.info { color: var(--accent2); }
.ac-desc { font-size: 12px; color: var(--muted2); line-height: 1.5; }
.ac-meta { font-family: var(--font-mono); font-size: 10px; color: var(--muted); margin-top: 6px; }
.ac-actions { display: flex; gap: 8px; margin-top: 10px; }

/* ── PLAYLIST MANAGEMENT ───────────────────────────────── */
.pl-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 8px; margin-bottom: 4px;
  background: var(--s2); border: 1px solid var(--border);
  transition: border-color .15s; cursor: default;
}
.pl-item:hover { border-color: var(--border2); }
.pl-item.active-track { border-color: rgba(0,240,160,.3); background: rgba(0,240,160,.04); }
.pl-num { font-family: var(--font-mono); font-size: 11px; color: var(--muted); width: 22px; text-align: center; }
.pl-info { flex: 1; min-width: 0; }
.pl-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pl-artist { font-size: 11px; color: var(--muted2); }
.pl-dur { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
.pl-drag { color: var(--muted); cursor: grab; font-size: 14px; padding: 0 4px; }

/* ── URGENT FORM ───────────────────────────────────────── */
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 11px; color: var(--muted2); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 7px; font-family: var(--font-mono); }
.form-input {
  width: 100%; background: var(--s2); border: 1px solid var(--border2);
  border-radius: 8px; padding: 10px 14px; color: var(--text);
  font-family: var(--font-display); font-size: 13px;
  transition: border-color .15s; outline: none;
}
.form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,240,160,.08); }
.form-input::placeholder { color: var(--muted); }
textarea.form-input { resize: vertical; min-height: 80px; line-height: 1.5; }
.form-select { appearance: none; cursor: pointer; }
.checkbox-group { display: flex; flex-direction: column; gap: 8px; }
.checkbox-item { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; }
.checkbox-item input[type=checkbox] { accent-color: var(--accent); width: 16px; height: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* urgent preview */
.urgent-preview {
  background: var(--s2); border: 1px solid rgba(255,51,85,.3);
  border-radius: 10px; padding: 16px; margin-top: 6px;
}
.up-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 2px; color: var(--danger); text-transform: uppercase; margin-bottom: 8px; }
.up-msg { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.4; }

/* ── HISTORY ───────────────────────────────────────────── */
.hist-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 12px; }
.hist-row:last-child { border-bottom: none; }
.hist-time { font-family: var(--font-mono); font-size: 10px; color: var(--muted); white-space: nowrap; }
.hist-title { flex: 1; font-weight: 600; }
.hist-site { font-size: 11px; color: var(--muted2); }
.hist-dur { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }

/* ── MINI BAR CHART ────────────────────────────────────── */
.bar-chart { display: flex; align-items: flex-end; gap: 4px; height: 56px; padding-top: 4px; }
.bc-bar { flex: 1; border-radius: 3px 3px 0 0; min-height: 3px; transition: height .5s; }
.bc-bar.mu { background: rgba(0,240,160,.5); }
.bc-bar.mu.hi { background: var(--accent); }
.bc-bar.pu { background: rgba(255,184,48,.45); }
.bc-bar.ur { background: rgba(255,51,85,.5); }
.bar-labels { display: flex; justify-content: space-between; margin-top: 5px; }
.bar-lbl { font-family: var(--font-mono); font-size: 9px; color: var(--muted); flex: 1; text-align: center; }

/* ── OVERVIEW SPECIFIC ─────────────────────────────────── */
.ov-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; margin-bottom: 14px; }

/* ── TOAST ─────────────────────────────────────────────── */
.toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 8px; }
.toast {
  display: flex; align-items: center; gap: 10px;
  background: var(--s2); border: 1px solid var(--border2);
  border-radius: 10px; padding: 12px 16px; font-size: 13px;
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
  animation: slideIn .3s ease;
}
.toast.success { border-color: rgba(0,240,160,.3); }
.toast.error   { border-color: rgba(255,51,85,.3); }
@keyframes slideIn { from{transform:translateX(30px);opacity:0} to{transform:translateX(0);opacity:1} }

/* ── BADGE ─────────────────────────────────────────────── */
.badge {
  display: inline-block; font-family: var(--font-mono); font-size: 9px; font-weight: 700;
  padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;
}
.badge-up   { background: rgba(0,240,160,.12); color: var(--accent); }
.badge-ko   { background: rgba(255,51,85,.12);  color: var(--danger); }
.badge-warn { background: rgba(255,184,48,.12); color: var(--warn); }
.badge-music  { background: rgba(0,144,255,.15); color: var(--accent2); }
.badge-pub    { background: rgba(255,184,48,.15); color: var(--warn); }
.badge-urgent { background: rgba(255,51,85,.15);  color: var(--danger); }

/* ── PROGRESS CIRCLE (used in sync page) ──────────────── */
.prog-circle { position: relative; width: 56px; height: 56px; flex-shrink: 0; }
.prog-circle svg { transform: rotate(-90deg); }
.prog-circle-lbl { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 11px; font-weight: 700; }

/* ── DIVIDER ───────────────────────────────────────────── */
.div { height: 1px; background: var(--border); margin: 4px 0; }
`;

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const READERS = [
  { id:"R-01", name:"Lecteur Principal", loc:"Site Central — Paris", status:"up",  sync:100, playlist:"Playlist_Juin_v3", track:"Daft Punk — Get Lucky",       type:"music",  uptime:99.8, ip:"192.168.1.10", lastSeen:"maintenant",  port:8001 },
  { id:"R-02", name:"Lecteur Site B",    loc:"Agence — Lyon",         status:"up",  sync:87,  playlist:"Playlist_Juin_v2", track:"Publicité SNCF — 30s",         type:"pub",    uptime:98.2, ip:"10.0.2.15",   lastSeen:"il y a 2 min", port:8002 },
  { id:"R-03", name:"Lecteur Site C",    loc:"Gare — Marseille",      status:"ko",  sync:34,  playlist:"Playlist_Mai_v1",  track:"—",                            type:null,     uptime:72.1, ip:"10.0.3.22",   lastSeen:"il y a 18 min",port:8003 },
];
const PLAYLIST_TRACKS = [
  { id:1, title:"Get Lucky",        artist:"Daft Punk",   dur:"4:07", type:"music",  playing:true  },
  { id:2, title:"Publicité SNCF",   artist:"Régie Pub",   dur:"0:30", type:"pub",    playing:false },
  { id:3, title:"Papaoutai",        artist:"Stromae",     dur:"3:54", type:"music",  playing:false },
  { id:4, title:"Publicité Orange", artist:"Régie Pub",   dur:"0:20", type:"pub",    playing:false },
  { id:5, title:"Bruxelles je t'aime",artist:"Angèle",   dur:"3:21", type:"music",  playing:false },
  { id:6, title:"Blinding Lights",  artist:"The Weeknd",  dur:"3:20", type:"music",  playing:false },
  { id:7, title:"⚠ Message Urgent", artist:"Système",    dur:"0:15", type:"urgent", playing:false },
  { id:8, title:"Publicité Ikea",   artist:"Régie Pub",   dur:"0:25", type:"pub",    playing:false },
];
const LOGS = [
  { time:"09:14:02", ico:"🔴", msg:"Lecteur R-03 hors ligne — absence de signal réseau", tag:"err" },
  { time:"09:12:45", ico:"⚠️", msg:"Playlist obsolète sur R-02 (v2 → v3 disponible)", tag:"warn" },
  { time:"09:10:00", ico:"📢", msg:"Message urgent diffusé sur R-01 et R-02 (durée 15s)", tag:"warn" },
  { time:"09:05:30", ico:"✅", msg:"Synchronisation réussie R-01 (100% — 8 pistes)", tag:"ok" },
  { time:"08:58:17", ico:"🎵", msg:"Nouveau fichier ajouté : Angèle — Bruxelles je t'aime", tag:"info" },
  { time:"08:45:00", ico:"✅", msg:"R-02 reconnecté après coupure réseau (durée 4 min)", tag:"ok" },
  { time:"08:30:12", ico:"⚠️", msg:"Température élevée détectée sur R-01 (CPU 78°C)", tag:"warn" },
  { time:"08:15:00", ico:"🎵", msg:"Playlist Juin v3 publiée et distribuée", tag:"info" },
  { time:"07:59:45", ico:"✅", msg:"Sauvegarde automatique des playlists — OK", tag:"ok" },
  { time:"07:30:00", ico:"🔵", msg:"Démarrage du service de supervision — 3 lecteurs détectés", tag:"info" },
];
const HISTORY = [
  { time:"09:14", title:"Get Lucky",            site:"R-01 Paris",    type:"music",  dur:"4:07" },
  { time:"09:12", title:"Publicité SNCF",       site:"R-01 Paris",    type:"pub",    dur:"0:30" },
  { time:"09:10", title:"Message Urgent",        site:"R-01, R-02",    type:"urgent", dur:"0:15" },
  { time:"09:05", title:"Papaoutai",             site:"R-02 Lyon",     type:"music",  dur:"3:54" },
  { time:"09:00", title:"Publicité Orange",      site:"R-02 Lyon",     type:"pub",    dur:"0:20" },
  { time:"08:55", title:"Blinding Lights",       site:"R-01 Paris",    type:"music",  dur:"3:20" },
  { time:"08:50", title:"Publicité Ikea",        site:"R-01 Paris",    type:"pub",    dur:"0:25" },
  { time:"08:45", title:"Bruxelles je t'aime",   site:"R-02 Lyon",     type:"music",  dur:"3:21" },
  { time:"08:40", title:"Publicité SNCF",        site:"R-01 Paris",    type:"pub",    dur:"0:30" },
  { time:"08:35", title:"Get Lucky",             site:"R-01 Paris",    type:"music",  dur:"4:07" },
];
const ALERTS = [
  { id:1, type:"err",  ico:"🔴", title:"Lecteur R-03 hors ligne", desc:"Le lecteur R-03 (Gare Marseille) ne répond plus depuis 18 minutes. La playlist de secours locale (v1) est potentiellement obsolète.", time:"09:14:02", site:"R-03 — Gare Marseille" },
  { id:2, type:"warn", ico:"⚠️", title:"Playlist non synchronisée", desc:"R-02 utilise la playlist v2 alors que la v3 est disponible depuis 2h. Risque de décalage du planning publicitaire.", time:"09:12:45", site:"R-02 — Agence Lyon" },
  { id:3, type:"warn", ico:"🌡️", title:"Température CPU élevée", desc:"La température du processeur du lecteur R-01 a dépassé 75°C pendant 5 min. Vérifiez la ventilation du boîtier.", time:"08:30:12", site:"R-01 — Site Central" },
  { id:4, type:"info", ico:"🔵", title:"Mise à jour disponible", desc:"Une nouvelle version de l'agent de synchronisation (v2.3.1) est disponible pour tous les lecteurs.", time:"07:00:00", site:"Tous les lecteurs" },
];
const UPTIME30 = Array.from({length:30},(_, i) => i===10||i===11?"ko":i===20?"warn":"ok");
const BAR_DATA = [
  {h:40,t:"mu"},{h:55,t:"mu"},{h:35,t:"mu"},{h:70,t:"mu"},
  {h:60,t:"pu"},{h:80,t:"mu"},{h:90,t:"mu"},{h:75,t:"mu"},
  {h:85,t:"mu"},{h:95,t:"mu"},{h:65,t:"mu"},{h:100,t:"mu",hi:true},
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const TYPE_LABEL = { music:"Musique", pub:"Pub", urgent:"Urgent" };
const TYPE_CHIP  = { music:"tc-music", pub:"tc-pub", urgent:"tc-urgent" };
const LOG_TAG    = { err:"lt-err", warn:"lt-warn", ok:"lt-ok", info:"lt-info" };
const LOG_LABEL  = { err:"Erreur", warn:"Alerte", ok:"OK", info:"Info" };
const UPTIME_COL = { ok:"var(--accent)", warn:"var(--warn)", ko:"var(--danger)" };
const UPTIME_OP  = { ok:.28, warn:.6, ko:.8 };

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return <span className="topbar-clock">{t.toLocaleTimeString("fr-FR")}</span>;
}

function Wave({ on }) {
  return (
    <div className={`wave${on ? "" : " off"}`} style={{marginRight:4}}>
      {[1,2,3,4,5].map(i=><div key={i} className="wb"/>)}
    </div>
  );
}

function UptimeStrip({ segs }) {
  return (
    <div className="uptime-strip">
      {segs.map((s,i)=>(
        <div key={i} className="us-seg" title={s}
          style={{background:UPTIME_COL[s], opacity:s==="ok"?(.2+(i/segs.length)*.5):UPTIME_OP[s]}} />
      ))}
    </div>
  );
}

function SyncCircle({ pct, color }) {
  const r = 22, circ = 2*Math.PI*r;
  return (
    <div className="prog-circle">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--border)" strokeWidth="4"/>
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round"/>
      </svg>
      <div className="prog-circle-lbl" style={{color}}>{pct}%</div>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t=>(
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.ico}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGES
═══════════════════════════════════════════════════════════ */

/* ── PAGE: VUE D'ENSEMBLE ──────────────────────────────── */
function PageOverview() {
  return (
    <div className="page">
      <div className="alert-banner ab-danger">
        <span className="ab-ico">🔴</span>
        <div className="ab-txt"><strong>Lecteur hors ligne</strong> — R-03 (Gare Marseille) ne répond plus depuis 18 min. Playlist locale potentiellement obsolète.</div>
        <button className="btn btn-sm btn-ghost">Ignorer</button>
        <button className="btn btn-sm btn-danger">Voir détails</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card sc-g">
          <div className="stat-lbl">Lecteurs actifs</div>
          <div className="stat-val g">2<span style={{fontSize:14,color:"var(--muted)"}}>/{READERS.length}</span></div>
          <div className="stat-hint">↑ Site Central opérationnel</div>
        </div>
        <div className="stat-card sc-r">
          <div className="stat-lbl">Hors ligne</div>
          <div className="stat-val r">1</div>
          <div className="stat-hint">⚠ R-03 — dernière vue 18 min</div>
        </div>
        <div className="stat-card sc-o">
          <div className="stat-lbl">Sync en retard</div>
          <div className="stat-val o">1</div>
          <div className="stat-hint">R-02 → playlist v2 (v3 dispo)</div>
        </div>
        <div className="stat-card sc-b">
          <div className="stat-lbl">Diffusions aujourd'hui</div>
          <div className="stat-val b">142</div>
          <div className="stat-hint">↑ +12 vs hier</div>
        </div>
      </div>

      <p className="section-hd">État des lecteurs</p>
      <div className="lect-grid mb20">
        {READERS.map(r => (
          <div key={r.id} className={`lect-card${r.status==="ko"?" ko":r.sync<90?" wrn":""}`}>
            <div className="lect-top">
              <div>
                <div className="lect-name">{r.name}</div>
                <div className="lect-loc">{r.loc}</div>
              </div>
              <span className={`status-tag ${r.status==="ko"?"st-ko":r.sync<90?"st-warn":"st-up"}`}>
                {r.status==="ko"?"KO":r.sync<90?"SYNC ⚠":"UP"}
              </span>
            </div>
            <div className="now-label">En cours de diffusion</div>
            <div className="now-track">
              <Wave on={r.status==="up"} />
              {r.track}
              {r.type && <span className={`type-chip ${TYPE_CHIP[r.type]}`}>{TYPE_LABEL[r.type]}</span>}
            </div>
            <div className="sync-row">
              <span className="sync-label">Sync</span>
              <div className="sync-track">
                <div className={`sync-fill ${r.sync>=90?"sf-ok":r.sync>50?"sf-wrn":"sf-ko"}`} style={{width:`${r.sync}%`}}/>
              </div>
              <span className="sync-pct" style={{color:r.sync>=90?"var(--accent)":r.sync>50?"var(--warn)":"var(--danger)"}}>{r.sync}%</span>
            </div>
            <div className="lect-meta">
              <div className="lm-item">IP <span>{r.ip}</span></div>
              <div className="lm-item">Vue <span>{r.lastSeen}</span></div>
              <div className="lm-item">Uptime <span>{r.uptime}%</span></div>
            </div>
            <UptimeStrip segs={UPTIME30}/>
          </div>
        ))}
      </div>

      <div className="ov-grid">
        <div className="card">
          <div className="card-head"><span className="card-title">📊 Diffusions — 12 dernières heures</span>
            <div style={{display:"flex",gap:12,fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>
              <span style={{color:"var(--accent)"}}>■ Musique</span>
              <span style={{color:"var(--warn)"}}>■ Pub</span>
            </div>
          </div>
          <div className="card-body">
            <div className="bar-chart">
              {BAR_DATA.map((b,i)=>(
                <div key={i} className={`bc-bar ${b.t}${b.hi?" hi":""}`} style={{height:`${b.h}%`}}/>
              ))}
            </div>
            <div className="bar-labels">
              {["21h","22h","23h","00h","01h","02h","03h","04h","05h","06h","07h","08h"].map(h=>(
                <span key={h} className="bar-lbl">{h}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><span className="card-title">⏱ Journal récent</span></div>
          <div className="card-body" style={{padding:"10px 16px"}}>
            <ul className="log-list">
              {LOGS.slice(0,5).map((l,i)=>(
                <li key={i} className="log-item">
                  <span className="log-ico">{l.ico}</span>
                  <div className="log-body">{l.msg}<span className={`log-tag ${LOG_TAG[l.tag]}`}>{LOG_LABEL[l.tag]}</span></div>
                  <span className="log-t">{l.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE: LECTEURS ────────────────────────────────────── */
function PageLecteurs() {
  const [selected, setSelected] = useState(READERS[0]);
  return (
    <div className="page">
      <div className="row mb14">
        {READERS.map(r=>(
          <div key={r.id} className={`lect-card flex1${r.status==="ko"?" ko":r.sync<90?" wrn":""}`}
            style={{cursor:"pointer", borderColor: selected.id===r.id?"var(--accent)":"undefined"}}
            onClick={()=>setSelected(r)}>
            <div className="lect-top">
              <div><div className="lect-name">{r.name}</div><div className="lect-loc">{r.loc}</div></div>
              <span className={`status-tag ${r.status==="ko"?"st-ko":r.sync<90?"st-warn":"st-up"}`}>
                {r.status==="ko"?"KO":r.sync<90?"SYNC ⚠":"UP"}
              </span>
            </div>
            <div className="now-track" style={{marginBottom:8}}>
              <Wave on={r.status==="up"}/>{r.track}
              {r.type&&<span className={`type-chip ${TYPE_CHIP[r.type]}`}>{TYPE_LABEL[r.type]}</span>}
            </div>
            <UptimeStrip segs={UPTIME30}/>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div className="card">
        <div className="card-head">
          <span className="card-title">🔍 Détail — {selected.name}</span>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-sm btn-ghost">⟳ Forcer sync</button>
            <button className="btn btn-sm btn-accent">▶ Redémarrer</button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid2" style={{marginBottom:16}}>
            <div>
              <p className="section-hd" style={{marginBottom:8}}>Informations</p>
              <table className="tbl">
                <tbody>
                  {[
                    ["ID", selected.id],
                    ["Adresse IP", selected.ip],
                    ["Port", selected.port],
                    ["Localisation", selected.loc],
                    ["Playlist active", selected.playlist],
                    ["Dernière activité", selected.lastSeen],
                    ["Uptime total", `${selected.uptime}%`],
                  ].map(([k,v])=>(
                    <tr key={k}>
                      <td style={{color:"var(--muted2)",width:"140px"}}>{k}</td>
                      <td style={{fontWeight:600}}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className="section-hd" style={{marginBottom:8}}>Synchronisation</p>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
                <SyncCircle pct={selected.sync} color={selected.sync>=90?"var(--accent)":selected.sync>50?"var(--warn)":"var(--danger)"}/>
                <div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>
                    {selected.sync>=90?"Playlist à jour":selected.sync>50?"Synchronisation partielle":"Hors synchronisation"}
                  </div>
                  <div style={{fontSize:11,color:"var(--muted2)"}}>
                    {selected.sync>=90?"Tous les fichiers sont synchronisés":"Certains fichiers manquent ou sont obsolètes"}
                  </div>
                </div>
              </div>
              <p className="section-hd" style={{marginBottom:8}}>Uptime (30 derniers jours)</p>
              <UptimeStrip segs={UPTIME30}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,fontFamily:"var(--font-mono)",color:"var(--muted)"}}>
                <span>30j</span><span>Aujourd'hui</span>
              </div>
            </div>
          </div>
          <p className="section-hd">Activité récente</p>
          <ul className="log-list">
            {LOGS.slice(0,4).map((l,i)=>(
              <li key={i} className="log-item">
                <span className="log-ico">{l.ico}</span>
                <div className="log-body">{l.msg}<span className={`log-tag ${LOG_TAG[l.tag]}`}>{LOG_LABEL[l.tag]}</span></div>
                <span className="log-t">{l.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE: PLAYLISTS ───────────────────────────────────── */
function PagePlaylists() {
  const [tracks, setTracks] = useState(PLAYLIST_TRACKS);
  const [activeReader, setActiveReader] = useState("R-01");

  function removeTrack(id) { setTracks(t=>t.filter(x=>x.id!==id)); }

  return (
    <div className="page">
      <div className="row mb14" style={{alignItems:"center"}}>
        <div style={{display:"flex",gap:8}}>
          {READERS.map(r=>(
            <button key={r.id}
              className={`btn btn-sm${activeReader===r.id?" btn-accent":" btn-ghost"}`}
              onClick={()=>setActiveReader(r.id)}>
              {r.id} — {r.name.replace("Lecteur ","")}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <button className="btn btn-sm btn-ghost">+ Ajouter piste</button>
          <button className="btn btn-sm btn-accent">⟳ Sync vers lecteurs</button>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-head">
            <span className="card-title">🎵 Playlist active — {activeReader}</span>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted2)"}}>{tracks.length} pistes</span>
          </div>
          <div className="card-body" style={{padding:"10px 16px"}}>
            {tracks.map((t,i)=>(
              <div key={t.id} className={`pl-item${t.playing?" active-track":""}`}>
                <span className="pl-drag">⠿</span>
                <span className="pl-num">
                  {t.playing ? <span className="play-dot"/> : <span className="mono-sm">{String(i+1).padStart(2,"0")}</span>}
                </span>
                <div className="pl-info">
                  <div className="pl-name">{t.title}</div>
                  <div className="pl-artist">{t.artist}</div>
                </div>
                <span className={`badge badge-${t.type}`}>{TYPE_LABEL[t.type]}</span>
                <span className="pl-dur mono-sm">{t.dur}</span>
                <button className="btn btn-sm btn-ghost" style={{padding:"3px 8px",fontSize:11}}
                  onClick={()=>removeTrack(t.id)}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card">
            <div className="card-head"><span className="card-title">📊 Répartition</span></div>
            <div className="card-body">
              {[
                {label:"Musique", count:tracks.filter(t=>t.type==="music").length, color:"var(--accent2)"},
                {label:"Publicités", count:tracks.filter(t=>t.type==="pub").length, color:"var(--warn)"},
                {label:"Urgents", count:tracks.filter(t=>t.type==="urgent").length, color:"var(--danger)"},
              ].map(({label,count,color})=>(
                <div key={label} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                    <span style={{color:"var(--muted2)"}}>{label}</span>
                    <span style={{fontFamily:"var(--font-mono)",color}}>{count} pistes</span>
                  </div>
                  <div style={{height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(count/tracks.length)*100}%`,background:color,borderRadius:2}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="card-title">📋 Playlists disponibles</span></div>
            <div className="card-body" style={{padding:"10px 16px"}}>
              {["Playlist_Juin_v3","Playlist_Juin_v2","Playlist_Mai_v1","Playlist_Urgences"].map((p,i)=>(
                <div key={p} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:i<3?"1px solid var(--border)":"none"}}>
                  <span style={{fontSize:13,flex:1,fontWeight:600}}>{p}</span>
                  {i===0&&<span className="badge badge-up">Active</span>}
                  <button className="btn btn-sm btn-ghost">Charger</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE: ALERTES ─────────────────────────────────────── */
function PageAlertes() {
  const [dismissed, setDismissed] = useState([]);
  const visible = ALERTS.filter(a=>!dismissed.includes(a.id));
  return (
    <div className="page">
      <div className="stat-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <div className="stat-card sc-r">
          <div className="stat-lbl">Alertes critiques</div>
          <div className="stat-val r">{ALERTS.filter(a=>a.type==="err").length}</div>
          <div className="stat-hint">Nécessite action immédiate</div>
        </div>
        <div className="stat-card sc-o">
          <div className="stat-lbl">Avertissements</div>
          <div className="stat-val o">{ALERTS.filter(a=>a.type==="warn").length}</div>
          <div className="stat-hint">À surveiller</div>
        </div>
        <div className="stat-card sc-b">
          <div className="stat-lbl">Informations</div>
          <div className="stat-val b">{ALERTS.filter(a=>a.type==="info").length}</div>
          <div className="stat-hint">Aucune action requise</div>
        </div>
      </div>

      <p className="section-hd">Alertes actives ({visible.length})</p>

      {visible.length === 0 && (
        <div style={{textAlign:"center",padding:"40px 0",color:"var(--muted2)"}}>
          <div style={{fontSize:32,marginBottom:8}}>✅</div>
          <div style={{fontSize:14,fontWeight:600}}>Aucune alerte active</div>
          <div style={{fontSize:12,marginTop:4}}>Tous les systèmes fonctionnent normalement</div>
        </div>
      )}

      {visible.map(a=>(
        <div key={a.id} className={`alert-card ac-${a.type}`}>
          <span className="ac-ico">{a.ico}</span>
          <div className="ac-body">
            <div className={`ac-title ${a.type}`}>{a.title}</div>
            <div className="ac-desc">{a.desc}</div>
            <div className="ac-meta">🕐 {a.time} &nbsp;·&nbsp; 📍 {a.site}</div>
            <div className="ac-actions">
              <button className="btn btn-sm btn-ghost" onClick={()=>setDismissed(d=>[...d,a.id])}>Ignorer</button>
              {a.type==="err" && <button className="btn btn-sm btn-danger">Intervenir</button>}
              {a.type==="warn" && <button className="btn btn-sm btn-warn">Forcer sync</button>}
              {a.type==="info" && <button className="btn btn-sm btn-ghost" style={{borderColor:"var(--accent2)",color:"var(--accent2)"}}>Voir détails</button>}
            </div>
          </div>
        </div>
      ))}

      <p className="section-hd" style={{marginTop:24}}>Historique des alertes</p>
      <div className="card">
        <div className="card-body" style={{padding:"8px 16px"}}>
          <ul className="log-list">
            {LOGS.filter(l=>l.tag==="err"||l.tag==="warn").map((l,i)=>(
              <li key={i} className="log-item">
                <span className="log-ico">{l.ico}</span>
                <div className="log-body">{l.msg}<span className={`log-tag ${LOG_TAG[l.tag]}`}>{LOG_LABEL[l.tag]}</span></div>
                <span className="log-t">{l.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE: MESSAGE URGENT ──────────────────────────────── */
function PageUrgent({ addToast }) {
  const [msg, setMsg] = useState("");
  const [targets, setTargets] = useState(["R-01","R-02"]);
  const [priority, setPriority] = useState("high");
  const [repeat, setRepeat] = useState("1");
  const [sending, setSending] = useState(false);

  function toggleTarget(id) {
    setTargets(t => t.includes(id) ? t.filter(x=>x!==id) : [...t,id]);
  }

  function handleSend() {
    if (!msg.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMsg("");
      addToast({ ico:"📢", msg:`Message urgent diffusé sur ${targets.join(", ")}`, type:"success" });
    }, 1800);
  }

  return (
    <div className="page">
      <div className="alert-banner ab-warn" style={{marginBottom:20}}>
        <span className="ab-ico">⚠️</span>
        <div className="ab-txt warn"><strong>Attention</strong> — Un message urgent interrompt immédiatement la diffusion en cours sur les lecteurs sélectionnés.</div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-head"><span className="card-title">📢 Composer le message</span></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Texte du message</label>
              <textarea className="form-input" placeholder="Ex : Attention, veuillez vous diriger vers les sorties de secours..."
                value={msg} onChange={e=>setMsg(e.target.value)} rows={4}/>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priorité</label>
                <select className="form-input form-select" value={priority} onChange={e=>setPriority(e.target.value)}>
                  <option value="high">🔴 Haute — interruption immédiate</option>
                  <option value="medium">🟡 Moyenne — après piste en cours</option>
                  <option value="low">🟢 Basse — prochaine pause pub</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Répétitions</label>
                <select className="form-input form-select" value={repeat} onChange={e=>setRepeat(e.target.value)}>
                  <option value="1">1× (une seule fois)</option>
                  <option value="2">2× </option>
                  <option value="3">3× </option>
                  <option value="0">En boucle jusqu'à arrêt</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lecteurs ciblés</label>
              <div className="checkbox-group">
                {READERS.map(r=>(
                  <label key={r.id} className="checkbox-item">
                    <input type="checkbox" checked={targets.includes(r.id)} onChange={()=>toggleTarget(r.id)}/>
                    <span style={{fontWeight:600}}>{r.name}</span>
                    <span style={{color:"var(--muted2)",fontSize:12}}>— {r.loc}</span>
                    <span className={`status-tag ${r.status==="ko"?"st-ko":"st-up"}`} style={{marginLeft:"auto",fontSize:9,padding:"2px 7px"}}>{r.status==="ko"?"KO":"UP"}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="btn btn-danger btn-lg" style={{width:"100%",justifyContent:"center"}}
              onClick={handleSend} disabled={sending||!msg.trim()||targets.length===0}>
              {sending ? "⏳ Envoi en cours..." : "📢 Diffuser le message urgent"}
            </button>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card">
            <div className="card-head"><span className="card-title">👁 Aperçu</span></div>
            <div className="card-body">
              <div className="urgent-preview">
                <div className="up-label">⚠ Message urgent — en diffusion</div>
                <div className="up-msg">{msg || <span style={{color:"var(--muted)",fontStyle:"italic"}}>Votre message apparaîtra ici...</span>}</div>
                {targets.length>0&&<div style={{marginTop:8,fontSize:11,color:"var(--muted2)"}}>
                  Lecteurs : {targets.join(", ")} · {repeat==="0"?"Boucle":repeat+"× répétition"} · Priorité {priority==="high"?"haute":priority==="medium"?"moyenne":"basse"}
                </div>}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><span className="card-title">📋 Messages récents</span></div>
            <div className="card-body" style={{padding:"8px 16px"}}>
              {[
                {time:"09:10",msg:"Exercice d'évacuation dans 5 minutes",targets:"R-01, R-02"},
                {time:"08:30",msg:"Le restaurant sera fermé ce midi",targets:"R-01"},
                {time:"07:45",msg:"Bienvenue à tous nos visiteurs",targets:"Tous"},
              ].map((m,i)=>(
                <div key={i} style={{padding:"9px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)"}}>{m.time}</span>
                    <span style={{fontSize:10,color:"var(--muted2)"}}>{m.targets}</span>
                  </div>
                  <div style={{fontSize:12,color:"var(--text)"}}>{m.msg}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE: HISTORIQUE ──────────────────────────────────── */
function PageHistorique() {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? HISTORY : HISTORY.filter(h=>h.type===filter);
  return (
    <div className="page">
      <div className="stat-grid" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:16}}>
        <div className="stat-card sc-b">
          <div className="stat-lbl">Total diffusions</div>
          <div className="stat-val b">142</div>
          <div className="stat-hint">Aujourd'hui</div>
        </div>
        <div className="stat-card sc-g">
          <div className="stat-lbl">Temps de diffusion</div>
          <div className="stat-val g">7h<span style={{fontSize:16}}>23</span></div>
          <div className="stat-hint">Sur 3 lecteurs</div>
        </div>
        <div className="stat-card sc-o">
          <div className="stat-lbl">Spots publicitaires</div>
          <div className="stat-val o">28</div>
          <div className="stat-hint">Planning respecté à 96%</div>
        </div>
      </div>

      <div className="card mb14">
        <div className="card-head">
          <span className="card-title">📊 Répartition par type</span>
        </div>
        <div className="card-body">
          <div className="bar-chart" style={{height:64}}>
            {BAR_DATA.map((b,i)=>(
              <div key={i} className={`bc-bar ${b.t}${b.hi?" hi":""}`} style={{height:`${b.h}%`}}/>
            ))}
          </div>
          <div className="bar-labels">
            {["21h","22h","23h","00h","01h","02h","03h","04h","05h","06h","07h","08h"].map(h=>(
              <span key={h} className="bar-lbl">{h}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <span className="card-title">📋 Journal des diffusions</span>
          <div className="filter-row" style={{marginBottom:0}}>
            {["all","music","pub","urgent"].map(f=>(
              <button key={f} className={`fpill${filter===f?" on":""}`} onClick={()=>setFilter(f)}>
                {f==="all"?"Tout":TYPE_LABEL[f]}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body" style={{padding:0}}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Heure</th><th>Titre</th><th>Site</th><th>Type</th><th>Durée</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h,i)=>(
                <tr key={i}>
                  <td><span className="mono-sm">{h.time}</span></td>
                  <td style={{fontWeight:600}}>{h.title}</td>
                  <td style={{color:"var(--muted2)",fontSize:11}}>{h.site}</td>
                  <td><span className={`badge badge-${h.type}`}>{TYPE_LABEL[h.type]}</span></td>
                  <td><span className="mono-sm">{h.dur}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── PAGE: JOURNAL ─────────────────────────────────────── */
function PageJournal() {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? LOGS : LOGS.filter(l=>l.tag===filter);
  return (
    <div className="page">
      <div className="filter-row mb14">
        {["all","err","warn","ok","info"].map(f=>(
          <button key={f} className={`fpill${filter===f?" on":""}`} onClick={()=>setFilter(f)}>
            {f==="all"?"Tout":LOG_LABEL[f]}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-head">
          <span className="card-title">⏱ Journal système</span>
          <span className="mono-sm">{filtered.length} entrées</span>
        </div>
        <div className="card-body" style={{padding:"8px 16px"}}>
          <ul className="log-list">
            {filtered.map((l,i)=>(
              <li key={i} className="log-item">
                <span className="log-ico">{l.ico}</span>
                <div className="log-body">{l.msg}<span className={`log-tag ${LOG_TAG[l.tag]}`}>{LOG_LABEL[l.tag]}</span></div>
                <span className="log-t">{l.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════ */
const PAGES = [
  { id:"overview",  label:"Vue d'ensemble", ico:"◈", section:"Général" },
  { id:"lecteurs",  label:"Lecteurs",        ico:"⊡", section:"Général" },
  { id:"playlists", label:"Playlists",       ico:"≡", section:"Général" },
  { id:"urgent",    label:"Message urgent",  ico:"⚡", section:"Actions", badge:"!", badgeClass:"orange" },
  { id:"alertes",   label:"Alertes",         ico:"🔔", section:"Supervision", badge:"2", badgeClass:"" },
  { id:"journal",   label:"Journal",         ico:"⏱", section:"Supervision" },
  { id:"historique",label:"Historique",      ico:"◷", section:"Supervision" },
];

const PAGE_TITLES = {
  overview:"Vue d'ensemble", lecteurs:"Lecteurs", playlists:"Gestion des playlists",
  urgent:"Diffuser un message urgent", alertes:"Alertes", journal:"Journal système", historique:"Historique des diffusions",
};

export default function App() {
  const [page, setPage] = useState("overview");
  const [toasts, setToasts] = useState([]);

  function addToast(t) {
    const id = Date.now();
    setToasts(ts=>[...ts,{...t,id}]);
    setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)), 3500);
  }

  const sections = [...new Set(PAGES.map(p=>p.section))];

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-eyebrow"><div className="live-dot"/>Live</div>
            <div className="brand-name">SoundCtrl</div>
            <div className="brand-sub">Supervision musicale</div>
          </div>
          <nav className="nav">
            {sections.map(sec=>(
              <div key={sec}>
                <div className="nav-section">{sec}</div>
                {PAGES.filter(p=>p.section===sec).map(p=>(
                  <button key={p.id} className={`nav-btn${page===p.id?" active":""}`} onClick={()=>setPage(p.id)}>
                    <span className="nav-ico">{p.ico}</span>
                    {p.label}
                    {p.badge&&<span className={`nav-badge${p.badgeClass?" "+p.badgeClass:""}`}>{p.badge}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            SAÉ IUT Villetaneuse<br/>
            Groupe <strong>G2</strong> · 2026
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <div>
                <div className="page-title">{PAGE_TITLES[page]}</div>
                <div className="page-sub">IUT Villetaneuse — Réseau &amp; Télécommunications</div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="pill"><div className="pill-dot g"/>2 actifs</div>
              <div className="pill"><div className="pill-dot r"/>1 KO</div>
              <Clock/>
            </div>
          </div>

          {page==="overview"  && <PageOverview/>}
          {page==="lecteurs"  && <PageLecteurs/>}
          {page==="playlists" && <PagePlaylists/>}
          {page==="urgent"    && <PageUrgent addToast={addToast}/>}
          {page==="alertes"   && <PageAlertes/>}
          {page==="journal"   && <PageJournal/>}
          {page==="historique"&& <PageHistorique/>}
        </div>
      </div>
      <Toast toasts={toasts}/>
    </>
  );
}
