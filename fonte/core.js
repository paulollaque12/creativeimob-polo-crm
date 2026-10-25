// ===== Motor de cálculo do Dashboard Polo (puro, sem DOM) =====
var E0 = Date.UTC(2025, 0, 1);            // dia 0 do cubo
var DAY = 86400000;
var MET = [
  { k: 'leads', n: 'Leads', s: 'Leads captados' },
  { k: 'c1', n: '1º Contato' },
  { k: 'pre', n: 'Pré-atendimento' },
  { k: 'atd', n: 'Atendimento' },
  { k: 'agd', n: 'Agendamento' },
  { k: 'vis', n: 'Visita' },
  { k: 'prop', n: 'Proposta' },
  { k: 'vend', n: 'Venda' },
  { k: 'agc', n: 'Agenciamentos' },
  { k: 'pla', n: 'Placas' }
];
var FUNIL = [0, 1, 2, 3, 4, 5, 6, 7];

function dIdx(iso) { var p = iso.split('-'); return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - E0) / DAY); }
function dIso(i) { return new Date(E0 + i * DAY).toISOString().slice(0, 10); }
function dObj(i) { return new Date(E0 + i * DAY); }
var INICIO = dIdx('2026-01-01');          // primeiro dia com dados no cubo

// Converte o resultado da consulta (linhas k, n, s) no cubo em memória
function parseCubo(rows) {
  var C = { m: [], k: {}, ref: null };
  for (var i = 0; i < 10; i++) C.m[i] = [];
  rows.forEach(function (r) {
    var k = r[0], s = r[2] || '';
    if (k === 'ref') { C.ref = s; return; }
    if (k.indexOf('k_') === 0) { C.k[k.slice(2)] = [''].concat(s.split('\t')); return; }
    var m = +k.slice(1);
    if (!s) return;
    C.m[m] = s.split(';').map(function (t) {
      var a = t.split('|');
      return { d: +a[0], x: a[1], r: a[2] ? +a[2] : 0, v: a[3] ? +a[3] : 0, b: a[4] ? +a[4] : 0, t: a[5] ? +a[5] : 0,
        q: a[6] === '' ? null : +a[6], a: a[7] === '' ? null : +a[7], imo: a[8], val: a[9] === '' ? 0 : +a[9] };
    });
  });
  return C;
}

function faixaArea(a) {
  if (a == null || a <= 0) return 'Sem informação';
  if (a < 80) return 'Até 80 m²';
  if (a < 120) return '80 a 120 m²';
  if (a < 160) return '120 a 160 m²';
  if (a < 220) return '160 a 220 m²';
  if (a < 300) return '220 a 300 m²';
  return '300 m² ou mais';
}
var AREA_ORD = ['Até 80 m²', '80 a 120 m²', '120 a 160 m²', '160 a 220 m²', '220 a 300 m²', '300 m² ou mais', 'Sem informação'];
function faixaDorm(q) { if (q == null || q <= 0) return 'Sem informação'; return q >= 4 ? '4 ou mais' : q + (q === 1 ? ' dormitório' : ' dormitórios'); }

var DIMS = [
  { k: 'cor', n: 'Corretor', f: function (C, e) { return C.k.cor[e.r] || 'Sem corretor'; } },
  { k: 'vei', n: 'Veículo de captação', f: function (C, e) { return normVei(C.k.vei[e.v]) || 'Sem informação'; }, semImovel: true },
  { k: 'bai', n: 'Bairro', f: function (C, e) { return C.k.bai[e.b] || 'Sem informação'; } },
  { k: 'cat', n: 'Tipologia', f: function (C, e) { return C.k.cat[e.t] || 'Sem informação'; } },
  { k: 'dor', n: 'Dormitórios', f: function (C, e) { return faixaDorm(e.q); } },
  { k: 'are', n: 'Área privativa', f: function (C, e) { return faixaArea(e.a); }, ord: AREA_ORD }
];
function dimBy(k) { for (var i = 0; i < DIMS.length; i++) if (DIMS[i].k === k) return DIMS[i]; }
// Une grafias diferentes do mesmo veículo
function normVei(s) {
  if (!s) return s;
  var l = s.toLowerCase();
  if (l === 'youtube') return 'YouTube';
  return s;
}

// F = {cor: id|0, vei: nome|''}
function passa(C, m, e, F) {
  if (F.cor && e.r !== F.cor) return false;
  if (F.vei) { if (m >= 8) return false; if (normVei(C.k.vei[e.v]) !== F.vei) return false; }
  return true;
}
function linhas(C, m, d1, d2, F) {
  var out = [], L = C.m[m];
  for (var i = 0; i < L.length; i++) { var e = L[i]; if (e.d >= d1 && e.d <= d2 && passa(C, m, e, F)) out.push(e); }
  return out;
}
function distintos(L) { var s = {}, n = 0; for (var i = 0; i < L.length; i++) if (!s[L[i].x]) { s[L[i].x] = 1; n++; } return n; }
// VGV: um valor por imóvel vendido (regra do Power BI); vendas = negócios distintos
function vgv(L) {
  var p = {}, t = 0;
  for (var i = 0; i < L.length; i++) { var e = L[i], k = e.imo || ('n' + e.x); if (!(k in p) || e.val > p[k]) p[k] = e.val; }
  for (var k in p) t += p[k];
  return t;
}
function medida(C, m, d1, d2, F) { return distintos(linhas(C, m, d1, d2, F)); }
function funil(C, d1, d2, F) {
  var o = {};
  FUNIL.forEach(function (m) { o[m] = medida(C, m, d1, d2, F); });
  var lv = linhas(C, 7, d1, d2, F);
  o.vgv = vgv(lv); o.ticket = o[7] ? o.vgv / o[7] : 0;
  o[8] = medida(C, 8, d1, d2, F); o[9] = medida(C, 9, d1, d2, F);
  return o;
}
// Período anterior: os N dias imediatamente antes
function anterior(d1, d2) { var n = d2 - d1 + 1; return [d1 - n, d1 - 1]; }
function variacao(a, b, d1prev) {
  if (d1prev < INICIO || !b) return null;   // período anterior antes do início dos dados = sem base
  return (a - b) / b;
}
// Agrupa uma métrica por dimensão: [{nome, n, vend, vgv}]
function porDim(C, m, d1, d2, F, dk) {
  var dim = dimBy(dk), g = {};
  linhas(C, m, d1, d2, F).forEach(function (e) { var k = dim.f(C, e); (g[k] = g[k] || []).push(e); });
  return Object.keys(g).map(function (k) { return { nome: k, n: distintos(g[k]), L: g[k] }; });
}
// Séries temporais: granularidade dia/semana/mês/ano
function serie(C, m, d1, d2, F, gran, valor) {
  var L = linhas(C, m, d1, d2, F), b = {}, keys = [];
  function chave(i) {
    var o = dObj(i);
    if (gran === 'dia') return i;
    if (gran === 'sem') { var w = (o.getUTCDay() + 6) % 7; return Math.max(i - w, d1); }
    if (gran === 'ano') return Date.UTC(o.getUTCFullYear(), 0, 1);
    return Date.UTC(o.getUTCFullYear(), o.getUTCMonth(), 1);
  }
  for (var i = d1; i <= d2; i++) { var k = chave(i); if (!b[k]) { b[k] = []; keys.push(k); } }
  L.forEach(function (e) { b[chave(e.d)].push(e); });
  return keys.map(function (k) { return { k: k, v: valor === 'vgv' ? vgv(b[k]) : distintos(b[k]) }; });
}
// Semanas do mês, de segunda a domingo, recortadas no mês (W1..Wn)
function semanasMes(ano, mes) {
  var d1 = dIdx(ano + '-' + String(mes).padStart(2, '0') + '-01');
  var fim = new Date(Date.UTC(ano, mes, 0)).getUTCDate(), d2 = d1 + fim - 1, out = [], ini = d1;
  for (var i = d1; i <= d2; i++) {
    var dow = (dObj(i).getUTCDay() + 6) % 7;
    if (dow === 6 || i === d2) { out.push([ini, i]); ini = i + 1; }
  }
  return out;
}
var fmt = {
  n: function (v) { return Math.round(v).toLocaleString('pt-BR'); },
  pct: function (v, dec) { return (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }) + '%'; },
  mi: function (v) { return 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Mi'; },
  brl: function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); },
  data: function (i) { var o = dObj(i); return String(o.getUTCDate()).padStart(2, '0') + '/' + String(o.getUTCMonth() + 1).padStart(2, '0') + '/' + o.getUTCFullYear(); }
};
if (typeof module !== 'undefined') module.exports = { parseCubo: parseCubo, funil: funil, porDim: porDim, vgv: vgv, linhas: linhas, distintos: distintos, dIdx: dIdx, serie: serie, semanasMes: semanasMes, fmt: fmt, MET: MET };
