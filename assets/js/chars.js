/* Tribia — personnages vivants (Canvas 2D).
   Port du dessin des figurines de la marque (brand/lib.js) pour le site. */
(function () {
  'use strict';
  var C = { cream: '#FFF6E9', ink: '#2B2140', coral: '#FF6B5B', violet: '#7B5CFF', mint: '#2EC4A0', sun: '#FFC53D', sky: '#4DA8FF', pink: '#FF8FB8' };
  var F = 'Nunito, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
  var x = null; // contexte courant

  function rr(X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
  function sc(X, Y, s, fn) { x.save(); x.translate(X, Y); x.scale(s, s); fn(); x.restore(); }

  var R = {
    ceo: { uni: '#2B2140', tie: C.coral, m: '👑', hair: '#2A1C14', hs: 3, skin: '#E8B48F', seed: 1 },
    sup: { uni: C.violet, m: '📋', hair: '#6B3E26', hs: 1, skin: '#F5C9A8', seed: 2, glasses: true },
    max: { uni: C.sky, m: '🔎', hair: '#1E1E2E', hs: 2, skin: '#C98E6A', seed: 3 },
    lea: { uni: C.coral, m: '✉️', hair: '#B5562B', hs: 1, skin: '#F7D2B6', seed: 4 },
    zoe: { uni: C.mint, m: '📊', hair: '#2E1B12', hs: 0, skin: '#8D5B3E', seed: 5 },
    sam: { uni: C.sun, m: '📣', hair: '#E0B04B', hs: 3, skin: '#F5C9A8', seed: 6 },
    ali: { uni: C.pink, m: '⚙️', hair: '#2B2B2B', hs: 0, skin: '#D9A07C', seed: 7, glasses: true },
    maj: { uni: '#5A4FCF', m: '🏠', hair: '#9A9A9A', hs: 3, skin: '#F0C29E', seed: 8, tie: C.sun },
    tut: { uni: C.mint, m: '📚', hair: '#5B3A29', hs: 1, skin: '#E2AC84', seed: 9, glasses: true },
    chef: { uni: '#fff', pants: '#2B2140', m: '🍳', hair: '#3B2A20', hs: 0, skin: '#C98E6A', seed: 10, chef: true },
    fin: { uni: C.sun, m: '💰', hair: '#1E1E2E', hs: 2, skin: '#F5C9A8', seed: 11 },
    kid: { uni: C.sky, m: '⭐', hair: '#3B2A20', hs: 2, skin: '#F5C9A8', seed: 12, pants: '#4DA8FF' },
    you: { uni: C.sun, m: '🙂', hair: '#1E1E2E', hs: 3, skin: '#D9A07C', seed: 13 }
  };
  function U(k, ex) { var o = {}, b = R[k] || R.max, p; for (p in b) o[p] = b[p]; if (ex) for (p in ex) o[p] = ex[p]; return o; }

  function chr(X, Y, s, o, t) {
    if (s <= 0.001) return;
    var bob = o.walk ? -Math.abs(Math.sin(t * 16)) * 6 : Math.sin(t * 4 + (o.seed || 0)) * 3 * (o.still ? 0 : 1);
    x.save(); x.translate(X, Y); x.scale(s, s);
    x.fillStyle = 'rgba(43,33,64,.13)'; x.beginPath(); x.ellipse(0, 2, 52, 11, 0, 0, 7); x.fill();
    x.translate(0, bob);
    var lw = o.walk ? Math.sin(t * 16) * 8 : 0; x.fillStyle = o.pants || '#3A3257';
    rr(-30, -38 - Math.max(0, lw), 24, 38, 10); x.fill(); rr(6, -38 - Math.max(0, -lw), 24, 38, 10); x.fill();
    x.fillStyle = o.uni || C.coral; rr(-46, -118, 92, 88, 30); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.moveTo(-20, -118); x.lineTo(0, -96); x.lineTo(20, -118); x.closePath(); x.fill();
    if (o.tie) { x.fillStyle = o.tie; x.beginPath(); x.moveTo(-6, -104); x.lineTo(6, -104); x.lineTo(9, -66); x.lineTo(0, -56); x.lineTo(-9, -66); x.closePath(); x.fill(); }
    if (o.m) { x.fillStyle = '#fff'; x.beginPath(); x.arc(24, -76, 17, 0, 7); x.fill(); x.font = '22px ' + F; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(o.m, 24, -74); }
    var skin = o.skin || '#F5C9A8';
    var wv = o.wave ? Math.sin(t * 10 + (o.seed || 0)) * 0.5 : 0;
    x.save(); x.translate(-46, -100); x.rotate(o.wave ? -2.3 + wv : 0.25); x.fillStyle = o.uni || C.coral; rr(-11, 0, 22, 44, 11); x.fill(); x.fillStyle = skin; x.beginPath(); x.arc(0, 46, 11, 0, 7); x.fill(); x.restore();
    var ra = o.knock ? 2.3 + Math.max(0, Math.sin(t * 12)) * 0.5 : (o.type ? -0.9 + Math.sin(t * 18) * 0.15 : -0.25);
    x.save(); x.translate(46, -100); x.rotate(ra); x.fillStyle = o.uni || C.coral; rr(-11, 0, 22, 44, 11); x.fill(); x.fillStyle = skin; x.beginPath(); x.arc(0, 46, 11, 0, 7); x.fill(); x.restore();
    var hy = -168;
    x.fillStyle = skin; x.beginPath(); x.arc(0, hy, 52, 0, 7); x.fill();
    x.fillStyle = o.hair || '#3B2A20';
    x.beginPath(); x.arc(0, hy - 6, 54, Math.PI * 1.02, Math.PI * 1.98); x.closePath(); x.fill();
    if (o.hs === 1) { x.beginPath(); x.arc(-44, hy + 8, 16, 0, 7); x.arc(44, hy + 8, 16, 0, 7); x.fill(); }
    if (o.hs === 2) { x.beginPath(); x.arc(30, hy - 48, 18, 0, 7); x.fill(); }
    if (o.hs === 3) { x.beginPath(); x.ellipse(0, hy - 50, 40, 14, 0, 0, 7); x.fill(); }
    if (o.crown) { x.fillStyle = C.sun; x.beginPath(); x.moveTo(-30, hy - 50); x.lineTo(-30, hy - 80); x.lineTo(-15, hy - 64); x.lineTo(0, hy - 88); x.lineTo(15, hy - 64); x.lineTo(30, hy - 80); x.lineTo(30, hy - 50); x.closePath(); x.fill(); }
    if (o.chef) { x.fillStyle = '#fff'; rr(-34, hy - 92, 68, 40, 16); x.fill(); x.beginPath(); x.arc(-22, hy - 88, 20, 0, 7); x.arc(0, hy - 98, 24, 0, 7); x.arc(22, hy - 88, 20, 0, 7); x.fill(); }
    var bl = o.sleep || ((t + (o.seed || 0) * 0.37) % 3.3) < 0.12;
    x.fillStyle = C.ink;
    if (bl) { x.fillRect(-24, hy + 2, 14, 4); x.fillRect(10, hy + 2, 14, 4); }
    else { x.beginPath(); x.arc(-17, hy + 3, 7, 0, 7); x.arc(17, hy + 3, 7, 0, 7); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(-15, hy, 2.5, 0, 7); x.arc(19, hy, 2.5, 0, 7); x.fill(); }
    if (o.glasses) { x.strokeStyle = C.ink; x.lineWidth = 4; x.beginPath(); x.arc(-17, hy + 3, 14, 0, 7); x.moveTo(31, hy + 3); x.arc(17, hy + 3, 14, 0, 7); x.moveTo(-3, hy + 3); x.lineTo(3, hy + 3); x.stroke(); }
    if (o.sleep) { var zz = (t * 0.8 + (o.seed || 0) * 0.3) % 1; x.save(); x.globalAlpha *= 1 - zz; x.font = '800 ' + (26 + zz * 14) + 'px ' + F; x.fillStyle = C.violet; x.textAlign = 'center'; x.fillText('z', 48 + zz * 30, hy - 60 - zz * 50); x.restore(); }
    x.fillStyle = 'rgba(255,107,91,.35)'; x.beginPath(); x.arc(-32, hy + 20, 9, 0, 7); x.arc(32, hy + 20, 9, 0, 7); x.fill();
    x.fillStyle = C.ink;
    if (o.talk && Math.sin(t * 22 + (o.seed || 0)) > 0) { x.beginPath(); x.ellipse(0, hy + 24, 9, 8, 0, 0, 7); x.fill(); }
    else { x.strokeStyle = C.ink; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.arc(0, hy + 16, 11, 0.2 * Math.PI, 0.8 * Math.PI); x.stroke(); }
    x.restore();
  }

  function desk(X, Y, s, t, glow, on) {
    sc(X, Y, s, function () {
      x.fillStyle = '#3A3257'; rr(-58, -150, 116, 78, 10); x.fill();
      x.fillStyle = on ? glow : '#5C5478'; rr(-50, -142, 100, 62, 6); x.fill();
      if (on) { x.fillStyle = 'rgba(255,255,255,.8)'; for (var i = 0; i < 3; i++) { var ww = 30 + ((Math.sin(t * 3 + i * 2 + X) * 0.5 + 0.5) * 50); rr(-40, -132 + i * 18, ww, 8, 4); x.fill(); } }
      x.fillStyle = '#3A3257'; x.fillRect(-8, -72, 16, 22);
      x.fillStyle = '#B98455'; rr(-110, -56, 220, 24, 8); x.fill();
      x.fillStyle = '#9A6B40'; x.fillRect(-100, -32, 20, 32); x.fillRect(80, -32, 20, 32);
      x.fillStyle = '#A87548'; rr(-100, -36, 200, 14, 4); x.fill();
    });
  }
  function plant(X, Y, s) { sc(X, Y, s, function () { x.fillStyle = C.mint; for (var i = -2; i <= 2; i++) { x.save(); x.rotate(i * 0.35); x.beginPath(); x.ellipse(0, -70, 14, 40, 0, 0, 7); x.fill(); x.restore(); } x.fillStyle = C.coral; rr(-26, -40, 52, 40, 10); x.fill(); }); }

  /* ---------- Scène du héros : bureau + maison ---------- */
  function heroScene(w, h, t) {
    // logique 1200x760
    var S = Math.min(w / 1200, h / 760); var ox = (w - 1200 * S) / 2, oy = (h - 760 * S) / 2;
    x.save(); x.translate(ox, oy); x.scale(S, S);
    // bâtiment bureau (gauche)
    x.fillStyle = 'rgba(43,33,64,.08)'; rr(20, 70, 690, 640, 40); x.fill();
    x.fillStyle = '#FFE9D6'; rr(14, 58, 690, 640, 40); x.fill();
    x.save(); rr(14, 58, 690, 640, 40); x.clip();
    x.fillStyle = '#F2CFA8'; x.fillRect(14, 520, 690, 180);
    x.fillStyle = '#E6BE93'; for (var i = 0; i < 9; i++) x.fillRect(14 + i * 80, 520, 3, 180);
    // fenêtres
    for (var k = 0; k < 3; k++) { x.fillStyle = '#3A3257'; rr(70 + k * 210, 120, 160, 150, 14); x.fill(); x.fillStyle = 'rgba(160,210,255,.35)'; rr(80 + k * 210, 130, 140, 130, 10); x.fill(); x.fillStyle = 'rgba(255,255,255,.5)'; for (var b = 0; b < 4; b++) { var bh = 30 + ((b * 37 + k * 19) % 60); x.fillRect(92 + k * 210 + b * 30, 250 - bh, 18, bh); } }
    // tableau objectif
    x.fillStyle = '#fff'; rr(230, 300, 260, 96, 14); x.fill();
    var goals = [C.mint, C.sun, C.coral]; for (var g = 0; g < 3; g++) { var gh = 22 + (Math.sin(t * 1.4 + g) * 0.5 + 0.5) * 38; x.fillStyle = goals[g]; rr(270 + g * 70, 380 - gh, 40, gh, 6); x.fill(); }
    desk(130, 520, 0.9, t, C.sky, true); desk(360, 520, 0.9, t, C.coral, true); desk(590, 520, 0.9, t, C.mint, true);
    plant(40, 700, 0.8);
    x.restore();
    // maison (droite)
    x.fillStyle = 'rgba(43,33,64,.08)'; rr(756, 262, 430, 450, 34); x.fill();
    x.fillStyle = '#FFF1EE'; rr(750, 250, 430, 450, 34); x.fill();
    x.fillStyle = C.coral; x.beginPath(); x.moveTo(720, 268); x.lineTo(965, 90); x.lineTo(1210, 268); x.closePath(); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(965, 200, 34, 0, 7); x.fill(); x.font = '36px ' + F; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('🏠', 965, 202);
    x.save(); rr(750, 250, 430, 450, 34); x.clip();
    x.fillStyle = '#F7D9C4'; x.fillRect(750, 560, 430, 140);
    x.fillStyle = C.violet; rr(790, 470, 170, 70, 20); x.fill(); x.fillStyle = '#9C85FF'; rr(800, 450, 150, 40, 16); x.fill();
    x.fillStyle = '#3A3257'; rr(1010, 300, 130, 96, 12); x.fill(); x.fillStyle = 'rgba(160,210,255,.4)'; rr(1020, 310, 110, 76, 8); x.fill();
    x.restore();
    // personnages — bureau
    var ceoTalk = (t % 6) < 2.4;
    chr(130, 600, 0.78, U('max', { type: true }), t);
    chr(360, 600, 0.78, U('lea', { type: true }), t);
    chr(590, 600, 0.78, U('zoe', { type: true }), t);
    chr(470, 690, 0.95, U('sup', { talk: (t % 6) > 3 && (t % 6) < 4.6 }), t);
    chr(250, 700, 1.08, U('ceo', { crown: true, wave: !ceoTalk, talk: ceoTalk }), t);
    // personnages — maison
    chr(860, 650, 0.9, U('maj', { wave: (t % 7) > 4.5, talk: (t % 7) > 2 && (t % 7) < 4 }), t);
    chr(990, 660, 0.78, U('chef'), t);
    chr(1095, 665, 0.7, U('kid', { wave: true }), t);
    x.restore();
  }

  /* ---------- Rangée de personnages : data-chars="ceo+crown+wave sup max" ---------- */
  function parse(spec) {
    return spec.trim().split(/\s+/).map(function (tok) {
      var parts = tok.split('+'), ex = {};
      parts.slice(1).forEach(function (f) { ex[f] = true; });
      return U(parts[0], ex);
    });
  }
  function lineup(w, h, t, list) {
    var n = list.length, s = Math.min(h / 285, (w / n) / 120), gap = w / n;
    for (var i = 0; i < n; i++) chr(gap * (i + 0.5), h - 6 * s, s, list[i], t + i * 0.3);
  }

  var items = [];
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }

  function setup(cv) {
    var it = { cv: cv, ctx: cv.getContext('2d'), visible: true, kind: cv.getAttribute('data-scene') || 'lineup', list: null };
    if (it.kind === 'lineup') it.list = parse(cv.getAttribute('data-chars') || 'ceo+crown');
    if (!it.ctx) return;
    items.push(it); size(it);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { it.visible = e.isIntersecting; }); }).observe(cv);
    }
  }
  function size(it) {
    var r = it.cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
    it.w = Math.max(1, r.width); it.h = Math.max(1, r.height);
    it.cv.width = Math.round(it.w * d); it.cv.height = Math.round(it.h * d); it.d = d;
  }
  function draw(it, t) {
    x = it.ctx; x.setTransform(it.d, 0, 0, it.d, 0, 0); x.clearRect(0, 0, it.w, it.h);
    if (it.kind === 'hero') heroScene(it.w, it.h, t); else lineup(it.w, it.h, t, it.list);
  }
  var t0 = performance.now();
  function frame(now) {
    var t = (now - t0) / 1000;
    for (var i = 0; i < items.length; i++) if (items[i].visible) draw(items[i], t);
    if (!reduce) requestAnimationFrame(frame);
  }
  function init() {
    var cvs = document.querySelectorAll('canvas[data-chars], canvas[data-scene]');
    for (var i = 0; i < cvs.length; i++) setup(cvs[i]);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { items.forEach(function (it) { size(it); draw(it, reduce ? 1.3 : (performance.now() - t0) / 1000); }); }, 120); });
    if (reduce) items.forEach(function (it) { draw(it, 1.3); }); else requestAnimationFrame(frame);
  }
  window.TribiaChars = { init: init, refresh: function () { items.forEach(function (it) { size(it); it.visible = true; draw(it, reduce ? 1.3 : (performance.now() - t0) / 1000); }); } };
})();
