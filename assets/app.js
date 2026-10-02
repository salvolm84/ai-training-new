/* ==========================================================================
   AI Foundations — shared shell + helpers.  Plain ES5-ish JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var PARTS = [
    { k: 'I',   name: 'Foundations',       note: 'How it works' },
    { k: 'II',  name: 'Engineering it',    note: 'How you build and prove it' },
    { k: 'III', name: 'Applying it',       note: 'How it lands in the organisation' }
  ];

  var PAGES = [
    { id: 'index', n: '',   file: 'index.html',        short: 'Overview',        title: 'Course overview', part: null, mins: 0 },

    { id: 'p1',  n: '1',  file: '01-history.html',    short: 'History & jargon', title: 'What AI actually is', part: 0, mins: 30 },
    { id: 'p2',  n: '2',  file: '02-perceptron.html', short: 'The perceptron',   title: 'The perceptron', part: 0, mins: 30 },
    { id: 'p3',  n: '3',  file: '03-networks.html',   short: 'Networks',         title: 'From neuron to network', part: 0, mins: 45 },
    { id: 'p4',  n: '4',  file: '04-llm.html',        short: 'LLMs',             title: 'How an LLM works', part: 0, mins: 60 },
    { id: 'p5',  n: '5',  file: '05-cost.html',       short: 'Energy & cost',    title: 'The bill', part: 0, mins: 40 },

    { id: 'p6',  n: '6',  file: '06-classical.html',  short: 'Classical ML',     title: 'Beyond neural networks', part: 1, mins: 50 },
    { id: 'p7',  n: '7',  file: '07-data.html',       short: 'Data',             title: 'Data: where projects are won and lost', part: 1, mins: 45 },
    { id: 'p8',  n: '8',  file: '08-evaluation.html', short: 'Evaluation',       title: 'Evaluation: proving it works', part: 1, mins: 50 },
    { id: 'p9',  n: '9',  file: '09-agents.html',     short: 'Agents & tools',   title: 'Agents and tool use', part: 1, mins: 45 },
    { id: 'p10', n: '10', file: '10-governance.html', short: 'Governance',       title: 'Governance, security and the AI Act', part: 1, mins: 45 },

    { id: 'p11', n: '11', file: '11-engineering.html',short: 'Engineering use',  title: 'AI in engineering and simulation', part: 2, mins: 50 },
    { id: 'p12', n: '12', file: '12-prompting.html',  short: 'Prompting lab',    title: 'Prompting: a working skill', part: 2, mins: 60 },
    { id: 'p13', n: '13', file: '13-human.html',      short: 'Human factors',    title: 'Human factors and adoption', part: 2, mins: 40 },
    { id: 'p14', n: '14', file: '14-limits.html',     short: 'Limits',           title: 'Limits and open questions', part: 2, mins: 35 },
    { id: 'p15', n: '15', file: '15-capstone.html',   short: 'Capstone',         title: 'Capstone: your own use case', part: 2, mins: 75 }
  ];

  /* ---------------- theme ---------------- */

  var THEME_KEY = 'aisem-theme', NOTES_KEY = 'aisem-notes';

  function readLS(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function writeLS(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var b = document.getElementById('themeBtn');
    if (b) { b.textContent = t === 'dark' ? '☀' : '◐'; b.title = t === 'dark' ? 'Switch to light' : 'Switch to dark'; }
  }

  function applyNotes(on) {
    document.body.classList.toggle('notes-on', !!on);
    var b = document.getElementById('notesBtn');
    if (b) { b.classList.toggle('on', !!on); b.title = on ? 'Hide speaker notes' : 'Show speaker notes'; }
  }

  /* ---------------- shell ---------------- */

  function buildShell() {
    var cur = document.body.getAttribute('data-page') || 'index';
    var idx = -1, i;
    for (i = 0; i < PAGES.length; i++) if (PAGES[i].id === cur) idx = i;

    var bar = document.createElement('div');
    bar.className = 'topbar';
    var html = '<div class="topbar-in">' +
      '<a class="brand" href="index.html"><span class="dot"></span><span>AI Foundations</span></a>' +
      '<nav class="navlinks">';
    var lastPart = -1;
    for (i = 1; i < PAGES.length; i++) {
      var p = PAGES[i];
      if (p.part !== lastPart) {
        if (lastPart !== -1) html += '<span class="navsep"></span>';
        lastPart = p.part;
      }
      var isCur = p.id === cur;
      html += '<a href="' + p.file + '"' + (isCur ? ' class="current"' : '') +
        ' title="' + PARTS[p.part].k + ' · ' + p.n + '. ' + p.title + '">' +
        '<span class="num">' + p.n + '</span>' +
        (isCur ? '<span class="label">' + p.short + '</span>' : '') + '</a>';
    }
    html += '</nav>' +
      '<button class="iconbtn" id="notesBtn" title="Speaker notes">✎</button>' +
      '<button class="iconbtn" id="themeBtn" title="Theme">◐</button>' +
      '</div>';
    bar.innerHTML = html;
    document.body.insertBefore(bar, document.body.firstChild);

    document.getElementById('themeBtn').addEventListener('click', function () {
      var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      writeLS(THEME_KEY, t); applyTheme(t);
      window.dispatchEvent(new CustomEvent('themechange'));
    });
    document.getElementById('notesBtn').addEventListener('click', function () {
      var on = !document.body.classList.contains('notes-on');
      writeLS(NOTES_KEY, on ? '1' : '0'); applyNotes(on);
    });

    /* prev / next footer */
    var foot = document.querySelector('.pagefoot .footnav');
    if (foot && idx > -1) {
      var prev = idx > 0 ? PAGES[idx - 1] : null;
      var next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
      var f = '';
      if (prev) f += '<a href="' + prev.file + '"><span class="dir">← Previous</span><span class="ttl">' +
        (prev.n ? prev.n + '. ' : '') + prev.short + '</span></a>'; else f += '<span></span>';
      if (next) f += '<a href="' + next.file + '" style="text-align:right"><span class="dir">Next →</span><span class="ttl">' +
        (next.n ? next.n + '. ' : '') + next.short + '</span></a>';
      foot.innerHTML = f;
    }

    /* keyboard: n = notes, t = theme, arrows = page nav */
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var tg = e.target.tagName;
      if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
      if (e.key === 'n') document.getElementById('notesBtn').click();
      else if (e.key === 't') document.getElementById('themeBtn').click();
      else if (e.key === 'ArrowRight' && idx > -1 && idx < PAGES.length - 1) location.href = PAGES[idx + 1].file;
      else if (e.key === 'ArrowLeft' && idx > 0) location.href = PAGES[idx - 1].file;
    });
  }

  /* ---------------- number formatting ---------------- */

  var F = {
    n: function (x, d) {
      if (!isFinite(x)) return '—';
      d = d == null ? 0 : d;
      return x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    },
    /* compact: 12.3k, 4.5M, 1.2B, 3.4T */
    c: function (x) {
      var a = Math.abs(x), s = x < 0 ? '-' : '';
      if (a >= 1e12) return s + (a / 1e12).toFixed(a / 1e12 < 10 ? 2 : 1) + 'T';
      if (a >= 1e9) return s + (a / 1e9).toFixed(a / 1e9 < 10 ? 2 : 1) + 'B';
      if (a >= 1e6) return s + (a / 1e6).toFixed(a / 1e6 < 10 ? 2 : 1) + 'M';
      if (a >= 1e3) return s + (a / 1e3).toFixed(a / 1e3 < 10 ? 1 : 0) + 'k';
      if (a >= 10) return s + a.toFixed(0);
      if (a >= 1) return s + a.toFixed(1);
      if (a === 0) return '0';
      return s + a.toPrecision(2);
    },
    /* scientific with superscript, e.g. 3.8 x 10^25 */
    sci: function (x, d) {
      if (x === 0) return '0';
      d = d == null ? 1 : d;
      var e = Math.floor(Math.log10(Math.abs(x)));
      var m = x / Math.pow(10, e);
      if (m.toFixed(d) === (10).toFixed(d)) { m = 1; e += 1; }
      return m.toFixed(d) + '×' + '10' + F.sup(e);
    },
    sup: function (n) {
      var map = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³',
        '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
      return String(n).split('').map(function (c) { return map[c] || c; }).join('');
    },
    pct: function (x, d) { return (x * 100).toFixed(d == null ? 0 : d) + '%'; }
  };

  /* ---------------- range binding ---------------- */
  /* <div class="ctrl"><div class="ctrl-label"><span>Label</span><span class="val" id="xOut"></span></div>
       <input type="range" id="x" ...></div>  →  bindRange('x', fmtFn, onChange)  */
  function bindRange(id, fmt, onChange) {
    var el = document.getElementById(id);
    if (!el) return null;
    var out = document.getElementById(id + 'Out');
    function upd() {
      var v = parseFloat(el.value);
      if (out) out.textContent = fmt ? fmt(v) : v;
      if (onChange) onChange(v);
    }
    el.addEventListener('input', upd);
    upd();
    return { el: el, update: upd, get: function () { return parseFloat(el.value); },
      set: function (v) { el.value = v; upd(); } };
  }

  /* ---------------- canvas plot helper ---------------- */

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';
  }

  function Plot(canvas, opts) {
    opts = opts || {};
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.pad = opts.pad || { l: 42, r: 14, t: 14, b: 34 };
    this.dom = opts.dom || [0, 1];
    this.ran = opts.ran || [0, 1];
    this.resize();
  }
  Plot.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    var w = this.c.clientWidth || parseInt(this.c.getAttribute('width'), 10) || 400;
    var h = this.c.clientHeight || parseInt(this.c.getAttribute('height'), 10) || 300;
    this.c.width = Math.round(w * dpr);
    this.c.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
    this.pw = w - this.pad.l - this.pad.r;
    this.ph = h - this.pad.t - this.pad.b;
  };
  Plot.prototype.X = function (v) {
    return this.pad.l + (v - this.dom[0]) / (this.dom[1] - this.dom[0]) * this.pw;
  };
  Plot.prototype.Y = function (v) {
    return this.pad.t + this.ph - (v - this.ran[0]) / (this.ran[1] - this.ran[0]) * this.ph;
  };
  Plot.prototype.iX = function (px) {
    return this.dom[0] + (px - this.pad.l) / this.pw * (this.dom[1] - this.dom[0]);
  };
  Plot.prototype.iY = function (py) {
    return this.ran[0] + (this.pad.t + this.ph - py) / this.ph * (this.ran[1] - this.ran[0]);
  };
  Plot.prototype.clear = function () {
    var g = this.ctx;
    g.clearRect(0, 0, this.w, this.h);
    g.fillStyle = cssVar('--panel');
    g.fillRect(0, 0, this.w, this.h);
  };
  Plot.prototype.frame = function (o) {
    o = o || {};
    var g = this.ctx, i;
    g.strokeStyle = cssVar('--line-2'); g.lineWidth = 1;
    var xt = o.xticks || 5, yt = o.yticks || 5;
    g.font = '11px ui-monospace, monospace';
    g.fillStyle = cssVar('--ink-3');
    g.textAlign = 'center'; g.textBaseline = 'top';
    for (i = 0; i <= xt; i++) {
      var xv = this.dom[0] + (this.dom[1] - this.dom[0]) * i / xt, px = this.X(xv);
      g.beginPath(); g.moveTo(px, this.pad.t); g.lineTo(px, this.pad.t + this.ph); g.stroke();
      g.fillText(o.xfmt ? o.xfmt(xv) : (Math.round(xv * 100) / 100), px, this.pad.t + this.ph + 6);
    }
    g.textAlign = 'right'; g.textBaseline = 'middle';
    for (i = 0; i <= yt; i++) {
      var yv = this.ran[0] + (this.ran[1] - this.ran[0]) * i / yt, py = this.Y(yv);
      g.beginPath(); g.moveTo(this.pad.l, py); g.lineTo(this.pad.l + this.pw, py); g.stroke();
      g.fillText(o.yfmt ? o.yfmt(yv) : (Math.round(yv * 100) / 100), this.pad.l - 7, py);
    }
    g.strokeStyle = cssVar('--line'); g.lineWidth = 1.2;
    g.strokeRect(this.pad.l, this.pad.t, this.pw, this.ph);
    if (o.xlabel) {
      g.fillStyle = cssVar('--ink-3'); g.textAlign = 'center'; g.textBaseline = 'bottom';
      g.font = '600 11px ' + 'system-ui, sans-serif';
      g.fillText(o.xlabel, this.pad.l + this.pw / 2, this.h - 1);
    }
    if (o.ylabel) {
      g.save(); g.translate(11, this.pad.t + this.ph / 2); g.rotate(-Math.PI / 2);
      g.fillStyle = cssVar('--ink-3'); g.textAlign = 'center'; g.textBaseline = 'top';
      g.font = '600 11px system-ui, sans-serif';
      g.fillText(o.ylabel, 0, 0); g.restore();
    }
  };
  Plot.prototype.line = function (pts, color, width, dash) {
    var g = this.ctx;
    if (!pts.length) return;
    g.save();
    g.beginPath();
    g.setLineDash(dash || []);
    g.strokeStyle = color; g.lineWidth = width || 2; g.lineJoin = 'round';
    for (var i = 0; i < pts.length; i++) {
      var px = this.X(pts[i][0]), py = this.Y(pts[i][1]);
      if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.stroke(); g.restore();
  };
  Plot.prototype.dot = function (x, y, r, fill, stroke) {
    var g = this.ctx;
    g.beginPath(); g.arc(this.X(x), this.Y(y), r, 0, 6.2832);
    g.fillStyle = fill; g.fill();
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.6; g.stroke(); }
  };
  Plot.prototype.clip = function (fn) {
    var g = this.ctx;
    g.save(); g.beginPath();
    g.rect(this.pad.l, this.pad.t, this.pw, this.ph); g.clip();
    fn(g); g.restore();
  };

  /* ---------------- shared MLP (same maths as module 3) ---------------- */

  var ACTF = {
    tanh:    { f: function (z) { return Math.tanh(z); }, d: function (a) { return 1 - a * a; } },
    relu:    { f: function (z) { return z > 0 ? z : 0; }, d: function (a) { return a > 0 ? 1 : 0; } },
    sigmoid: { f: function (z) { return 1 / (1 + Math.exp(-z)); }, d: function (a) { return a * (1 - a); } }
  };
  function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

  function MLP(sizes, act) { this.s = sizes.slice(); this.act = act || 'tanh'; this.init(); }
  MLP.prototype.init = function () {
    this.W = []; this.B = []; this.mW = []; this.mB = [];
    for (var l = 1; l < this.s.length; l++) {
      var nin = this.s[l - 1], nout = this.s[l], sc = Math.sqrt(2 / (nin + nout)) * 1.6;
      var W = [], Bv = [], mW = [], mB = [];
      for (var j = 0; j < nout; j++) {
        var row = [], mrow = [];
        for (var i = 0; i < nin; i++) { row.push((Math.random() * 2 - 1) * sc); mrow.push(0); }
        W.push(row); mW.push(mrow); Bv.push(0); mB.push(0);
      }
      this.W.push(W); this.B.push(Bv); this.mW.push(mW); this.mB.push(mB);
    }
  };
  MLP.prototype.nparams = function () {
    var n = 0;
    for (var l = 0; l < this.W.length; l++) n += this.W[l].length * (this.W[l][0].length + 1);
    return n;
  };
  MLP.prototype.forward = function (x) {
    var a = [x], L = this.W.length, fn = ACTF[this.act].f;
    for (var l = 0; l < L; l++) {
      var prev = a[l], W = this.W[l], Bv = this.B[l], out = [];
      for (var j = 0; j < W.length; j++) {
        var z = Bv[j], row = W[j];
        for (var i = 0; i < row.length; i++) z += row[i] * prev[i];
        out.push(l === L - 1 ? sigmoid(z) : fn(z));
      }
      a.push(out);
    }
    return a;
  };
  MLP.prototype.predict = function (x) { var a = this.forward(x); return a[a.length - 1][0]; };
  MLP.prototype.step = function (X, Y, lr, mom) {
    var L = this.W.length, n = X.length, dfn = ACTF[this.act].d, gW = [], gB = [], l, j, i;
    for (l = 0; l < L; l++) {
      var gw = [], gb = [];
      for (j = 0; j < this.W[l].length; j++) {
        var r = []; for (i = 0; i < this.W[l][j].length; i++) r.push(0);
        gw.push(r); gb.push(0);
      }
      gW.push(gw); gB.push(gb);
    }
    var loss = 0;
    for (var k = 0; k < n; k++) {
      var a = this.forward(X[k]), out = a[L][0], y = Y[k];
      loss += -(y * Math.log(Math.max(out, 1e-9)) + (1 - y) * Math.log(Math.max(1 - out, 1e-9)));
      var delta = [out - y];
      for (l = L - 1; l >= 0; l--) {
        var prev = a[l];
        for (j = 0; j < this.W[l].length; j++) {
          gB[l][j] += delta[j];
          for (i = 0; i < prev.length; i++) gW[l][j][i] += delta[j] * prev[i];
        }
        if (l > 0) {
          var nd = [];
          for (i = 0; i < prev.length; i++) {
            var s = 0;
            for (j = 0; j < this.W[l].length; j++) s += this.W[l][j][i] * delta[j];
            nd.push(s * dfn(prev[i]));
          }
          delta = nd;
        }
      }
    }
    mom = mom == null ? 0.9 : mom;
    for (l = 0; l < L; l++) {
      for (j = 0; j < this.W[l].length; j++) {
        for (i = 0; i < this.W[l][j].length; i++) {
          this.mW[l][j][i] = mom * this.mW[l][j][i] - lr * gW[l][j][i] / n;
          this.W[l][j][i] += this.mW[l][j][i];
        }
        this.mB[l][j] = mom * this.mB[l][j] - lr * gB[l][j] / n;
        this.B[l][j] += this.mB[l][j];
      }
    }
    return loss / n;
  };

  /* ---------------- tiny utils ---------------- */

  function qs(s, root) { return (root || document).querySelector(s); }
  function qsa(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  /* segmented control: <div class="segmented" data-seg="name"><button data-v="a" class="on">A</button>…</div> */
  function segmented(node, onPick) {
    var btns = qsa('button', node);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        onPick(b.getAttribute('data-v'), b);
      });
    });
    return {
      value: function () { var a = qs('button.on', node); return a && a.getAttribute('data-v'); },
      pick: function (v) { btns.forEach(function (b) { if (b.getAttribute('data-v') === v) b.click(); }); }
    };
  }

  /* re-draw registry: pages register redraw fns; we call them on theme change + resize */
  var redraws = [];
  function onRedraw(fn) { redraws.push(fn); }
  function fireRedraw() { redraws.forEach(function (f) { try { f(); } catch (e) {} }); }
  window.addEventListener('themechange', fireRedraw);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fireRedraw, 120); });

  /* ---------------- boot ---------------- */

  applyTheme(readLS(THEME_KEY) === 'dark' ? 'dark' : 'light');

  function boot() {
    buildShell();
    applyNotes(readLS(NOTES_KEY) === '1');
    if (window.PAGE_INIT) window.PAGE_INIT();
    setTimeout(fireRedraw, 60);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.AI = { F: F, Plot: Plot, bindRange: bindRange, cssVar: cssVar, qs: qs, qsa: qsa,
    on: on, segmented: segmented, onRedraw: onRedraw, fireRedraw: fireRedraw,
    PAGES: PAGES, PARTS: PARTS, readLS: readLS, writeLS: writeLS,
    MLP: MLP, sigmoid: sigmoid };
})();
