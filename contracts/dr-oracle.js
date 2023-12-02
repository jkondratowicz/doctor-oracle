const OPENAI_MODEL = 'gpt-3.5-turbo';
const HTTP_TIMEOUT = 9000;
const SIMULATE_RESPONSE = false;
const [inputCid, patientPublicKeyB64] = args;

// Secrets:
// - openAIApiKey
// - secretString
// - quickNodeApiKey

// Below is a modified version of the TweetNaCl.js library
// https://tweetnacl.js.org
const tweetnacl = {};
!(function ($) {
  'use strict';
  var e = function ($, e) {
      (this.hi = 0 | $), (this.lo = 0 | e);
    },
    n = function ($) {
      var e,
        n = new Float64Array(16);
      if ($) for (e = 0; e < $.length; e++) n[e] = $[e];
      return n;
    },
    r = function () {
      throw Error('no PRNG');
    },
    f = new Uint8Array(16),
    x = new Uint8Array(32);
  x[0] = 9;
  var o = n(),
    _ = n([1]),
    t = n([56129, 1]),
    c = n([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
    a = n([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
    b = n([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
    i = n([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
    u = n([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

  function w($, e) {
    return ($ << e) | ($ >>> (32 - e));
  }

  function d($, e) {
    var n = 255 & $[e + 3];
    return ((n = ((n = (n << 8) | (255 & $[e + 2])) << 8) | (255 & $[e + 1])) << 8) | (255 & $[e + 0]);
  }

  function h($, n) {
    var r = ($[n] << 24) | ($[n + 1] << 16) | ($[n + 2] << 8) | $[n + 3],
      f = ($[n + 4] << 24) | ($[n + 5] << 16) | ($[n + 6] << 8) | $[n + 7];
    return new e(r, f);
  }

  function l($, e, n) {
    var r;
    for (r = 0; r < 4; r++) ($[e + r] = 255 & n), (n >>>= 8);
  }

  function s($, e, n) {
    ($[e] = (n.hi >> 24) & 255),
      ($[e + 1] = (n.hi >> 16) & 255),
      ($[e + 2] = (n.hi >> 8) & 255),
      ($[e + 3] = 255 & n.hi),
      ($[e + 4] = (n.lo >> 24) & 255),
      ($[e + 5] = (n.lo >> 16) & 255),
      ($[e + 6] = (n.lo >> 8) & 255),
      ($[e + 7] = 255 & n.lo);
  }

  function y($, e, n, r, f) {
    var x,
      o = 0;
    for (x = 0; x < f; x++) o |= $[e + x] ^ n[r + x];
    return (1 & ((o - 1) >>> 8)) - 1;
  }

  function v($, e, n, r) {
    return y($, e, n, r, 16);
  }

  function g($, e, n, r) {
    return y($, e, n, r, 32);
  }

  function p($, e, n, r, f) {
    var x,
      o,
      _,
      t = new Uint32Array(16),
      c = new Uint32Array(16),
      a = new Uint32Array(16),
      b = new Uint32Array(4);
    for (x = 0; x < 4; x++) (c[5 * x] = d(r, 4 * x)), (c[1 + x] = d(n, 4 * x)), (c[6 + x] = d(e, 4 * x)), (c[11 + x] = d(n, 16 + 4 * x));
    for (x = 0; x < 16; x++) a[x] = c[x];
    for (x = 0; x < 20; x++) {
      for (o = 0; o < 4; o++) {
        for (_ = 0; _ < 4; _++) b[_] = c[(5 * o + 4 * _) % 16];
        for (
          b[1] ^= w((b[0] + b[3]) | 0, 7), b[2] ^= w((b[1] + b[0]) | 0, 9), b[3] ^= w((b[2] + b[1]) | 0, 13), b[0] ^= w((b[3] + b[2]) | 0, 18), _ = 0;
          _ < 4;
          _++
        )
          t[4 * o + ((o + _) % 4)] = b[_];
      }
      for (_ = 0; _ < 16; _++) c[_] = t[_];
    }
    if (f) {
      for (x = 0; x < 16; x++) c[x] = (c[x] + a[x]) | 0;
      for (x = 0; x < 4; x++) (c[5 * x] = (c[5 * x] - d(r, 4 * x)) | 0), (c[6 + x] = (c[6 + x] - d(e, 4 * x)) | 0);
      for (x = 0; x < 4; x++) l($, 4 * x, c[5 * x]), l($, 16 + 4 * x, c[6 + x]);
    } else for (x = 0; x < 16; x++) l($, 4 * x, (c[x] + a[x]) | 0);
  }

  function E($, e, n, r) {
    return p($, e, n, r, !1), 0;
  }

  function S($, e, n, r) {
    return p($, e, n, r, !0), 0;
  }

  var B = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);

  function K($, e, n, r, f, x, o) {
    var _,
      t,
      c = new Uint8Array(16),
      a = new Uint8Array(64);
    if (!f) return 0;
    for (t = 0; t < 16; t++) c[t] = 0;
    for (t = 0; t < 8; t++) c[t] = x[t];
    for (; f >= 64; ) {
      for (E(a, c, o, B), t = 0; t < 64; t++) $[e + t] = (n ? n[r + t] : 0) ^ a[t];
      for (t = 8, _ = 1; t < 16; t++) (_ = (_ + (255 & c[t])) | 0), (c[t] = 255 & _), (_ >>>= 8);
      (f -= 64), (e += 64), n && (r += 64);
    }
    if (f > 0) for (E(a, c, o, B), t = 0; t < f; t++) $[e + t] = (n ? n[r + t] : 0) ^ a[t];
    return 0;
  }

  function Y($, e, n, r, f) {
    return K($, e, null, 0, n, r, f);
  }

  function L($, e, n, r, f) {
    var x = new Uint8Array(32);
    return S(x, r, f, B), Y($, e, n, r.subarray(16), x);
  }

  function m($, e, n, r, f, x, o) {
    var _ = new Uint8Array(32);
    return S(_, x, o, B), K($, e, n, r, f, x.subarray(16), _);
  }

  function T($, e) {
    var n,
      r = 0;
    for (n = 0; n < 17; n++) (r = (r + (($[n] + e[n]) | 0)) | 0), ($[n] = 255 & r), (r >>>= 8);
  }

  var k = new Uint32Array([5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 252]);

  function z($, e, n, r, f, x) {
    var o,
      _,
      t,
      c,
      a = new Uint32Array(17),
      b = new Uint32Array(17),
      i = new Uint32Array(17),
      u = new Uint32Array(17),
      w = new Uint32Array(17);
    for (t = 0; t < 17; t++) b[t] = i[t] = 0;
    for (t = 0; t < 16; t++) b[t] = x[t];
    for (b[3] &= 15, b[4] &= 252, b[7] &= 15, b[8] &= 252, b[11] &= 15, b[12] &= 252, b[15] &= 15; f > 0; ) {
      for (t = 0; t < 17; t++) u[t] = 0;
      for (t = 0; t < 16 && t < f; ++t) u[t] = n[r + t];
      for (u[t] = 1, r += t, f -= t, T(i, u), _ = 0; _ < 17; _++)
        for (t = 0, a[_] = 0; t < 17; t++) a[_] = (a[_] + i[t] * (t <= _ ? b[_ - t] : (320 * b[_ + 17 - t]) | 0)) | 0;
      for (_ = 0; _ < 17; _++) i[_] = a[_];
      for (t = 0, c = 0; t < 16; t++) (c = (c + i[t]) | 0), (i[t] = 255 & c), (c >>>= 8);
      for (t = 0, c = (c + i[16]) | 0, i[16] = 3 & c, c = (5 * (c >>> 2)) | 0; t < 16; t++) (c = (c + i[t]) | 0), (i[t] = 255 & c), (c >>>= 8);
      (c = (c + i[16]) | 0), (i[16] = c);
    }
    for (t = 0; t < 17; t++) w[t] = i[t];
    for (T(i, k), o = 0 | -(i[16] >>> 7), t = 0; t < 17; t++) i[t] ^= o & (w[t] ^ i[t]);
    for (t = 0; t < 16; t++) u[t] = x[t + 16];
    for (u[16] = 0, T(i, u), t = 0; t < 16; t++) $[e + t] = i[t];
    return 0;
  }

  function R($, e, n, r, f, x) {
    var o = new Uint8Array(16);
    return z(o, 0, n, r, f, x), v($, e, o, 0);
  }

  function P($, e, n, r, f) {
    var x;
    if (n < 32) return -1;
    for (m($, 0, e, 0, n, r, f), z($, 16, $, 32, n - 32, $), x = 0; x < 16; x++) $[x] = 0;
    return 0;
  }

  function O($, e, n, r, f) {
    var x,
      o = new Uint8Array(32);
    if (n < 32 || (L(o, 0, 32, r, f), 0 !== R(e, 16, e, 32, n - 32, o))) return -1;
    for (m($, 0, e, 0, n, r, f), x = 0; x < 32; x++) $[x] = 0;
    return 0;
  }

  function N($, e) {
    var n;
    for (n = 0; n < 16; n++) $[n] = 0 | e[n];
  }

  function C($) {
    var e, n;
    for (n = 0; n < 16; n++)
      ($[n] += 65536), (e = Math.floor($[n] / 65536)), ($[(n + 1) * (n < 15 ? 1 : 0)] += e - 1 + 37 * (e - 1) * (15 === n ? 1 : 0)), ($[n] -= 65536 * e);
  }

  function M($, e, n) {
    for (var r, f = ~(n - 1), x = 0; x < 16; x++) (r = f & ($[x] ^ e[x])), ($[x] ^= r), (e[x] ^= r);
  }

  function Z($, e) {
    var r,
      f,
      x,
      o = n(),
      _ = n();
    for (r = 0; r < 16; r++) _[r] = e[r];
    for (C(_), C(_), C(_), f = 0; f < 2; f++) {
      for (r = 1, o[0] = _[0] - 65517; r < 15; r++) (o[r] = _[r] - 65535 - ((o[r - 1] >> 16) & 1)), (o[r - 1] &= 65535);
      (o[15] = _[15] - 32767 - ((o[14] >> 16) & 1)), (x = (o[15] >> 16) & 1), (o[14] &= 65535), M(_, o, 1 - x);
    }
    for (r = 0; r < 16; r++) ($[2 * r] = 255 & _[r]), ($[2 * r + 1] = _[r] >> 8);
  }

  function A($, e) {
    var n = new Uint8Array(32),
      r = new Uint8Array(32);
    return Z(n, $), Z(r, e), g(n, 0, r, 0);
  }

  function G($) {
    var e = new Uint8Array(32);
    return Z(e, $), 1 & e[0];
  }

  function U($, e) {
    var n;
    for (n = 0; n < 16; n++) $[n] = e[2 * n] + (e[2 * n + 1] << 8);
    $[15] &= 32767;
  }

  function D($, e, n) {
    var r;
    for (r = 0; r < 16; r++) $[r] = (e[r] + n[r]) | 0;
  }

  function I($, e, n) {
    var r;
    for (r = 0; r < 16; r++) $[r] = (e[r] - n[r]) | 0;
  }

  function X($, e, n) {
    var r,
      f,
      x = new Float64Array(31);
    for (r = 0; r < 31; r++) x[r] = 0;
    for (r = 0; r < 16; r++) for (f = 0; f < 16; f++) x[r + f] += e[r] * n[f];
    for (r = 0; r < 15; r++) x[r] += 38 * x[r + 16];
    for (r = 0; r < 16; r++) $[r] = x[r];
    C($), C($);
  }

  function F($, e) {
    X($, e, e);
  }

  function j($, e) {
    var r,
      f = n();
    for (r = 0; r < 16; r++) f[r] = e[r];
    for (r = 253; r >= 0; r--) F(f, f), 2 !== r && 4 !== r && X(f, f, e);
    for (r = 0; r < 16; r++) $[r] = f[r];
  }

  function q($, e) {
    var r,
      f = n();
    for (r = 0; r < 16; r++) f[r] = e[r];
    for (r = 250; r >= 0; r--) F(f, f), 1 !== r && X(f, f, e);
    for (r = 0; r < 16; r++) $[r] = f[r];
  }

  function H($, e, r) {
    var f,
      x,
      o = new Uint8Array(32),
      _ = new Float64Array(80),
      c = n(),
      a = n(),
      b = n(),
      i = n(),
      u = n(),
      w = n();
    for (x = 0; x < 31; x++) o[x] = e[x];
    for (o[31] = (127 & e[31]) | 64, o[0] &= 248, U(_, r), x = 0; x < 16; x++) (a[x] = _[x]), (i[x] = c[x] = b[x] = 0);
    for (x = 254, c[0] = i[0] = 1; x >= 0; --x)
      M(c, a, (f = (o[x >>> 3] >>> (7 & x)) & 1)),
        M(b, i, f),
        D(u, c, b),
        I(c, c, b),
        D(b, a, i),
        I(a, a, i),
        F(i, u),
        F(w, c),
        X(c, b, c),
        X(b, a, u),
        D(u, c, b),
        I(c, c, b),
        F(a, c),
        I(b, i, w),
        X(c, b, t),
        D(c, c, i),
        X(b, b, c),
        X(c, i, w),
        X(i, a, _),
        F(a, u),
        M(c, a, f),
        M(b, i, f);
    for (x = 0; x < 16; x++) (_[x + 16] = c[x]), (_[x + 32] = b[x]), (_[x + 48] = a[x]), (_[x + 64] = i[x]);
    var d = _.subarray(32),
      h = _.subarray(16);
    return j(d, d), X(h, h, d), Z($, h), 0;
  }

  function J($, e) {
    return H($, e, x);
  }

  function Q($, e) {
    return r(e, 32), J($, e);
  }

  function V($, e, n) {
    var r = new Uint8Array(32);
    return H(r, n, e), S($, f, r, B);
  }

  var W = P,
    $$ = O;

  function $e() {
    var $,
      n,
      r,
      f = 0,
      x = 0,
      o = 0,
      _ = 0;
    for (r = 0; r < arguments.length; r++) ($ = arguments[r].lo), (n = arguments[r].hi), (f += 65535 & $), (x += $ >>> 16), (o += 65535 & n), (_ += n >>> 16);
    return (x += f >>> 16), (o += x >>> 16), (_ += o >>> 16), new e((65535 & o) | (_ << 16), (65535 & f) | (x << 16));
  }

  function $n($, n) {
    return new e($.hi >>> n, ($.lo >>> n) | ($.hi << (32 - n)));
  }

  function $r() {
    var $,
      n = 0,
      r = 0;
    for ($ = 0; $ < arguments.length; $++) (n ^= arguments[$].lo), (r ^= arguments[$].hi);
    return new e(r, n);
  }

  function $f($, n) {
    var r,
      f,
      x = 32 - n;
    return (
      n < 32
        ? ((r = ($.hi >>> n) | ($.lo << x)), (f = ($.lo >>> n) | ($.hi << x)))
        : n < 64 && ((r = ($.lo >>> n) | ($.hi << x)), (f = ($.hi >>> n) | ($.lo << x))),
      new e(r, f)
    );
  }

  function $x($, n, r) {
    var f = ($.hi & n.hi) ^ (~$.hi & r.hi),
      x = ($.lo & n.lo) ^ (~$.lo & r.lo);
    return new e(f, x);
  }

  function $o($, n, r) {
    var f = ($.hi & n.hi) ^ ($.hi & r.hi) ^ (n.hi & r.hi),
      x = ($.lo & n.lo) ^ ($.lo & r.lo) ^ (n.lo & r.lo);
    return new e(f, x);
  }

  function $_($) {
    return $r($f($, 28), $f($, 34), $f($, 39));
  }

  function $t($) {
    return $r($f($, 14), $f($, 18), $f($, 41));
  }

  function $4($) {
    return $r($f($, 1), $f($, 8), $n($, 7));
  }

  function $c($) {
    return $r($f($, 19), $f($, 61), $n($, 6));
  }

  var $0 = [
    new e(1116352408, 3609767458),
    new e(1899447441, 602891725),
    new e(3049323471, 3964484399),
    new e(3921009573, 2173295548),
    new e(961987163, 4081628472),
    new e(1508970993, 3053834265),
    new e(2453635748, 2937671579),
    new e(2870763221, 3664609560),
    new e(3624381080, 2734883394),
    new e(310598401, 1164996542),
    new e(607225278, 1323610764),
    new e(1426881987, 3590304994),
    new e(1925078388, 4068182383),
    new e(2162078206, 991336113),
    new e(2614888103, 633803317),
    new e(3248222580, 3479774868),
    new e(3835390401, 2666613458),
    new e(4022224774, 944711139),
    new e(264347078, 2341262773),
    new e(604807628, 2007800933),
    new e(770255983, 1495990901),
    new e(1249150122, 1856431235),
    new e(1555081692, 3175218132),
    new e(1996064986, 2198950837),
    new e(2554220882, 3999719339),
    new e(2821834349, 766784016),
    new e(2952996808, 2566594879),
    new e(3210313671, 3203337956),
    new e(3336571891, 1034457026),
    new e(3584528711, 2466948901),
    new e(113926993, 3758326383),
    new e(338241895, 168717936),
    new e(666307205, 1188179964),
    new e(773529912, 1546045734),
    new e(1294757372, 1522805485),
    new e(1396182291, 2643833823),
    new e(1695183700, 2343527390),
    new e(1986661051, 1014477480),
    new e(2177026350, 1206759142),
    new e(2456956037, 344077627),
    new e(2730485921, 1290863460),
    new e(2820302411, 3158454273),
    new e(3259730800, 3505952657),
    new e(3345764771, 106217008),
    new e(3516065817, 3606008344),
    new e(3600352804, 1432725776),
    new e(4094571909, 1467031594),
    new e(275423344, 851169720),
    new e(430227734, 3100823752),
    new e(506948616, 1363258195),
    new e(659060556, 3750685593),
    new e(883997877, 3785050280),
    new e(958139571, 3318307427),
    new e(1322822218, 3812723403),
    new e(1537002063, 2003034995),
    new e(1747873779, 3602036899),
    new e(1955562222, 1575990012),
    new e(2024104815, 1125592928),
    new e(2227730452, 2716904306),
    new e(2361852424, 442776044),
    new e(2428436474, 593698344),
    new e(2756734187, 3733110249),
    new e(3204031479, 2999351573),
    new e(3329325298, 3815920427),
    new e(3391569614, 3928383900),
    new e(3515267271, 566280711),
    new e(3940187606, 3454069534),
    new e(4118630271, 4000239992),
    new e(116418474, 1914138554),
    new e(174292421, 2731055270),
    new e(289380356, 3203993006),
    new e(460393269, 320620315),
    new e(685471733, 587496836),
    new e(852142971, 1086792851),
    new e(1017036298, 365543100),
    new e(1126000580, 2618297676),
    new e(1288033470, 3409855158),
    new e(1501505948, 4234509866),
    new e(1607167915, 987167468),
    new e(1816402316, 1246189591),
  ];

  function $a($, e, n) {
    var r,
      f,
      x,
      o = [],
      _ = [],
      t = [],
      c = [];
    for (f = 0; f < 8; f++) o[f] = t[f] = h($, 8 * f);
    for (var a = 0; n >= 128; ) {
      for (f = 0; f < 16; f++) c[f] = h(e, 8 * f + a);
      for (f = 0; f < 80; f++) {
        for (x = 0; x < 8; x++) _[x] = t[x];
        for (
          x = 0, r = $e(t[7], $t(t[4]), $x(t[4], t[5], t[6]), $0[f], c[f % 16]), _[7] = $e(r, $_(t[0]), $o(t[0], t[1], t[2])), _[3] = $e(_[3], r);
          x < 8;
          x++
        )
          t[(x + 1) % 8] = _[x];
        if (f % 16 == 15) for (x = 0; x < 16; x++) c[x] = $e(c[x], c[(x + 9) % 16], $4(c[(x + 1) % 16]), $c(c[(x + 14) % 16]));
      }
      for (f = 0; f < 8; f++) (t[f] = $e(t[f], o[f])), (o[f] = t[f]);
      (a += 128), (n -= 128);
    }
    for (f = 0; f < 8; f++) s($, 8 * f, o[f]);
    return n;
  }

  var $1 = new Uint8Array([
    106, 9, 230, 103, 243, 188, 201, 8, 187, 103, 174, 133, 132, 202, 167, 59, 60, 110, 243, 114, 254, 148, 248, 43, 165, 79, 245, 58, 95, 29, 54, 241, 81, 14,
    82, 127, 173, 230, 130, 209, 155, 5, 104, 140, 43, 62, 108, 31, 31, 131, 217, 171, 251, 65, 189, 107, 91, 224, 205, 25, 19, 126, 33, 121,
  ]);

  function $b($, n, r) {
    var f,
      x = new Uint8Array(64),
      o = new Uint8Array(256),
      _ = r;
    for (f = 0; f < 64; f++) x[f] = $1[f];
    for ($a(x, n, r), r %= 128, f = 0; f < 256; f++) o[f] = 0;
    for (f = 0; f < r; f++) o[f] = n[_ - r + f];
    for (o[r] = 128, o[(r = 256 - 128 * (r < 112 ? 1 : 0)) - 9] = 0, s(o, r - 8, new e((_ / 536870912) | 0, _ << 3)), $a(x, o, r), f = 0; f < 64; f++)
      $[f] = x[f];
    return 0;
  }

  function $i($, e) {
    var r = n(),
      f = n(),
      x = n(),
      o = n(),
      _ = n(),
      t = n(),
      c = n(),
      b = n(),
      i = n();
    I(r, $[1], $[0]),
      I(i, e[1], e[0]),
      X(r, r, i),
      D(f, $[0], $[1]),
      D(i, e[0], e[1]),
      X(f, f, i),
      X(x, $[3], e[3]),
      X(x, x, a),
      X(o, $[2], e[2]),
      D(o, o, o),
      I(_, f, r),
      I(t, o, x),
      D(c, o, x),
      D(b, f, r),
      X($[0], _, t),
      X($[1], b, c),
      X($[2], c, t),
      X($[3], _, b);
  }

  function $2($, e, n) {
    var r;
    for (r = 0; r < 4; r++) M($[r], e[r], n);
  }

  function $u($, e) {
    var r = n(),
      f = n(),
      x = n();
    j(x, e[2]), X(r, e[0], x), X(f, e[1], x), Z($, f), ($[31] ^= G(r) << 7);
  }

  function $3($, e, n) {
    var r, f;
    for (N($[0], o), N($[1], _), N($[2], _), N($[3], o), f = 255; f >= 0; --f) $2($, e, (r = (n[(f / 8) | 0] >> (7 & f)) & 1)), $i(e, $), $i($, $), $2($, e, r);
  }

  function $w($, e) {
    var r = [n(), n(), n(), n()];
    N(r[0], b), N(r[1], i), N(r[2], _), X(r[3], b, i), $3($, r, e);
  }

  function $6($, e, f) {
    var x,
      o = new Uint8Array(64),
      _ = [n(), n(), n(), n()];
    for (f || r(e, 32), $b(o, e, 32), o[0] &= 248, o[31] &= 127, o[31] |= 64, $w(_, o), $u($, _), x = 0; x < 32; x++) e[x + 32] = $[x];
    return 0;
  }

  var $5 = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);

  function $d($, e) {
    var n, r, f, x;
    for (r = 63; r >= 32; --r) {
      for (n = 0, f = r - 32, x = r - 12; f < x; ++f) (e[f] += n - 16 * e[r] * $5[f - (r - 32)]), (n = Math.floor((e[f] + 128) / 256)), (e[f] -= 256 * n);
      (e[f] += n), (e[r] = 0);
    }
    for (f = 0, n = 0; f < 32; f++) (e[f] += n - (e[31] >> 4) * $5[f]), (n = e[f] >> 8), (e[f] &= 255);
    for (f = 0; f < 32; f++) e[f] -= n * $5[f];
    for (r = 0; r < 32; r++) (e[r + 1] += e[r] >> 8), ($[r] = 255 & e[r]);
  }

  function $h($) {
    var e,
      n = new Float64Array(64);
    for (e = 0; e < 64; e++) n[e] = $[e];
    for (e = 0; e < 64; e++) $[e] = 0;
    $d($, n);
  }

  function $l($, e, r, f) {
    var x,
      o,
      _ = new Uint8Array(64),
      t = new Uint8Array(64),
      c = new Uint8Array(64),
      a = new Float64Array(64),
      b = [n(), n(), n(), n()];
    for ($b(_, f, 32), _[0] &= 248, _[31] &= 127, _[31] |= 64, x = 0; x < r; x++) $[64 + x] = e[x];
    for (x = 0; x < 32; x++) $[32 + x] = _[32 + x];
    for ($b(c, $.subarray(32), r + 32), $h(c), $w(b, c), $u($, b), x = 32; x < 64; x++) $[x] = f[x];
    for ($b(t, $, r + 64), $h(t), x = 0; x < 64; x++) a[x] = 0;
    for (x = 0; x < 32; x++) a[x] = c[x];
    for (x = 0; x < 32; x++) for (o = 0; o < 32; o++) a[x + o] += t[x] * _[o];
    return $d($.subarray(32), a), r + 64;
  }

  function $s($, e, r, f) {
    var x,
      t,
      a,
      b,
      i,
      w,
      d,
      h,
      l,
      s,
      y = new Uint8Array(32),
      v = new Uint8Array(64),
      p = [n(), n(), n(), n()],
      E = [n(), n(), n(), n()];
    if (
      r < 64 ||
      ((x = E),
      (t = f),
      (a = n()),
      (b = n()),
      (i = n()),
      (w = n()),
      (d = n()),
      (h = n()),
      (l = n()),
      (N(x[2], _),
      U(x[1], t),
      F(i, x[1]),
      X(w, i, c),
      I(i, i, x[2]),
      D(w, x[2], w),
      F(d, w),
      F(h, d),
      X(l, h, d),
      X(a, l, i),
      X(a, a, w),
      q(a, a),
      X(a, a, i),
      X(a, a, w),
      X(a, a, w),
      X(x[0], a, w),
      F(b, x[0]),
      X(b, b, w),
      A(b, i) && X(x[0], x[0], u),
      F(b, x[0]),
      X(b, b, w),
      A(b, i))
        ? -1
        : (G(x[0]) === t[31] >> 7 && I(x[0], o, x[0]), X(x[3], x[0], x[1]), 0))
    )
      return -1;
    for (s = 0; s < r; s++) $[s] = e[s];
    for (s = 0; s < 32; s++) $[s + 32] = f[s];
    if (($b(v, $, r), $h(v), $3(p, E, v), $w(E, e.subarray(32)), $i(p, E), $u(y, p), (r -= 64), g(e, 0, y, 0))) {
      for (s = 0; s < r; s++) $[s] = 0;
      return -1;
    }
    for (s = 0; s < r; s++) $[s] = e[s + 64];
    return r;
  }

  function $7($, e) {
    if (32 !== $.length) throw Error('bad key size');
    if (24 !== e.length) throw Error('bad nonce size');
  }

  function $y() {
    for (var $ = 0; $ < arguments.length; $++) if (!(arguments[$] instanceof Uint8Array)) throw TypeError('unexpected type, use Uint8Array');
  }

  function $v($) {
    for (var e = 0; e < $.length; e++) $[e] = 0;
  }

  ($.lowlevel = {
    crypto_core_hsalsa20: S,
    crypto_stream_xor: m,
    crypto_stream: L,
    crypto_stream_salsa20_xor: K,
    crypto_stream_salsa20: Y,
    crypto_onetimeauth: z,
    crypto_onetimeauth_verify: R,
    crypto_verify_16: v,
    crypto_verify_32: g,
    crypto_secretbox: P,
    crypto_secretbox_open: O,
    crypto_scalarmult: H,
    crypto_scalarmult_base: J,
    crypto_box_beforenm: V,
    crypto_box_afternm: W,
    crypto_box: function $(e, n, r, f, x, o) {
      var _ = new Uint8Array(32);
      return V(_, x, o), W(e, n, r, f, _);
    },
    crypto_box_open: function $(e, n, r, f, x, o) {
      var _ = new Uint8Array(32);
      return V(_, x, o), $$(e, n, r, f, _);
    },
    crypto_box_keypair: Q,
    crypto_hash: $b,
    crypto_sign: $l,
    crypto_sign_keypair: $6,
    crypto_sign_open: $s,
    crypto_secretbox_KEYBYTES: 32,
    crypto_secretbox_NONCEBYTES: 24,
    crypto_secretbox_ZEROBYTES: 32,
    crypto_secretbox_BOXZEROBYTES: 16,
    crypto_scalarmult_BYTES: 32,
    crypto_scalarmult_SCALARBYTES: 32,
    crypto_box_PUBLICKEYBYTES: 32,
    crypto_box_SECRETKEYBYTES: 32,
    crypto_box_BEFORENMBYTES: 32,
    crypto_box_NONCEBYTES: 24,
    crypto_box_ZEROBYTES: 32,
    crypto_box_BOXZEROBYTES: 16,
    crypto_sign_BYTES: 64,
    crypto_sign_PUBLICKEYBYTES: 32,
    crypto_sign_SECRETKEYBYTES: 64,
    crypto_sign_SEEDBYTES: 32,
    crypto_hash_BYTES: 64,
    gf: n,
    D: c,
    L: $5,
    pack25519: Z,
    unpack25519: U,
    M: X,
    A: D,
    S: F,
    Z: I,
    pow2523: q,
    add: $i,
    set25519: N,
    modL: $d,
    scalarmult: $3,
    scalarbase: $w,
  }),
    ($.randomBytes = function ($) {
      var e = new Uint8Array($);
      return r(e, $), e;
    }),
    ($.secretbox = function ($, e, n) {
      $y($, e, n), $7(n, e);
      for (var r = new Uint8Array(32 + $.length), f = new Uint8Array(r.length), x = 0; x < $.length; x++) r[x + 32] = $[x];
      return P(f, r, r.length, e, n), f.subarray(16);
    }),
    ($.secretbox.open = function ($, e, n) {
      $y($, e, n), $7(n, e);
      for (var r = new Uint8Array(16 + $.length), f = new Uint8Array(r.length), x = 0; x < $.length; x++) r[x + 16] = $[x];
      return r.length < 32 || 0 !== O(f, r, r.length, e, n) ? null : f.subarray(32);
    }),
    ($.secretbox.keyLength = 32),
    ($.secretbox.nonceLength = 24),
    ($.secretbox.overheadLength = 16),
    ($.scalarMult = function ($, e) {
      if (($y($, e), 32 !== $.length)) throw Error('bad n size');
      if (32 !== e.length) throw Error('bad p size');
      var n = new Uint8Array(32);
      return H(n, $, e), n;
    }),
    ($.scalarMult.base = function ($) {
      if (($y($), 32 !== $.length)) throw Error('bad n size');
      var e = new Uint8Array(32);
      return J(e, $), e;
    }),
    ($.scalarMult.scalarLength = 32),
    ($.scalarMult.groupElementLength = 32),
    ($.box = function (e, n, r, f) {
      var x = $.box.before(r, f);
      return $.secretbox(e, n, x);
    }),
    ($.box.before = function ($, e) {
      $y($, e),
        (function $(e, n) {
          if (32 !== e.length) throw Error('bad public key size');
          if (32 !== n.length) throw Error('bad secret key size');
        })($, e);
      var n = new Uint8Array(32);
      return V(n, $, e), n;
    }),
    ($.box.after = $.secretbox),
    ($.box.open = function (e, n, r, f) {
      var x = $.box.before(r, f);
      return $.secretbox.open(e, n, x);
    }),
    ($.box.open.after = $.secretbox.open),
    ($.box.keyPair = function () {
      var $ = new Uint8Array(32),
        e = new Uint8Array(32);
      return Q($, e), { publicKey: $, secretKey: e };
    }),
    ($.box.keyPair.fromSecretKey = function ($) {
      if (($y($), 32 !== $.length)) throw Error('bad secret key size');
      var e = new Uint8Array(32);
      return J(e, $), { publicKey: e, secretKey: new Uint8Array($) };
    }),
    ($.box.publicKeyLength = 32),
    ($.box.secretKeyLength = 32),
    ($.box.sharedKeyLength = 32),
    ($.box.nonceLength = 24),
    ($.box.overheadLength = $.secretbox.overheadLength),
    ($.sign = function ($, e) {
      if (($y($, e), 64 !== e.length)) throw Error('bad secret key size');
      var n = new Uint8Array(64 + $.length);
      return $l(n, $, $.length, e), n;
    }),
    ($.sign.open = function ($, e) {
      if (($y($, e), 32 !== e.length)) throw Error('bad public key size');
      var n = new Uint8Array($.length),
        r = $s(n, $, $.length, e);
      if (r < 0) return null;
      for (var f = new Uint8Array(r), x = 0; x < f.length; x++) f[x] = n[x];
      return f;
    }),
    ($.sign.detached = function (e, n) {
      for (var r = $.sign(e, n), f = new Uint8Array(64), x = 0; x < f.length; x++) f[x] = r[x];
      return f;
    }),
    ($.sign.detached.verify = function ($, e, n) {
      if (($y($, e, n), 64 !== e.length)) throw Error('bad signature size');
      if (32 !== n.length) throw Error('bad public key size');
      var r,
        f = new Uint8Array(64 + $.length),
        x = new Uint8Array(64 + $.length);
      for (r = 0; r < 64; r++) f[r] = e[r];
      for (r = 0; r < $.length; r++) f[r + 64] = $[r];
      return $s(x, f, f.length, n) >= 0;
    }),
    ($.sign.keyPair = function () {
      var $ = new Uint8Array(32),
        e = new Uint8Array(64);
      return $6($, e), { publicKey: $, secretKey: e };
    }),
    ($.sign.keyPair.fromSecretKey = function ($) {
      if (($y($), 64 !== $.length)) throw Error('bad secret key size');
      for (var e = new Uint8Array(32), n = 0; n < e.length; n++) e[n] = $[32 + n];
      return { publicKey: e, secretKey: new Uint8Array($) };
    }),
    ($.sign.keyPair.fromSeed = function ($) {
      if (($y($), 32 !== $.length)) throw Error('bad seed size');
      for (var e = new Uint8Array(32), n = new Uint8Array(64), r = 0; r < 32; r++) n[r] = $[r];
      return $6(e, n, !0), { publicKey: e, secretKey: n };
    }),
    ($.sign.publicKeyLength = 32),
    ($.sign.secretKeyLength = 64),
    ($.sign.seedLength = 32),
    ($.sign.signatureLength = 64),
    ($.hash = function ($) {
      $y($);
      var e = new Uint8Array(64);
      return $b(e, $, $.length), e;
    }),
    ($.hash.hashLength = 64),
    ($.verify = function ($, e) {
      return $y($, e), 0 !== $.length && 0 !== e.length && $.length === e.length && 0 === y($, 0, e, 0, $.length);
    }),
    ($.setPRNG = function ($) {
      r = $;
    }),
    $.setPRNG(function ($, e) {
      for (let n = 0; n < e; n++) $[n] = Math.floor(1e10 * Math.random());
    });
})(tweetnacl);
const { box, randomBytes } = tweetnacl;
const newNonce = () => randomBytes(box.nonceLength);
const decodeUTF8 = (s) => {
  let i,
    d = unescape(encodeURIComponent(s)),
    b = new Uint8Array(d.length);
  for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
  return b;
};
const encodeUTF8 = (arr) => {
  let i,
    s = [];
  for (i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
  return decodeURIComponent(escape(s.join('')));
};
const encodeBase64 = (arr) => {
  return Buffer.from(arr).toString('base64');
};
const decodeBase64 = (s) => {
  return new Uint8Array(Array.prototype.slice.call(Buffer.from(s, 'base64'), 0));
};

const encrypt = (secretOrSharedKey, json, key) => {
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const encrypted = key ? box(messageUint8, nonce, key, secretOrSharedKey) : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

const decrypt = (secretOrSharedKey, messageWithNonce, key) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(box.nonceLength, messageWithNonce.length);

  const decrypted = key ? box.open(message, nonce, key, secretOrSharedKey) : box.open.after(message, nonce, secretOrSharedKey);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  const base64DecryptedMessage = encodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};

async function getIPFSData(cid) {
  const ipfsResponse = await Functions.makeHttpRequest({
    url: `https://${cid}.ipfs.w3s.link/`,
    method: 'GET',
    timeout: HTTP_TIMEOUT,
  });

  if (ipfsResponse.error) {
    console.log(JSON.stringify(ipfsResponse, null, 2));
    throw new Error('IPFS error');
  }

  return ipfsResponse.data;
}

async function getResponseFromLLM(previousPrompts) {
  if (!Array.isArray(previousPrompts)) {
    throw new Error("Malformed input data. Expected array of prompts and answers");
  }

  if (SIMULATE_RESPONSE) {
    return 'I recommend you take some ibuprofen';
  }

  const postData = {
    model: OPENAI_MODEL,
    messages: previousPrompts,
    temperature: 0,
  };

  const openAIResponse = await Functions.makeHttpRequest({
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secrets.openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    data: postData,
    timeout: HTTP_TIMEOUT,
  });

  if (openAIResponse.error || !openAIResponse?.data?.choices?.[0]?.message?.content) {
    console.log(JSON.stringify(openAIResponse, null, 2));
    throw new Error('OpenAI API error');
  }

  return openAIResponse.data.choices[0].message.content;
}

async function saveToIPFS(content, filename) {
  const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
  const requestBody = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="Body"; filename="${filename}"`,
    'Content-Type: text/plain',
    '',
    content,
    `--${boundary}`,
    'Content-Disposition: form-data; name="Key"',
    '',
    filename,
    `--${boundary}`,
    'Content-Disposition: form-data; name="ContentType"',
    '',
    'text',
    `--${boundary}--`,
  ].join('\r\n');

  const options = {
    method: 'POST',
    url: 'https://api.quicknode.com/ipfs/rest/v1/s3/put-object',
    headers: {
      'x-api-key': secrets.quickNodeApiKey,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': requestBody.length
    },
    data: requestBody,
    timeout: HTTP_TIMEOUT,
  };

  const quickNodeResponse = await Functions.makeHttpRequest(options);

  if (quickNodeResponse.error || !quickNodeResponse?.data?.pin?.cid) {
    console.log(JSON.stringify(quickNodeResponse, null, 2));
    throw new Error('QuickNode IPFS API error');
  }

  return quickNodeResponse.data.pin.cid;
}

const patientPublicKey = decodeBase64(patientPublicKeyB64);
const keyPair = box.keyPair.fromSecretKey(new TextEncoder().encode(secrets.secretString));
const shared = box.before(patientPublicKey, keyPair.secretKey);

const encryptedData = await getIPFSData(inputCid);
const decryptedData = decrypt(shared, encryptedData);

const doctorsResponse = await getResponseFromLLM(decryptedData);
const encryptedResponse = encrypt(shared, doctorsResponse);
const cid = await saveToIPFS(encryptedResponse, 'encryptedResponse.txt');

console.log(JSON.stringify(cid, null, 2));
return Functions.encodeString(cid);
