/* GPS animated background engine
   Three subtle, premium canvas treatments:
   - aurora    : drifting multi-color gradient blobs
   - network   : constellation of nodes + connecting lines
   - meridian  : rotating globe of dots with great-circle arcs
   All respect prefers-reduced-motion, pause when tab hidden,
   and accept a palette + intensity + parallax offset.
*/
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);

  class GPSBackground {
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.opts = Object.assign(
        { mode: 'aurora', palette: [], intensity: 1, reduced: false },
        opts || {}
      );
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = 0;
      this.h = 0;
      this.t = 0;
      this.scrollY = 0;
      this.running = false;
      this._raf = null;
      this._build();
      this._resize();
      window.addEventListener('resize', () => this._resize());
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stop();
        else this.start();
      });
    }

    setScroll(y) { this.scrollY = y; }

    setMode(mode) {
      if (mode === this.opts.mode) return;
      this.opts.mode = mode;
      this._build();
      this._resize();
    }

    setPalette(p) { this.opts.palette = p; this._build(); }
    setIntensity(v) { this.opts.intensity = v; }
    setReduced(v) { this.opts.reduced = v; }

    _resize() {
      const r = this.canvas.getBoundingClientRect();
      this.w = Math.max(1, r.width);
      this.h = Math.max(1, r.height);
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      if (this.opts.mode === 'network') this._buildNodes();
      if (this.opts.mode === 'meridian') this.globeR = Math.min(this.w, this.h) * 0.34;
      if (this.opts.reduced || !this.running) this._renderOnce();
    }

    _build() {
      const m = this.opts.mode;
      if (m === 'aurora') this._buildAurora();
      else if (m === 'network') this._buildNodes();
      else if (m === 'meridian') this._buildGlobe();
    }

    /* ---------- AURORA ---------- */
    _buildAurora() {
      const pal = this.opts.palette;
      const n = 6;
      this.blobs = [];
      for (let i = 0; i < n; i++) {
        this.blobs.push({
          x: Math.random(),
          y: Math.random(),
          r: rand(0.35, 0.7),
          color: pal[i % pal.length],
          sx: rand(-0.018, 0.018),
          sy: rand(-0.014, 0.014),
          ph: rand(0, TAU),
          pr: rand(0.04, 0.09)
        });
      }
    }

    _drawAurora(dt) {
      const ctx = this.ctx, W = this.w, H = this.h;
      ctx.clearRect(0, 0, W, H);
      const move = this.opts.reduced ? 0 : dt;
      const par = this.scrollY * 0.06;
      ctx.globalCompositeOperation = 'lighter';
      for (const b of this.blobs) {
        if (!this.opts.reduced) {
          b.x += b.sx * move * this.opts.intensity;
          b.y += b.sy * move * this.opts.intensity;
          if (b.x < -0.2) b.x = 1.2; if (b.x > 1.2) b.x = -0.2;
          if (b.y < -0.2) b.y = 1.2; if (b.y > 1.2) b.y = -0.2;
          b.ph += b.pr * move;
        }
        const pulse = 1 + Math.sin(b.ph) * 0.12;
        const cx = b.x * W;
        const cy = b.y * H - par;
        const rad = b.r * Math.max(W, H) * 0.62 * pulse;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, this._rgba(b.color, 0.55 * this.opts.intensity));
        g.addColorStop(0.45, this._rgba(b.color, 0.18 * this.opts.intensity));
        g.addColorStop(1, this._rgba(b.color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    /* ---------- NETWORK ---------- */
    _buildNodes() {
      const pal = this.opts.palette.length ? this.opts.palette : ['#ffffff'];
      const area = this.w * this.h;
      const count = Math.max(28, Math.min(90, Math.round(area / 22000)));
      this.nodes = [];
      for (let i = 0; i < count; i++) {
        this.nodes.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: rand(-0.18, 0.18),
          vy: rand(-0.18, 0.18),
          r: rand(1.1, 2.6),
          color: pal[i % pal.length],
          tw: rand(0, TAU)
        });
      }
    }

    _drawNetwork(dt) {
      const ctx = this.ctx, W = this.w, H = this.h;
      ctx.clearRect(0, 0, W, H);
      const par = this.scrollY * 0.08;
      const move = this.opts.reduced ? 0 : dt;
      const maxD = Math.min(W, H) * 0.18;
      const nodes = this.nodes;
      for (const n of nodes) {
        n.x += n.vx * move * this.opts.intensity;
        n.y += n.vy * move * this.opts.intensity;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.x = Math.max(0, Math.min(W, n.x));
        n.y = Math.max(0, Math.min(H, n.y));
        n.tw += 0.03 * move;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = (a.y - b.y);
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            const al = (1 - d / maxD) * 0.5 * this.opts.intensity;
            const grad = ctx.createLinearGradient(a.x, a.y - par, b.x, b.y - par);
            grad.addColorStop(0, this._rgba(a.color, al));
            grad.addColorStop(1, this._rgba(b.color, al));
            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y - par);
            ctx.lineTo(b.x, b.y - par);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const tw = 0.6 + Math.sin(n.tw) * 0.4;
        ctx.fillStyle = this._rgba(n.color, 0.9 * tw);
        ctx.shadowColor = this._rgba(n.color, 0.9);
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(n.x, n.y - par, n.r, 0, TAU);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    /* ---------- MERIDIAN GLOBE ---------- */
    _buildGlobe() {
      const N = 520;
      this.points = [];
      // fibonacci sphere
      const off = 2 / N;
      const inc = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = i * off - 1 + off / 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const phi = i * inc;
        this.points.push({ x: Math.cos(phi) * r, y: y, z: Math.sin(phi) * r });
      }
      this.rot = 0;
      this._buildArcs();
    }

    _spherePt() {
      const u = Math.random() * TAU;
      const v = Math.acos(2 * Math.random() - 1);
      return { x: Math.sin(v) * Math.cos(u), y: Math.cos(v), z: Math.sin(v) * Math.sin(u) };
    }

    _buildArcs() {
      const pal = this.opts.palette.length ? this.opts.palette : ['#ffffff'];
      this.arcs = [];
      for (let i = 0; i < 7; i++) {
        this.arcs.push({
          a: this._spherePt(),
          b: this._spherePt(),
          color: pal[i % pal.length],
          p: Math.random(),
          sp: rand(0.0016, 0.0036),
          life: rand(0.6, 1)
        });
      }
    }

    _slerp(a, b, t) {
      let dot = a.x * b.x + a.y * b.y + a.z * b.z;
      dot = Math.max(-1, Math.min(1, dot));
      const om = Math.acos(dot);
      if (om < 1e-4) return a;
      const so = Math.sin(om);
      const s0 = Math.sin((1 - t) * om) / so;
      const s1 = Math.sin(t * om) / so;
      // lift along normal for great-circle "arc" bow
      const lift = 1 + Math.sin(t * Math.PI) * 0.16;
      return {
        x: (a.x * s0 + b.x * s1) * lift,
        y: (a.y * s0 + b.y * s1) * lift,
        z: (a.z * s0 + b.z * s1) * lift
      };
    }

    _rotY(p, ang) {
      const c = Math.cos(ang), s = Math.sin(ang);
      return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
    }
    _rotX(p, ang) {
      const c = Math.cos(ang), s = Math.sin(ang);
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
    }

    _drawGlobe(dt) {
      const ctx = this.ctx, W = this.w, H = this.h;
      ctx.clearRect(0, 0, W, H);
      const move = this.opts.reduced ? 0 : dt;
      this.rot += 0.0016 * move * this.opts.intensity;
      const R = this.globeR || Math.min(W, H) * 0.34;
      const cx = W * 0.5;
      const cy = H * 0.5 - this.scrollY * 0.05;
      const tilt = -0.42;
      const pal = this.opts.palette;
      const baseColor = pal[pal.length - 1] || '#7B5CFF';

      // faint disc glow
      const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
      halo.addColorStop(0, this._rgba(baseColor, 0.10));
      halo.addColorStop(1, this._rgba(baseColor, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.5, 0, TAU);
      ctx.fill();

      // dots
      for (const p0 of this.points) {
        let p = this._rotY(p0, this.rot);
        p = this._rotX(p, tilt);
        const depth = (p.z + 1) / 2; // 0 back .. 1 front
        const sx = cx + p.x * R;
        const sy = cy + p.y * R;
        const size = lerp(0.5, 2.0, depth);
        const alpha = lerp(0.06, 0.6, depth);
        const col = pal[Math.floor((p0.x * 0.5 + 0.5) * pal.length) % pal.length] || baseColor;
        ctx.fillStyle = this._rgba(col, alpha);
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, TAU);
        ctx.fill();
      }

      // arcs
      ctx.lineCap = 'round';
      for (const arc of this.arcs) {
        if (!this.opts.reduced) {
          arc.p += arc.sp * move;
          if (arc.p > 1) { arc.p = 0; arc.a = this._spherePt(); arc.b = this._spherePt(); }
        }
        const segs = 36;
        const head = arc.p;
        const tail = Math.max(0, head - 0.42);
        let prev = null;
        for (let s = 0; s <= segs; s++) {
          const t = tail + (head - tail) * (s / segs);
          let q = this._slerp(arc.a, arc.b, t);
          q = this._rotY(q, this.rot);
          q = this._rotX(q, tilt);
          const sx = cx + q.x * R;
          const sy = cy + q.y * R;
          const front = (q.z + 1) / 2;
          if (prev) {
            const segAlpha = (s / segs) * arc.life * lerp(0.15, 1, front);
            ctx.strokeStyle = this._rgba(arc.color, segAlpha);
            ctx.lineWidth = lerp(0.6, 1.8, s / segs);
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }
          prev = { x: sx, y: sy };
        }
        // comet head
        if (prev) {
          let q = this._slerp(arc.a, arc.b, head);
          q = this._rotY(q, this.rot); q = this._rotX(q, tilt);
          const front = (q.z + 1) / 2;
          ctx.fillStyle = this._rgba(arc.color, 0.9 * lerp(0.2, 1, front));
          ctx.shadowColor = this._rgba(arc.color, 0.9);
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(cx + q.x * R, cy + q.y * R, 2.2, 0, TAU);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.lineCap = 'butt';
    }

    /* ---------- shared ---------- */
    _rgba(hex, a) {
      if (!hex) return `rgba(255,255,255,${a})`;
      const h = hex.replace('#', '');
      const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
      const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      return `rgba(${r},${g},${b},${a})`;
    }

    _renderOnce() {
      const m = this.opts.mode;
      if (m === 'aurora') this._drawAurora(0);
      else if (m === 'network') this._drawNetwork(0);
      else if (m === 'meridian') this._drawGlobe(0);
    }

    _frame(now) {
      if (!this.running) return;
      if (!this._last) this._last = now;
      let dt = (now - this._last) / 16.666; // ~ frames
      this._last = now;
      dt = Math.min(dt, 3);
      const m = this.opts.mode;
      if (m === 'aurora') this._drawAurora(dt);
      else if (m === 'network') this._drawNetwork(dt);
      else if (m === 'meridian') this._drawGlobe(dt);
      this._raf = requestAnimationFrame((t) => this._frame(t));
    }

    start() {
      if (this.running) return;
      if (this.opts.reduced) { this._renderOnce(); return; }
      this.running = true;
      this._last = 0;
      this._raf = requestAnimationFrame((t) => this._frame(t));
    }

    stop() {
      this.running = false;
      if (this._raf) cancelAnimationFrame(this._raf);
    }
  }

  window.GPSBackground = GPSBackground;
})();
