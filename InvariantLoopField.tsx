import React, { useEffect, useRef } from "react";

/**

LeonardoWaveHuman.tsx

Ω-Loop visual: Φ_{n+1} = ℰ([ICE]_ℓ(∇Φ_n)) in a human-outline cavity.

A wave (ψ) is emitted from the body's center of mass and propagates.


Boundary = Vitruvian-style human outline (Path2D). Waves reflect (Neumann-like) at the outline.


A learning map accumulates |ψ| over time → reveals persistent interference structures (tissue-like layers).


Controls: none (self-running). Click to re-seed a pulse at the click position (if inside the outline). */ export default function LeonardoWaveHuman() { const canvasRef = useRef<HTMLCanvasElement | null>(null);


useEffect(() => { const canvas = canvasRef.current!; const ctx = canvas.getContext("2d")!;

// -- sizing ---------------------------------------------------------------
const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
const resize = () => {
  canvas.width = Math.floor(window.innerWidth * DPR);
  canvas.height = Math.floor(window.innerHeight * DPR);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  initDomain();
};
window.addEventListener("resize", resize);

// -- simulation params ----------------------------------------------------
const params = {
  grid: 360, // simulation grid (square)
  damping: 0.997, // global damping (slight)
  c2: 0.25, // wave speed squared coefficient
  learnDecay: 0.995, // persistence of learned field
  learnGain: 0.02, // amount to add per frame
  outlineStroke: "rgba(220,235,255,0.85)",
};

// domain arrays
let W = 0, H = 0, dx = 1;
let ψ = new Float32Array(0);
let ψprev = new Float32Array(0);
let inside: Uint8Array; // 1 if cell center is inside human outline
let learn = new Float32Array(0); // accumulated |ψ|

// cached Path2D for human outline
let bodyPath: Path2D;

// build outline path in normalized unit-space, then scale to canvas
function makeBodyPath(w: number, h: number): Path2D {
  // Use a portrait-aligned box centered on screen
  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) * 0.38; // fits comfortably

  // A simplified Vitruvian-like outline assembled from curves:
  // head (circle), neck, torso, pelvis, arms out, legs out
  const p = new Path2D();

  // Helper to draw symmetric bezier from left to right with control points
  const moveTo = (x: number, y: number) => p.moveTo(cx + x * scale, cy + y * scale);
  const lineTo = (x: number, y: number) => p.lineTo(cx + x * scale, cy + y * scale);
  const bezier = (
    x1: number, y1: number,
    c1x: number, c1y: number,
    c2x: number, c2y: number,
    x2: number, y2: number
  ) => p.bezierCurveTo(
    cx + c1x * scale, cy + c1y * scale,
    cx + c2x * scale, cy + c2y * scale,
    cx + x2 * scale, cy + y2 * scale
  );

  // Head
  p.arc(cx, cy - 0.44 * scale, 0.09 * scale, 0, Math.PI * 2);

  // Neck to shoulders (small gap between head and torso is fine visually)
  moveTo(-0.08, -0.33);
  bezier(0.08, -0.33, -0.05, -0.29, 0.05, -0.29, 0.08, -0.33);

  // Torso outer (left down)
  moveTo(-0.18, -0.33);
  bezier(-0.24, -0.05, -0.24, -0.25, -0.28, -0.10, -0.25, 0.00);
  // Rib to waist (left inner curve)
  bezier(-0.17, 0.10, -0.24, 0.07, -0.18, 0.18, -0.14, 0.22);
  // Pelvis top
  bezier(-0.12, 0.26, -0.13, 0.24, -0.10, 0.28, -0.08, 0.29);

  // Mirror to right using separate path segments
  moveTo(0.18, -0.33);
  bezier(0.24, -0.05, 0.24, -0.25, 0.28, -0.10, 0.25, 0.00);
  bezier(0.17, 0.10, 0.24, 0.07, 0.18, 0.18, 0.14, 0.22);
  bezier(0.12, 0.26, 0.13, 0.24, 0.10, 0.28, 0.08, 0.29);

  // Close pelvis band
  moveTo(-0.08, 0.29); lineTo(0.08, 0.29);

  // Arms (left): shoulder → elbow → wrist (slightly above shoulder level, outward)
  moveTo(-0.18, -0.30);
  bezier(-0.45, -0.32, -0.32, -0.28, -0.48, -0.18, -0.52, -0.12);
  // forearm to hand (left)
  bezier(-0.56, -0.05, -0.58, -0.02, -0.56, 0.00, -0.54, 0.02);

  // Arms (right)
  moveTo(0.18, -0.30);
  bezier(0.45, -0.32, 0.32, -0.28, 0.48, -0.18, 0.52, -0.12);
  bezier(0.56, -0.05, 0.58, -0.02, 0.56, 0.00, 0.54, 0.02);

  // Legs (left): pelvis → knee → ankle (outward stance)
  moveTo(-0.06, 0.30);
  bezier(-0.12, 0.55, -0.12, 0.40, -0.18, 0.62, -0.20, 0.72);
  bezier(-0.22, 0.82, -0.22, 0.86, -0.18, 0.90, -0.14, 0.90);

  // Legs (right)
  moveTo(0.06, 0.30);
  bezier(0.12, 0.55, 0.12, 0.40, 0.18, 0.62, 0.20, 0.72);
  bezier(0.22, 0.82, 0.22, 0.86, 0.18, 0.90, 0.14, 0.90);

  // Hands and feet small arcs
  p.arc(cx - 0.54 * scale, cy + 0.02 * scale, 0.015 * scale, 0, Math.PI * 2);
  p.arc(cx + 0.54 * scale, cy + 0.02 * scale, 0.015 * scale, 0, Math.PI * 2);
  p.arc(cx - 0.14 * scale, cy + 0.90 * scale, 0.018 * scale, 0, Math.PI * 2);
  p.arc(cx + 0.14 * scale, cy + 0.90 * scale, 0.018 * scale, 0, Math.PI * 2);

  return p;
}

// initialize arrays & mask
function initDomain() {
  W = canvas.width / DPR; H = canvas.height / DPR;
  const N = params.grid; dx = Math.min(W, H) / N;
  ψ = new Float32Array(N * N);
  ψprev = new Float32Array(N * N);
  learn = new Float32Array(N * N);
  inside = new Uint8Array(N * N);

  bodyPath = makeBodyPath(W, H);

  // rasterize inside-mask at grid centers
  for (let j = 0; j < N; j++) {
    const y = (j + 0.5) * dx;
    for (let i = 0; i < N; i++) {
      const x = (i + 0.5) * dx;
      inside[j * N + i] = ctx.isPointInPath(bodyPath, x, y) ? 1 : 0;
    }
  }

  // seed wave at approximate center of mass (around navel)
  const seed = worldToIndex(W * 0.5, H * 0.52);
  ψ[seed] = 1.0;
  ψprev[seed] = 0.8;
}

const idx = (i: number, j: number, N: number) => j * N + i;

function worldToIndex(x: number, y: number) {
  const i = Math.max(0, Math.min(params.grid - 1, Math.floor(x / dx)));
  const j = Math.max(0, Math.min(params.grid - 1, Math.floor(y / dx)));
  return j * params.grid + i;
}

// wave update with reflective boundary when neighbor is outside
function step() {
  const N = params.grid;
  const next = new Float32Array(ψ.length);
  const c2 = params.c2;
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const k = idx(i, j, N);
      if (!inside[k]) { next[k] = 0; continue; }

      // neighbor sampling with reflection: if neighbor outside, mirror current cell (Neumann-like)
      const leftK = idx(i - 1, j, N);
      const rightK = idx(i + 1, j, N);
      const upK = idx(i, j - 1, N);
      const downK = idx(i, j + 1, N);

      const ψL = inside[leftK] ? ψ[leftK] : ψ[k];
      const ψR = inside[rightK] ? ψ[rightK] : ψ[k];
      const ψU = inside[upK] ? ψ[upK] : ψ[k];
      const ψD = inside[downK] ? ψ[downK] : ψ[k];

      const lap = (ψL + ψR + ψU + ψD - 4 * ψ[k]);
      // standard 2nd-order wave eq discrete form
      const val = (2 * ψ[k] - ψprev[k]) + c2 * lap;
      next[k] = val * params.damping;

      // learning: accumulate magnitude slowly
      learn[k] = learn[k] * params.learnDecay + Math.min(1, Math.abs(val)) * params.learnGain;
    }
  }
  ψprev = ψ;
  ψ = next;
}

function draw() {
  const N = params.grid;
  const image = ctx.createImageData(Math.floor(W), Math.floor(H));
  const data = image.data;

  // paint pixels by nearest grid cell (fast, blocky aesthetic smoothed by device scaling)
  for (let j = 0; j < N; j++) {
    const y0 = Math.floor(j * dx), y1 = Math.min(Math.floor((j + 1) * dx), Math.floor(H));
    for (let i = 0; i < N; i++) {
      const x0 = Math.floor(i * dx), x1 = Math.min(Math.floor((i + 1) * dx), Math.floor(W));
      const k = j * N + i;
      const insideCell = inside[k] === 1;

      // base wave (cool blue), learned layer (warm gold)
      const a = Math.abs(ψ[k]);
      const L = learn[k];
      const wave = Math.min(1, a * 3);
      const learned = Math.min(1, L * 3);

      const r = Math.floor(255 * (0.15 * wave + 0.95 * learned));
      const g = Math.floor(255 * (0.45 * wave + 0.75 * learned));
      const b = Math.floor(255 * (0.95 * wave + 0.10 * learned));
      const alpha = insideCell ? 255 : 0; // keep background transparent outside

      for (let y = y0; y < y1; y++) {
        let p = (y * Math.floor(W) + x0) * 4;
        for (let x = x0; x < x1; x++) {
          data[p] = r; data[p + 1] = g; data[p + 2] = b; data[p + 3] = alpha; p += 4;
        }
      }
    }
  }

  ctx.clearRect(0, 0, W, H);
  ctx.putImageData(image, 0, 0);

  // outline glow
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = params.outlineStroke;
  ctx.shadowBlur = 12;
  ctx.shadowColor = "rgba(180,200,255,0.6)";
  ctx.stroke(bodyPath);
  ctx.restore();
}

// animate ---------------------------------------------------------------
let raf = 0;
const loop = () => {
  step();
  draw();
  raf = requestAnimationFrame(loop);
};

// click to re-seed a pulse (if inside)
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left);
  const y = (e.clientY - rect.top);
  if (ctx.isPointInPath(bodyPath, x, y)) {
    const k = worldToIndex(x, y);
    ψ[k] = 1.0;
  }
});

resize();
loop();

return () => {
  cancelAnimationFrame(raf);
  window.removeEventListener("resize", resize);
};

}, []);

return ( <div className="w-screen h-screen bg-black"> <canvas ref={canvasRef} className="block mx-auto" /> <div className="fixed left-4 bottom-4 text-xs text-slate-300/80 select-none"> Ω Leonardo Wave · click inside the body to inject a pulse </div> </div> ); }

