import React, { useEffect, useRef, useState } from "react";

/**
 * Invariant Loop Field — React Canvas (no scripted levels)
 * Now with camera + microphone as *pure perturbations* to the field.
 *
 * The loop (T = ℰ ∘ [ICE]_ℓ ∘ ∇) remains the invariant center.
 * Camera/mic only change the landscape the loop descends — they do not
 * create stages or levels.
 */

// ------------------------------ Utility math ---------------------------------
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const randn = () => {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// Jensen–Shannon divergence (symmetric, bounded) between two histograms
function jsDiv(p: number[], q: number[]) {
  const m = p.map((pi, i) => 0.5 * (pi + (q[i] ?? 0)));
  return 0.5 * (klDiv(p, m) + klDiv(q, m));
}
function klDiv(p: number[], q: number[]) {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const pi = Math.max(p[i], 1e-12);
    const qi = Math.max(q[i] ?? 1e-12, 1e-12);
    s += pi * Math.log(pi / qi);
  }
  return s / Math.log(2);
}

// Poor-man’s LZ proxy: count runs after binning headings
function lzProxy(sequence: number[]) {
  let runs = 1;
  for (let i = 1; i < sequence.length; i++) if (sequence[i] !== sequence[i - 1]) runs++;
  return runs / Math.max(sequence.length, 1);
}

// ------------------------------ Types ----------------------------------------
interface Particle { x: number; y: number; vx: number; vy: number; hue: number; id: number; }
interface Stats { C: number; I: number; K: number; N: number; A: number; }
interface Attractor { x: number; y: number; w: number; }

// ------------------------------ Component ------------------------------------
export default function InvariantLoopField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // UI state
  const [paused, setPaused] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  // Loop params
  const λK = useRef(0.25); // complexity weight
  const λN = useRef(0.35); // novelty weight
  const targetFPS = 60;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ---------------------- Field state (Φ) ----------------------------------
    const NUM = 480;
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    let ℓ = Math.min(W(), H()) * 0.12; // aperture
    const ℓMin = Math.min(W(), H()) * 0.04;
    const ℓMax = Math.min(W(), H()) * 0.25;

    const particles: Particle[] = Array.from({ length: NUM }, (_, i) => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      hue: Math.random() * 360,
      id: i + 1,
    }));

    // Rolling priors & history for stats
    const headingBins = 36; // 10° bins
    let priorHist = new Array(headingBins).fill(1e-6);
    const historyC: number[] = [];
    const receipts: { t: number; C: number; I: number; K: number; N: number }[] = [];

    // ---------------------- Camera / Mic perturbations -----------------------
    // Camera
    const video = document.createElement('video');
    video.autoplay = true; video.muted = true; (video as any).playsInline = true;
    let camStream: MediaStream | null = null;
    const camS = 64, camT = 36; // downsample size for analysis
    const camCanvas = document.createElement('canvas');
    camCanvas.width = camS; camCanvas.height = camT;
    const camCtx = camCanvas.getContext('2d', { willReadFrequently: true })!;
    let prevFrame: Uint8ClampedArray | null = null;
    let motionEMA = 0;       // 0..1
    let brightnessEMA = 0;   // 0..1
    let camAttractors: Attractor[] = []; // positions (x,y) with weight w

    async function startCamera() {
      try {
        camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        video.srcObject = camStream;
        setCamOn(true);
      } catch (e) {
        console.warn('Camera error', e);
        setCamOn(false);
      }
    }

    function stopCamera() {
      camStream?.getTracks().forEach(t => t.stop());
      camStream = null; setCamOn(false);
    }

    function analyzeCamera() {
      if (!camOn || !video.videoWidth) return;
      camCtx.drawImage(video, 0, 0, camS, camT);
      const img = camCtx.getImageData(0, 0, camS, camT);
      const data = img.data;
      let sum = 0;
      let diffSum = 0;
      const attractors: Attractor[] = [];

      // sample grid into coarse blocks to find bright/motion peaks
      const block = 8; // 8x8 px per block on downsampled frame
      for (let y = 0; y < camT; y++) {
        for (let x = 0; x < camS; x++) {
          const idx = (y * camS + x) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255; // 0..1
          sum += lum;

          let d = 0;
          if (prevFrame) {
            const pr = prevFrame[idx], pg = prevFrame[idx + 1], pb = prevFrame[idx + 2];
            const plum = (0.299 * pr + 0.587 * pg + 0.114 * pb) / 255;
            d = Math.abs(lum - plum);
            diffSum += d;
          }

          // pick a few strong local attractors (brightness + motion)
          if ((x % block === 0) && (y % block === 0)) {
            // compute local score over block
            let score = 0, cnt = 0;
            for (let yy = 0; yy < block && y + yy < camT; yy++) {
              for (let xx = 0; xx < block && x + xx < camS; xx++) {
                const ii = ((y + yy) * camS + (x + xx)) * 4;
                const rr = data[ii], gg = data[ii + 1], bb = data[ii + 2];
                const ll = (0.299 * rr + 0.587 * gg + 0.114 * bb) / 255;
                let dd = 0;
                if (prevFrame) {
                  const prr = prevFrame[ii], pgg = prevFrame[ii + 1], pbb = prevFrame[ii + 2];
                  const pll = (0.299 * prr + 0.587 * pgg + 0.114 * pbb) / 255;
                  dd = Math.abs(ll - pll);
                }
                score += 0.7 * ll + 0.3 * dd; cnt++;
              }
            }
            score /= Math.max(1, cnt);
            if (score > 0.35) {
              // map to canvas coords
              const px = (x + block * 0.5) / camS * W();
              const py = (y + block * 0.5) / camT * H();
              attractors.push({ x: px, y: py, w: clamp(score, 0, 1) });
            }
          }
        }
      }

      brightnessEMA = lerp(brightnessEMA, clamp(sum / (camS * camT), 0, 1), 0.15);
      motionEMA = lerp(motionEMA, clamp(diffSum / (camS * camT), 0, 1), 0.25);
      camAttractors = attractors.slice(0, 40); // cap
      prevFrame = img.data;
    }

    // Microphone
    let micStream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    const fftSize = 512;
    const timeBuf = new Uint8Array(fftSize);
    const freqBuf = new Uint8Array(fftSize / 2);
    let volumeEMA = 0;      // 0..1
    let centroidEMA = 0;    // 0..1

    async function startMic() {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const src = audioCtx.createMediaStreamSource(micStream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = 0.8;
        src.connect(analyser);
        setMicOn(true);
      } catch (e) {
        console.warn('Mic error', e);
        setMicOn(false);
      }
    }

    function stopMic() {
      micStream?.getTracks().forEach(t => t.stop());
      micStream = null; setMicOn(false);
      analyser?.disconnect(); analyser = null;
      audioCtx?.close(); audioCtx = null;
    }

    function analyzeMic() {
      if (!micOn || !analyser) return;
      analyser.getByteTimeDomainData(timeBuf);
      analyser.getByteFrequencyData(freqBuf);

      // RMS volume (0..1)
      let sumSq = 0;
      for (let i = 0; i < timeBuf.length; i++) {
        const v = (timeBuf[i] - 128) / 128; sumSq += v * v;
      }
      const rms = Math.sqrt(sumSq / timeBuf.length);
      volumeEMA = lerp(volumeEMA, clamp(rms * 2.5, 0, 1), 0.2);

      // Spectral centroid normalized by Nyquist
      let num = 0, den = 0;
      for (let i = 0; i < freqBuf.length; i++) { const mag = freqBuf[i]; num += mag * i; den += mag; }
      const centroid = den > 0 ? (num / den) / freqBuf.length : 0;
      centroidEMA = lerp(centroidEMA, centroid, 0.2);
    }

    // Composite input energy (0..1) used inside ∇ jitter
    let inputEnergy = 0;

    // ---------------------- Measurement (order-parameters) -------------------
    function measureStats(): { stats: Stats; graph: Uint16Array[]; headings: number[]; compSizes: number[] } {
      // Build neighbor graph within ℓ
      const graph: Uint16Array[] = Array.from({ length: NUM }, () => new Uint16Array(0));
      const neighborLists: number[][] = Array.from({ length: NUM }, () => []);
      for (let i = 0; i < NUM; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < NUM; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < ℓ * ℓ) { neighborLists[i].push(j); neighborLists[j].push(i); }
        }
      }
      for (let i = 0; i < NUM; i++) graph[i] = new Uint16Array(neighborLists[i]);

      // Coherence proxy C
      const degrees = neighborLists.map((n) => n.length);
      const avgDeg = degrees.reduce((a, b) => a + b, 0) / Math.max(1, degrees.length);
      const C = clamp(avgDeg / 32, 0, 1);

      // Integration I via BFS
      const seen = new Uint8Array(NUM);
      const compSizes: number[] = [];
      for (let i = 0; i < NUM; i++) {
        if (seen[i]) continue;
        let q: number[] = [i]; seen[i] = 1; let size = 0;
        while (q.length) {
          const k = q.pop()!; size++;
          const neigh = neighborLists[k];
          for (let v of neigh) if (!seen[v]) { seen[v] = 1; q.push(v); }
        }
        compSizes.push(size);
      }
      const I = Math.max(...compSizes) / NUM;

      // Headings & hist for K, N
      const headings: number[] = new Array(NUM);
      const hist = new Array(headingBins).fill(0);
      for (let i = 0; i < NUM; i++) {
        const p = particles[i];
        const a = Math.atan2(p.vy, p.vx); // -PI..PI
        const d = a < 0 ? a + Math.PI * 2 : a;
        const bin = Math.floor((d / (Math.PI * 2)) * headingBins);
        headings[i] = bin; hist[bin] += 1;
      }
      for (let i = 0; i < headingBins; i++) hist[i] = hist[i] / NUM;

      const K = clamp(lzProxy(headings), 0, 1);
      const prior = priorHist.map((v) => v);
      const N = clamp(jsDiv(hist, prior), 0, 1);
      const A = 0;
      return { stats: { C, I, K, N, A }, graph, headings, compSizes };
    }

    // ---------------------- Adaptive aperture & free energy ------------------
    function adaptAperture(currentℓ: number, C: number, N: number) {
      let next = currentℓ;
      next += (C - 0.5) * 4;     // higher C → expand
      next -= (N - 0.3) * 3;     // higher N → contract
      return clamp(lerp(currentℓ, next, 0.08), ℓMin, ℓMax);
    }

    function freeEnergy(s: Stats) { return -s.C + λK.current * s.K + λN.current * s.N; }

    // ---------------------- ∇ (propose), [ICE] (select), ℰ (commit) ----------
    function stepLoop(dt: number) {
      // Update sensors → perturbations first
      analyzeCamera();
      analyzeMic();
      inputEnergy = clamp(0.6 * motionEMA + 0.3 * volumeEMA + 0.1 * brightnessEMA, 0, 1);

      // Measure current state once
      const measured = measureStats();
      const prevStats = measured.stats;
      const F_prev = freeEnergy(prevStats);

      // ∇: local proposals — neighborhood pull + jitter + sensor-driven bias
      const proposals: { i: number; dvx: number; dvy: number }[] = [];
      for (let i = 0; i < NUM; i++) {
        const p = particles[i];
        let cx = 0, cy = 0, count = 0;
        const neigh = measured.graph[i];
        for (let j = 0; j < neigh.length; j++) { const k = neigh[j]; cx += particles[k].x; cy += particles[k].y; count++; }
        if (count > 0) { cx /= count; cy /= count; } else { cx = p.x; cy = p.y; }

        const pull = 0.04;
        // jitter scaled by mic energy
        const jx = randn() * 0.02 * (0.4 + inputEnergy);
        const jy = randn() * 0.02 * (0.4 + inputEnergy);

        // camera-derived attractor influence: towards nearest bright/motion cell
        let ax = 0, ay = 0;
        if (camAttractors.length) {
          // pick the strongest nearby attractor
          let bestW = 0, bx = 0, by = 0;
          for (let a = 0; a < camAttractors.length; a++) {
            const A = camAttractors[a];
            const dx = A.x - p.x, dy = A.y - p.y;
            const d = Math.hypot(dx, dy) + 1e-6;
            const w = A.w / d; // inverse-distance weight
            if (w > bestW) { bestW = w; bx = dx; by = dy; }
          }
          const camGain = 0.03 + 0.07 * inputEnergy; // stronger when sensors active
          ax = bx * camGain; ay = by * camGain;
        }

        const dvx = (cx - p.x) * pull + jx + ax;
        const dvy = (cy - p.y) * pull + jy + ay;
        proposals.push({ i, dvx, dvy });
      }

      // [ICE]: accept if free energy decreases (local, approximate)
      const sample = 1.0; // could downsample for speed
      for (let k = 0; k < proposals.length; k++) {
        if (Math.random() > sample) continue;
        const pr = proposals[k];
        const i = pr.i; const p = particles[i];
        const ovx = p.vx, ovy = p.vy;
        p.vx += pr.dvx; p.vy += pr.dvy;
        p.vx *= 0.985; p.vy *= 0.985;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 1.2) { p.vx *= 1.2 / sp; p.vy *= 1.2 / sp; }

        const newMeasured = measureStats();
        const accepted = freeEnergy(newMeasured.stats) < F_prev;
        if (!accepted) { p.vx = ovx; p.vy = ovy; }
      }

      // ℰ: commit + receipts
      for (let i = 0; i < NUM; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x += W(); if (p.x > W()) p.x -= W();
        if (p.y < 0) p.y += H(); if (p.y > H()) p.y -= H();
        const speed = Math.hypot(p.vx, p.vy);
        // hue drifts with centroid → brighter/higher pitch nudges spectrum upward
        const hueNudge = 30 * (centroidEMA - 0.3) + 40 * (brightnessEMA - 0.5);
        p.hue = (p.hue + speed * 4 + hueNudge * 0.01) % 360;
      }

      // Update stats after commit
      const measured2 = measureStats();
      const s = measured2.stats;
      ℓ = adaptAperture(ℓ, s.C, s.N);

      // Update novelty prior
      const alpha = 0.02;
      const currHist = new Array(headingBins).fill(0);
      for (let i = 0; i < measured2.headings.length; i++) currHist[measured2.headings[i]]++;
      for (let i = 0; i < headingBins; i++) {
        currHist[i] = currHist[i] / measured2.headings.length;
        priorHist[i] = (1 - alpha) * priorHist[i] + alpha * currHist[i];
      }

      historyC.push(s.C); if (historyC.length > 600) historyC.shift();
      receipts.push({ t: performance.now(), C: s.C, I: s.I, K: s.K, N: s.N });
      if (receipts.length > 2000) receipts.shift();

      draw(ctx, particles, measured2.graph, s, ℓ, measured2.compSizes);
    }

    function draw(
      ctx: CanvasRenderingContext2D,
      particles: Particle[],
      graph: Uint16Array[],
      s: Stats,
      ℓ: number,
      compSizes: number[],
    ) {
      ctx.fillStyle = "rgba(6,8,16,0.85)";
      ctx.fillRect(0, 0, W(), H());

      // Attractor glow (camera) — faint
      for (const A of camAttractors) {
        const r = 20 + A.w * 60;
        const g = ctx.createRadialGradient(A.x, A.y, 0, A.x, A.y, r);
        g.addColorStop(0, `rgba(180,200,255,${0.12 * A.w})`);
        g.addColorStop(1, `rgba(180,200,255,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(A.x, A.y, r, 0, Math.PI * 2); ctx.fill();
      }

      // Interaction graph filaments
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const neigh = graph[i];
        for (let j = 0; j < neigh.length; j++) {
          const k = neigh[j]; if (k <= i) continue;
          const q = particles[k];
          const dx = q.x - p.x, dy = q.y - p.y;
          const d = Math.hypot(dx, dy);
          const t = 1 - clamp(d / ℓ, 0, 1);
          const hue = (p.hue * 0.5 + q.hue * 0.5) % 360;
          const alpha = 0.06 + 0.35 * t * t;
          ctx.strokeStyle = `hsla(${hue},80%,65%,${alpha})`;
          ctx.lineWidth = 0.3 + 1.8 * t * t;
          ctx.beginPath();
          const mx = (p.x + q.x) / 2 + (Math.random() - 0.5) * 2;
          const my = (p.y + q.y) / 2 + (Math.random() - 0.5) * 2;
          ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(mx, my, q.x, q.y); ctx.stroke();
        }
      }

      // Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.save(); ctx.translate(p.x, p.y);
        const sp = Math.hypot(p.vx, p.vy);
        const r = 1.2 + 1.2 * Math.min(1, sp);
        ctx.shadowBlur = 8 * (0.3 + sp * 0.2);
        ctx.shadowColor = `hsla(${p.hue},90%,70%,0.35)`;
        ctx.fillStyle = `hsla(${p.hue},85%,72%,0.9)`;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.restore();
      }

      // HUD — order-parameters, aperture, sensors
      const gcr = Math.max(...compSizes) / particles.length;
      const panelX = 16, panelY = 16;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(panelX - 8, panelY - 8, 332, 140);
      ctx.fillStyle = "#cfe7ff";
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(`C (coherence): ${s.C.toFixed(3)}`, panelX, panelY + 12);
      ctx.fillText(`I (integration): ${s.I.toFixed(3)}  (giant: ${gcr.toFixed(3)})`, panelX, panelY + 28);
      ctx.fillText(`K (complexity): ${s.K.toFixed(3)}`, panelX, panelY + 44);
      ctx.fillText(`N (novelty):    ${s.N.toFixed(3)}`, panelX, panelY + 60);
      ctx.fillText(`ℓ (aperture):   ${ℓ.toFixed(2)}`, panelX, panelY + 76);
      ctx.fillText(`Input energy:   ${inputEnergy.toFixed(3)}`, panelX, panelY + 92);
      ctx.fillText(`Cam motion/brt: ${motionEMA.toFixed(2)} / ${brightnessEMA.toFixed(2)}`, panelX, panelY + 108);
      ctx.fillText(`Mic vol/cent:   ${volumeEMA.toFixed(2)} / ${centroidEMA.toFixed(2)}`, panelX, panelY + 124);
    }

    // ---------------------- Main animation loop ------------------------------
    let last = performance.now();
    const tick = () => {
      animRef.current = requestAnimationFrame(tick);
      if (paused) return;
      const now = performance.now();
      const dt = Math.min(1 / 15, (now - last) / 1000);
      last = now;
      stepLoop(dt);
    };
    tick();

    // Expose start/stop to window for UI handlers below
    (window as any).__Ω_startCam = startCamera;
    (window as any).__Ω_stopCam = stopCamera;
    (window as any).__Ω_startMic = startMic;
    (window as any).__Ω_stopMic = stopMic;

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      stopCamera();
      stopMic();
    };
  }, [paused]);

  // ---------------------- UI overlay -----------------------------------------
  return (
    <div className="w-screen h-screen bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />

      <div className="fixed top-3 right-3 flex items-center gap-2 text-xs text-white/90 bg-black/50 backdrop-blur px-3 py-2 rounded-xl border border-white/10 shadow-lg">
        <button
          onClick={() => setPaused((p) => !p)}
          className="px-3 py-1 rounded-lg border border-white/20 hover:border-white/40 active:scale-[0.98]"
        >{paused ? "Resume" : "Pause"}</button>
        <span className="opacity-75">Loop = center • No scripted levels</span>
      </div>

      <div className="fixed bottom-3 left-3 flex flex-wrap items-center gap-2 text-xs text-white/90 bg-black/50 backdrop-blur px-3 py-2 rounded-xl border border-white/10 shadow-lg">
        <button
          onClick={() => {
            if ((window as any).__Ω_startCam) (window as any).__Ω_startCam();
          }}
          className="px-3 py-1 rounded-lg border border-white/20 hover:border-white/40"
        >Enable Camera</button>
        <button
          onClick={() => { if ((window as any).__Ω_stopCam) (window as any).__Ω_stopCam(); }}
          className="px-3 py-1 rounded-lg border border-white/20 hover:border-white/40"
        >Disable Camera</button>
        <button
          onClick={() => { if ((window as any).__Ω_startMic) (window as any).__Ω_startMic(); }}
          className="px-3 py-1 rounded-lg border border-white/20 hover:border-white/40"
        >Enable Mic</button>
        <button
          onClick={() => { if ((window as any).__Ω_stopMic) (window as any).__Ω_stopMic(); }}
          className="px-3 py-1 rounded-lg border border-white/20 hover:border-white/40"
        >Disable Mic</button>
      </div>
    </div>
  );
}
