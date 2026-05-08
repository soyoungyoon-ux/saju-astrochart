import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
//  CONSTANTS & DATA TABLES
// ═══════════════════════════════════════════════════════════
const OC = {
  목: { bg:"#1e5c1e", border:"#3a8a3a", text:"#a8e6a8", glow:"rgba(58,138,58,0.4)", label:"木" },
  화: { bg:"#7a1515", border:"#c03030", text:"#ffaaaa", glow:"rgba(192,48,48,0.4)", label:"火" },
  토: { bg:"#6b4010", border:"#b06820", text:"#f0c878", glow:"rgba(176,104,32,0.4)", label:"土" },
  금: { bg:"#4a4a4a", border:"#b0b0b0", text:"#e8e8e8", glow:"rgba(176,176,176,0.3)", label:"金" },
  수: { bg:"#0d0d28", border:"#2a3a7a", text:"#8899dd", glow:"rgba(42,58,122,0.45)", label:"水" },
};

const CHEONGAN = {
  甲:{o:"목",ey:"양"}, 乙:{o:"목",ey:"음"}, 丙:{o:"화",ey:"양"}, 丁:{o:"화",ey:"음"},
  戊:{o:"토",ey:"양"}, 己:{o:"토",ey:"음"}, 庚:{o:"금",ey:"양"}, 辛:{o:"금",ey:"음"},
  壬:{o:"수",ey:"양"}, 癸:{o:"수",ey:"음"},
};
const JIJI = {
  子:{o:"수",ey:"양",jg:[["壬",0.3],["癸",0.7]]},
  丑:{o:"토",ey:"음",jg:[["癸",0.2],["辛",0.3],["己",0.5]]},
  寅:{o:"목",ey:"양",jg:[["戊",0.2],["丙",0.3],["甲",0.5]]},
  卯:{o:"목",ey:"음",jg:[["甲",0.4],["乙",0.6]]},
  辰:{o:"토",ey:"양",jg:[["乙",0.2],["癸",0.3],["戊",0.5]]},
  巳:{o:"화",ey:"음",jg:[["戊",0.2],["庚",0.3],["丙",0.5]]},
  午:{o:"화",ey:"양",jg:[["丙",0.3],["己",0.2],["丁",0.5]]},
  未:{o:"토",ey:"음",jg:[["丁",0.2],["乙",0.3],["己",0.5]]},
  申:{o:"금",ey:"양",jg:[["戊",0.2],["壬",0.3],["庚",0.5]]},
  酉:{o:"금",ey:"음",jg:[["庚",0.4],["辛",0.6]]},
  戌:{o:"토",ey:"양",jg:[["辛",0.2],["丁",0.3],["戊",0.5]]},
  亥:{o:"수",ey:"음",jg:[["甲",0.3],["壬",0.7]]},
};

const CHEONGAN_LIST = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const JIJI_LIST = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const OHAENG_LIST = ["목","화","토","금","수"];

const SAENG = { 목:"화", 화:"토", 토:"금", 금:"수", 수:"목" };
const GEUK  = { 목:"토", 화:"금", 토:"수", 금:"목", 수:"화" };
const SAENG_BY = { 목:"수", 화:"목", 토:"화", 금:"토", 수:"금" };
const GEUK_BY  = { 목:"금", 화:"수", 토:"목", 금:"화", 수:"토" };

const SIGNS = [
  { name:"양자리",   sym:"♈", el:"화", color:"#c0392b" },
  { name:"황소자리", sym:"♉", el:"토", color:"#7d6608" },
  { name:"쌍둥이",   sym:"♊", el:"풍", color:"#1a5276" },
  { name:"게자리",   sym:"♋", el:"수", color:"#117a65" },
  { name:"사자자리", sym:"♌", el:"화", color:"#ca6f1e" },
  { name:"처녀자리", sym:"♍", el:"토", color:"#1e8449" },
  { name:"천칭자리", sym:"♎", el:"풍", color:"#1a5276" },
  { name:"전갈자리", sym:"♏", el:"수", color:"#7d3c98" },
  { name:"사수자리", sym:"♐", el:"화", color:"#c0392b" },
  { name:"염소자리", sym:"♑", el:"토", color:"#7d6608" },
  { name:"물병자리", sym:"♒", el:"풍", color:"#1a5276" },
  { name:"물고기",   sym:"♓", el:"수", color:"#117a65" },
];
const EL_COLOR = { 화:"#c0392b88", 토:"#b7950b88", 풍:"#1a527688", 수:"#11796588" };

const PLANET_DATA = {
  Sun:{sym:"☉",kor:"태양",color:"#f39c12"}, Moon:{sym:"☽",kor:"달",color:"#bdc3c7"},
  Mercury:{sym:"☿",kor:"수성",color:"#aab7b8"}, Venus:{sym:"♀",kor:"금성",color:"#f8c471"},
  Mars:{sym:"♂",kor:"화성",color:"#e74c3c"}, Jupiter:{sym:"♃",kor:"목성",color:"#f0b27a"},
  Saturn:{sym:"♄",kor:"토성",color:"#d5d8dc"}, Uranus:{sym:"♅",kor:"천왕",color:"#76d7c4"},
  Neptune:{sym:"♆",kor:"해왕",color:"#5dade2"}, Pluto:{sym:"♇",kor:"명왕",color:"#a569bd"},
  ASC:{sym:"AS",kor:"어센던트",color:"#f1c40f"},
};

// ═══════════════════════════════════════════════════════════
//  CALC: 만세력 (천문학적 24절기 기반)
// ═══════════════════════════════════════════════════════════

// 율리우스 일자 (UT 기준)
function julianDayUT(y, m, d, h=0) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y/100);
  const B = 2 - A + Math.floor(A/4);
  return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + B - 1524.5 + h/24;
}

// 태양 겉보기 황경 (VSOP87 단순화)
function sunLongitudeAt(JD) {
  const T = (JD - 2451545) / 36525;
  const L0c = ((280.46646 + 36000.76983*T + 0.0003032*T*T) % 360 + 360) % 360;
  const M = ((357.52911 + 35999.05029*T - 0.0001537*T*T) % 360 + 360) % 360;
  const Mr = M * Math.PI / 180;
  const C = (1.914602 - 0.004817*T - 0.000014*T*T)*Math.sin(Mr)
          + (0.019993 - 0.000101*T)*Math.sin(2*Mr)
          + 0.000289*Math.sin(3*Mr);
  const trueL = L0c + C;
  const omega = ((125.04 - 1934.136*T) * Math.PI / 180);
  return ((trueL - 0.00569 - 0.00478*Math.sin(omega)) % 360 + 360) % 360;
}

// 12절(월의 시작): 입춘부터
const MONTH_JEOL = [
  { name:"입춘", lon:315, jiIdx:2 },  // 寅월
  { name:"경칩", lon:345, jiIdx:3 },  // 卯월
  { name:"청명", lon:15,  jiIdx:4 },  // 辰월
  { name:"입하", lon:45,  jiIdx:5 },  // 巳월
  { name:"망종", lon:75,  jiIdx:6 },  // 午월
  { name:"소서", lon:105, jiIdx:7 },  // 未월
  { name:"입추", lon:135, jiIdx:8 },  // 申월
  { name:"백로", lon:165, jiIdx:9 },  // 酉월
  { name:"한로", lon:195, jiIdx:10 }, // 戌월
  { name:"입동", lon:225, jiIdx:11 }, // 亥월
  { name:"대설", lon:255, jiIdx:0 },  // 子월
  { name:"소한", lon:285, jiIdx:1 },  // 丑월
];

// 절기별 대략적 DOY (Newton-Raphson 시작점)
const TERM_APPROX_DOY = { 315:35, 345:65, 15:95, 45:125, 75:155, 105:185,
                          135:215, 165:245, 195:275, 225:305, 255:335, 285:5 };

// 황경 → JD (Newton-Raphson)
function findSolarTermJD(year, targetLon) {
  let yr = year;
  if (targetLon === 285) yr = year + 1; // 소한은 다음해 1월
  let JD = julianDayUT(yr, 1, TERM_APPROX_DOY[targetLon], 12);
  for (let i = 0; i < 8; i++) {
    const lon = sunLongitudeAt(JD);
    let diff = targetLon - lon;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.0001) break;
    JD += diff / 0.98565;
  }
  return JD; // UT 기준 JD
}

// 1년치 12절 JD 캐시
const _termsCache = {};
function getYearTerms(year) {
  if (_termsCache[year]) return _termsCache[year];
  const terms = MONTH_JEOL.map(m => ({ ...m, JD: findSolarTermJD(year, m.lon) }));
  _termsCache[year] = terms;
  return terms;
}

// 60갑자 일주 인덱스
function dayCycleIdx(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + B - 1524;
  return ((JD - 2415021 + 10) % 60 + 60) % 60;
}

// 다음날 날짜 구하기
function nextDay(y, m, d) {
  const dt = new Date(Date.UTC(y, m-1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth()+1, d: dt.getUTCDate() };
}

function getSajuPillars(year, month, day, hour, minute=0) {
  // KST 입력 → UT JD (KST = UT+9)
  const inputJD_UT = julianDayUT(year, month, day, hour - 9 + minute/60);

  // ── 야자시 처리: 23시 이후는 다음날 일주 ──
  let dayY = year, dayM = month, dayD = day;
  if (hour >= 23) {
    const nd = nextDay(year, month, day);
    dayY = nd.y; dayM = nd.m; dayD = nd.d;
  }

  // ── 월주: 절기 기반 ──
  // 입력 JD가 어느 12절 구간에 속하는지 찾기
  let yearTerms = getYearTerms(year);
  let sajuYear = year;       // 사주 연도 (입춘 기준)
  let monthIdx = -1;

  // 작년 입춘과 비교: 작년 입춘 후 ~ 올해 입춘 전 = 작년 사주
  if (inputJD_UT < yearTerms[0].JD) {
    yearTerms = getYearTerms(year - 1);
    sajuYear = year - 1;
  }
  // 어느 절기 이후?
  for (let i = 11; i >= 0; i--) {
    if (inputJD_UT >= yearTerms[i].JD) { monthIdx = i; break; }
  }
  if (monthIdx === -1) {
    // 작년 자료에서도 못 찾으면 재작년
    yearTerms = getYearTerms(year - 2);
    sajuYear = year - 2;
    monthIdx = 11;
  }

  // ── 연주 ──
  const yearGanIdx = ((sajuYear - 4) % 10 + 10) % 10;
  const yearJiIdx  = ((sajuYear - 4) % 12 + 12) % 12;
  const yeonjuGan = CHEONGAN_LIST[yearGanIdx];
  const yeonjuJi  = JIJI_LIST[yearJiIdx];

  // ── 월주 ──
  const woljuJi = JIJI_LIST[yearTerms[monthIdx].jiIdx];
  // 五虎遁: 갑기년→丙寅월부터, 을경→戊寅, 병신→庚寅, 정임→壬寅, 무계→甲寅
  const monthGanStart = [2, 4, 6, 8, 0][yearGanIdx % 5];
  // monthIdx 0 = 寅월 = 월간 = monthGanStart
  const woljuGan = CHEONGAN_LIST[(monthGanStart + monthIdx) % 10];

  // ── 일주 (야자시 반영) ──
  const dayCyc = dayCycleIdx(dayY, dayM, dayD);
  const iljuGan = CHEONGAN_LIST[dayCyc % 10];
  const iljuJi  = JIJI_LIST[dayCyc % 12];

  // ── 시주 ──
  // 子(23-1), 丑(1-3), 寅(3-5), ..., 亥(21-23)
  // 시지 인덱스: hour=23 또는 0 → 0(子), 1~2 → 1(丑), 3~4 → 2(寅) ...
  let sijuJiIdx;
  if (hour === 23 || hour === 0) sijuJiIdx = 0;
  else sijuJiIdx = Math.floor((hour + 1) / 2);
  const sijuJi = JIJI_LIST[sijuJiIdx];
  // 五鼠遁: 갑기일→甲子시, 을경→丙子, 병신→戊子, 정임→庚子, 무계→壬子
  const dayGanIdx = dayCyc % 10;
  const sijuGanStart = [0, 2, 4, 6, 8][dayGanIdx % 5];
  const sijuGan = CHEONGAN_LIST[(sijuGanStart + sijuJiIdx) % 10];

  return {
    pillars: [
      { label:"연주", gan: yeonjuGan, ji: yeonjuJi },
      { label:"월주", gan: woljuGan, ji: woljuJi },
      { label:"일주", gan: iljuGan, ji: iljuJi },
      { label:"시주", gan: sijuGan, ji: sijuJi },
    ],
    // 대운 계산용 메타정보
    meta: {
      birthJD_UT: inputJD_UT,
      prevTermJD: yearTerms[monthIdx].JD,
      nextTermJD: monthIdx < 11
        ? yearTerms[monthIdx+1].JD
        : getYearTerms(sajuYear+1)[0].JD,
      sajuYear,
      monthIdx,
      currentTerm: yearTerms[monthIdx].name,
    }
  };
}

function getSibsin(ilgan, target) {
  const ilO = CHEONGAN[ilgan]?.o, ilEY = CHEONGAN[ilgan]?.ey;
  const targetO = CHEONGAN[target]?.o || JIJI[target]?.o;
  const targetEY = CHEONGAN[target]?.ey || JIJI[target]?.ey;
  if (!ilO || !targetO) return "";
  if (targetO === ilO) return targetEY === ilEY ? "비견" : "겁재";
  if (SAENG_BY[ilO] === targetO) return targetEY === ilEY ? "편인" : "정인";
  if (SAENG[ilO] === targetO)    return targetEY === ilEY ? "식신" : "상관";
  if (GEUK[ilO] === targetO)     return targetEY === ilEY ? "편재" : "정재";
  if (GEUK_BY[ilO] === targetO)  return targetEY === ilEY ? "편관" : "정관";
  return "";
}

function analyzeOhaeng(pillars, ilgan) {
  const raw = { 목:0, 화:0, 토:0, 금:0, 수:0 };
  const PILLAR_W = [1, 1, 1, 1];
  const JI_EXTRA = [1, 1.5, 1, 1];
  pillars.forEach(({ gan, ji }, i) => {
    const w = PILLAR_W[i];
    if (CHEONGAN[gan]) raw[CHEONGAN[gan].o] += w;
    if (JIJI[ji]) {
      JIJI[ji].jg.forEach(([g, ratio]) => {
        if (CHEONGAN[g]) raw[CHEONGAN[g].o] += w * JI_EXTRA[i] * ratio;
      });
    }
  });
  const total = Object.values(raw).reduce((a,b)=>a+b, 0) || 1;
  const pct = {};
  OHAENG_LIST.forEach(o => { pct[o] = Math.round((raw[o]/total)*100); });

  const ilO = CHEONGAN[ilgan]?.o;
  const inO = SAENG_BY[ilO], biO = ilO, sikO = SAENG[ilO], jaeO = GEUK[ilO], gwanO = GEUK_BY[ilO];
  const doaScore = (raw[inO]||0) + (raw[biO]||0);
  const geukScore = (raw[sikO]||0) + (raw[jaeO]||0) + (raw[gwanO]||0);
  const ratio = doaScore / (doaScore + geukScore || 1);

  let level, color;
  if (ratio >= 0.68) { level="극신강"; color="#e74c3c"; }
  else if (ratio >= 0.58) { level="신강"; color="#e67e22"; }
  else if (ratio >= 0.45) { level="중화"; color="#c9a84c"; }
  else if (ratio >= 0.35) { level="신약"; color="#3498db"; }
  else { level="극신약"; color="#8e44ad"; }

  const isWeak = ["신약","극신약"].includes(level);
  const isStrong = ["신강","극신강"].includes(level);
  let yong=[], hee=[], gi=[], gu=[], han=[];
  if (isWeak) {
    yong = [inO, biO]; hee = [SAENG_BY[inO]];
    gi = [gwanO, jaeO]; gu = [SAENG_BY[gwanO]];
  } else if (isStrong) {
    yong = [gwanO, jaeO, sikO]; hee = [SAENG_BY[gwanO]];
    gi = [inO, biO]; gu = [SAENG_BY[inO]];
  } else {
    const sorted = OHAENG_LIST.slice().sort((a,b)=>raw[b]-raw[a]);
    gi = sorted.slice(0,1); yong = sorted.slice(-1);
    hee = [SAENG_BY[yong[0]]]; gu = [SAENG_BY[gi[0]]];
  }
  han = OHAENG_LIST.filter(o => ![...yong,...hee,...gi,...gu].includes(o));
  const uniq = arr => [...new Set(arr)].filter(Boolean);

  return {
    raw, pct, total,
    shingang: { level, color, ratio, doaScore, geukScore },
    yongsin: {
      yong: uniq(yong),
      hee: uniq(hee).filter(o=>!yong.includes(o)),
      gi: uniq(gi),
      gu: uniq(gu).filter(o=>![...yong,...hee,...gi].includes(o)),
      han: uniq(han)
    },
  };
}

function calcDaeun(pillars, gender, meta) {
  const yeon = pillars[0].gan;
  const yearEY = CHEONGAN[yeon]?.ey;
  const sunhaeng = (gender === "남" && yearEY === "양") || (gender === "여" && yearEY === "음");

  // 정확한 대운수: 입절까지 일수 ÷ 3 (3일=1년)
  let daeunsu = 3;
  let daysToTerm = 0;
  if (meta && meta.birthJD_UT && meta.prevTermJD && meta.nextTermJD) {
    if (sunhaeng) {
      daysToTerm = meta.nextTermJD - meta.birthJD_UT; // 다음 절기까지
    } else {
      daysToTerm = meta.birthJD_UT - meta.prevTermJD; // 이전 절기로부터
    }
    daeunsu = Math.max(1, Math.round(daysToTerm / 3));
  }

  const wolGanIdx = CHEONGAN_LIST.indexOf(pillars[1].gan);
  const wolJiIdx = JIJI_LIST.indexOf(pillars[1].ji);
  const daeuns = [];
  for (let i = 1; i <= 10; i++) {
    const offset = sunhaeng ? i : -i;
    const ganIdx = ((wolGanIdx + offset) % 10 + 10) % 10;
    const jiIdx = ((wolJiIdx + offset) % 12 + 12) % 12;
    daeuns.push({
      age: daeunsu + (i - 1) * 10,
      gan: CHEONGAN_LIST[ganIdx],
      ji: JIJI_LIST[jiIdx],
    });
  }
  return { daeuns, daeunsu, sunhaeng, daysToTerm: daysToTerm.toFixed(1) };
}

function calcSewoon(year) {
  const ganIdx = ((year - 4) % 10 + 10) % 10;
  const jiIdx = ((year - 4) % 12 + 12) % 12;
  return { year, gan: CHEONGAN_LIST[ganIdx], ji: JIJI_LIST[jiIdx] };
}

// ═══════════════════════════════════════════════════════════
//  CALC: 점성술
// ═══════════════════════════════════════════════════════════
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const norm = x => ((x % 360) + 360) % 360;
const sin = d => Math.sin(d*D2R), cos = d => Math.cos(d*D2R), tan = d => Math.tan(d*D2R);
const atan2d = (y,x) => norm(Math.atan2(y,x)*R2D);

function julianDay(y, m, d, h) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y/100);
  const B = 2 - A + Math.floor(A/4);
  return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + B - 1524.5 + h/24;
}
function calcSun(T) {
  const L0 = norm(280.46646 + 36000.76983*T);
  const M = norm(357.52911 + 35999.05029*T);
  const C = (1.914602 - 0.004817*T)*sin(M) + 0.019993*sin(2*M);
  return norm(L0 + C);
}
function calcMoon(T) {
  const L = norm(218.3165 + 481267.8813*T);
  const M = norm(134.9634 + 477198.8676*T);
  const Mp = norm(357.5291 + 35999.0503*T);
  const D = norm(297.8502 + 445267.1115*T);
  return norm(L + 6.289*sin(M) - 1.274*sin(2*D-M) + 0.658*sin(2*D)
    - 0.186*sin(Mp) - 0.059*sin(2*D-2*M) + 0.053*sin(2*D+M));
}
function planetLon(T, L0c, L1c, M0c, M1c, Ec) {
  const L = norm(L0c + L1c*T), M = norm(M0c + M1c*T);
  return norm(L + Ec*sin(M));
}
function calcASC(JD, lat, lon) {
  const T = (JD-2451545)/36525;
  const eps = 23.439291 - 0.013004*T;
  const GMST = norm(280.46061837 + 360.98564736629*(JD-2451545));
  const RAMC = norm(GMST + lon);
  const X = -cos(RAMC), Y = sin(RAMC)*cos(eps) + tan(lat)*sin(eps);
  let ASC = atan2d(X,Y);
  if (cos(RAMC) > 0) ASC = norm(ASC + 180);
  return norm(ASC);
}
function buildAstroChart(year, month, day, hour, minute, lat, lon) {
  const utHour = (hour + (minute||0)/60) - 9;
  const JD = julianDay(year, month, day, utHour);
  const T = (JD-2451545)/36525;
  return {
    Sun: calcSun(T), Moon: calcMoon(T),
    Mercury: planetLon(T, 252.25, 149472.67, 174.79, 149472.51, 23.44),
    Venus: planetLon(T, 181.98, 58517.82, 50.42, 58517.82, 0.68),
    Mars: planetLon(T, 355.43, 19140.30, 19.37, 19140.30, 10.69),
    Jupiter: planetLon(T, 34.35, 3034.91, 20.92, 3034.91, 5.55),
    Saturn: planetLon(T, 50.08, 1222.11, 317.02, 1222.11, 6.40),
    Uranus: planetLon(T, 314.06, 428.46, 142.59, 428.46, 5.47),
    Neptune: planetLon(T, 304.35, 218.46, 267.76, 218.46, 1.77),
    Pluto: planetLon(T, 238.93, 145.18, 284.40, 145.18, 28.3),
    ASC: calcASC(JD, lat, lon),
  };
}
function calcAspects(planets) {
  const ASPECTS = [
    { name:"합", angle:0, orb:8, color:"#f1c40f", symbol:"☌" },
    { name:"육분", angle:60, orb:6, color:"#2ecc71", symbol:"⚹" },
    { name:"사각", angle:90, orb:7, color:"#e74c3c", symbol:"□" },
    { name:"삼합", angle:120, orb:8, color:"#3498db", symbol:"△" },
    { name:"대립", angle:180, orb:8, color:"#9b59b6", symbol:"☍" },
  ];
  const keys = Object.keys(planets).filter(k => typeof planets[k] === "number");
  const result = [];
  for (let i=0; i<keys.length; i++) {
    for (let j=i+1; j<keys.length; j++) {
      const diff = Math.abs(planets[keys[i]] - planets[keys[j]]);
      const angle = Math.min(diff, 360-diff);
      for (const asp of ASPECTS) {
        if (Math.abs(angle - asp.angle) <= asp.orb) {
          result.push({ p1:keys[i], p2:keys[j], type:asp, orb:Math.abs(angle-asp.angle).toFixed(1) });
          break;
        }
      }
    }
  }
  return result;
}

const signOf = lon => Math.floor(lon/30);
const signLabel = lon => {
  const s = SIGNS[signOf(lon)];
  const d = Math.floor(lon%30);
  const m = Math.floor(((lon%30)-d)*60);
  return `${s.sym} ${d}°${String(m).padStart(2,"0")}'`;
};

// ═══════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════
const ganColor = c => OC[CHEONGAN[c]?.o] || OC.토;
const jiColor  = c => OC[JIJI[c]?.o] || OC.토;

function Card({ title, subtitle, children }) {
  return (
    <div style={{
      background:"rgba(8,12,26,0.85)", border:"1px solid rgba(201,168,76,0.18)",
      borderRadius:10, padding:"14px 16px", marginBottom:10
    }}>
      {title && (
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, letterSpacing:"0.2em", color:"#c9a84c" }}>{title}</div>
          {subtitle && <div style={{ fontSize:9, letterSpacing:"0.15em", color:"rgba(240,230,200,0.35)", marginTop:1 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function NavBtns({ onBack, onNext, nextLabel="다음 →", hideNext }) {
  return (
    <div style={{ display:"flex", gap:8, marginTop:12 }}>
      {onBack && (
        <button onClick={onBack} style={{
          flex:1, padding:"11px",
          background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)",
          borderRadius:8, color:"rgba(240,230,200,0.6)",
          fontSize:12, fontFamily:"inherit", letterSpacing:"0.15em", cursor:"pointer"
        }}>← 이전</button>
      )}
      {!hideNext && onNext && (
        <button onClick={onNext} style={{
          flex:2, padding:"11px",
          background:"linear-gradient(135deg,rgba(201,168,76,0.3),rgba(180,140,60,0.15))",
          border:"1px solid rgba(201,168,76,0.5)",
          borderRadius:8, color:"#f0e6c8",
          fontSize:12, fontFamily:"inherit", letterSpacing:"0.15em", cursor:"pointer"
        }}>{nextLabel}</button>
      )}
    </div>
  );
}

function StepIndicator({ step, total, labels }) {
  return (
    <div style={{ display:"flex", gap:5, marginBottom:16, justifyContent:"center", flexWrap:"wrap" }}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === step, isDone = i < step;
        return (
          <div key={i} style={{
            display:"flex", alignItems:"center", gap:4,
            padding:"4px 10px", borderRadius:14,
            background: isActive ? "rgba(201,168,76,0.18)" : isDone ? "rgba(46,204,113,0.1)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${isActive ? "rgba(201,168,76,0.5)" : isDone ? "rgba(46,204,113,0.3)" : "rgba(255,255,255,0.08)"}`,
            transition:"all 0.3s"
          }}>
            <span style={{
              width:16, height:16, borderRadius:"50%",
              background: isActive ? "#c9a84c" : isDone ? "#2ecc71" : "rgba(255,255,255,0.1)",
              color: isActive || isDone ? "#0a0e1a" : "rgba(240,230,200,0.4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:9, fontWeight:700
            }}>{isDone ? "✓" : i+1}</span>
            <span style={{
              fontSize:9, letterSpacing:"0.05em",
              color: isActive ? "#c9a84c" : isDone ? "rgba(46,204,113,0.8)" : "rgba(240,230,200,0.4)"
            }}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COMPATIBILITY ANALYSIS (궁합)
// ═══════════════════════════════════════════════════════════

// 일간 합/충 관계
const ILGAN_HAP = {  // 천간합 (정화의 결합)
  甲:"己", 己:"甲",  // 甲己合土
  乙:"庚", 庚:"乙",  // 乙庚合金
  丙:"辛", 辛:"丙",  // 丙辛合水
  丁:"壬", 壬:"丁",  // 丁壬合木
  戊:"癸", 癸:"戊",  // 戊癸合火
};
const ILGAN_CHUNG = {  // 천간충 (서로 충돌)
  甲:"庚", 庚:"甲",
  乙:"辛", 辛:"乙",
  丙:"壬", 壬:"丙",
  丁:"癸", 癸:"丁",
};

// 지지 합/충/형/해/원진
const JIJI_RELATIONS = {
  // 육합 (조화)
  hap6: { 子:"丑", 丑:"子", 寅:"亥", 亥:"寅", 卯:"戌", 戌:"卯",
          辰:"酉", 酉:"辰", 巳:"申", 申:"巳", 午:"未", 未:"午" },
  // 충 (대립)
  chung: { 子:"午", 午:"子", 丑:"未", 未:"丑", 寅:"申", 申:"寅",
           卯:"酉", 酉:"卯", 辰:"戌", 戌:"辰", 巳:"亥", 亥:"巳" },
  // 형 (긴장)
  hyeong: { 寅:["巳","申"], 巳:["寅","申"], 申:["寅","巳"],
            丑:["戌","未"], 戌:["丑","未"], 未:["丑","戌"],
            子:["卯"], 卯:["子"],
            辰:["辰"], 午:["午"], 酉:["酉"], 亥:["亥"] },
  // 원진 (미묘한 갈등)
  wonjin: { 子:"未", 未:"子", 丑:"午", 午:"丑", 寅:"酉", 酉:"寅",
            卯:"申", 申:"卯", 辰:"亥", 亥:"辰", 巳:"戌", 戌:"巳" },
};

// 삼합 (서로 다른 셋이 모여 강력한 조화)
const JIJI_SAMHAP_GROUPS = [
  ["申","子","辰"], // 水국
  ["寅","午","戌"], // 火국
  ["巳","酉","丑"], // 金국
  ["亥","卯","未"], // 木국
];

function jijiSamhap(j1, j2) {
  return JIJI_SAMHAP_GROUPS.some(g => g.includes(j1) && g.includes(j2) && j1 !== j2);
}

// 두 사람의 사주 명식 사이의 모든 관계 분석
function analyzeCompatibility(chart1, chart2) {
  const p1 = chart1.pillars; // [연주, 월주, 일주, 시주]
  const p2 = chart2.pillars;
  const il1 = p1[2].gan, il2 = p2[2].gan; // 일간
  const ilji1 = p1[2].ji, ilji2 = p2[2].ji; // 일지

  // ── 1. 일간 관계 ──
  let ilganRelation = null;
  if (ILGAN_HAP[il1] === il2) {
    ilganRelation = { type:"천간합", strength:"강한 조화", color:"#2ecc71",
      desc:"서로의 본성이 결합해 새로운 차원을 만들어내는 결합 관계입니다." };
  } else if (ILGAN_CHUNG[il1] === il2) {
    ilganRelation = { type:"천간충", strength:"긴장과 자극", color:"#e67e22",
      desc:"정면으로 다른 두 본성. 갈등과 자극을 통해 함께 성장할 수 있는 관계입니다." };
  } else if (CHEONGAN[il1]?.o === CHEONGAN[il2]?.o) {
    ilganRelation = { type:"동기", strength:"같은 결", color:"#9b59b6",
      desc:"같은 오행을 공유하는 동질감. 깊이 이해받지만 새로운 자극은 적을 수 있습니다." };
  } else {
    // 상생/상극 판단
    const o1 = CHEONGAN[il1]?.o, o2 = CHEONGAN[il2]?.o;
    if (SAENG[o1] === o2) ilganRelation = { type:"내가 돕는 관계", strength:"양육적 관계", color:"#3498db",
      desc:`${o1}이 ${o2}를 생하는 흐름. 당신이 베풀어주는 관계의 결.` };
    else if (SAENG[o2] === o1) ilganRelation = { type:"나를 돕는 관계", strength:"수혜적 관계", color:"#1abc9c",
      desc:`${o2}이 ${o1}을 생하는 흐름. 상대로부터 받는 자양분이 큰 관계.` };
    else if (GEUK[o1] === o2) ilganRelation = { type:"내가 극하는 관계", strength:"주도적 관계", color:"#e74c3c",
      desc:`${o1}이 ${o2}를 극하는 흐름. 자칫 내가 상대를 누를 수 있어 자비가 필요한 관계.` };
    else if (GEUK[o2] === o1) ilganRelation = { type:"나를 극하는 관계", strength:"단련적 관계", color:"#c0392b",
      desc:`${o2}이 ${o1}을 극하는 흐름. 상대를 통해 단련되지만, 스스로를 잃지 않는 균형이 중요.` };
  }

  // ── 2. 일지 관계 ──
  let iljiRelation = null;
  if (JIJI_RELATIONS.hap6[ilji1] === ilji2) {
    iljiRelation = { type:"육합", strength:"안정과 친밀", color:"#2ecc71",
      desc:"일상에서 자연스럽게 어울리는 정서적 합. 함께 있으면 편안한 결입니다." };
  } else if (JIJI_RELATIONS.chung[ilji1] === ilji2) {
    iljiRelation = { type:"충", strength:"역동적 변화", color:"#e74c3c",
      desc:"기반이 정면으로 충돌. 흔들리지만, 함께 성장의 변곡점을 만드는 강력한 관계." };
  } else if (jijiSamhap(ilji1, ilji2)) {
    iljiRelation = { type:"삼합 일부", strength:"큰 흐름 공유", color:"#3498db",
      desc:"세 지지가 모이면 강력한 국을 이루는 한 부분. 큰 방향성을 공유합니다." };
  } else if (JIJI_RELATIONS.wonjin[ilji1] === ilji2) {
    iljiRelation = { type:"원진", strength:"미묘한 거슬림", color:"#7f8c8d",
      desc:"이유 없이 맘에 살짝 걸리는 결. 의식하면 오히려 깊은 이해로 풀립니다." };
  } else if (JIJI_RELATIONS.hyeong[ilji1]?.includes(ilji2)) {
    iljiRelation = { type:"형", strength:"자기 단련", color:"#e67e22",
      desc:"서로를 다듬는 긴장. 갈등이 아닌 성장의 도구로 쓸 수 있는 관계." };
  } else {
    iljiRelation = { type:"평이", strength:"중립적", color:"#bdc3c7",
      desc:"특별한 합충은 없으나, 노력으로 무엇이든 만들 수 있는 백지의 관계." };
  }

  // ── 3. 오행 보완성 (한 쪽 부족 ↔ 다른 쪽 풍부) ──
  const ohaengComplement = OHAENG_LIST.map(o => {
    const a = chart1.analysis.pct[o];
    const b = chart2.analysis.pct[o];
    return {
      ohaeng: o,
      a, b,
      diff: Math.abs(a - b),
      complement: (a < 10 && b > 25) || (b < 10 && a > 25),
      provider: a > b ? "1" : "2",
    };
  });
  const complementCount = ohaengComplement.filter(x=>x.complement).length;

  // ── 4. 용신 호환성 ──
  const yongCompat = {
    a_yongsin: chart1.analysis.yongsin.yong,
    b_yongsin: chart2.analysis.yongsin.yong,
    // 1번의 용신을 2번이 가지고 있는지 (얼마나)
    aGetsFromB: chart1.analysis.yongsin.yong.reduce((sum, o) => sum + (chart2.analysis.pct[o] || 0), 0),
    bGetsFromA: chart2.analysis.yongsin.yong.reduce((sum, o) => sum + (chart1.analysis.pct[o] || 0), 0),
  };

  // ── 5. 점성술 시너지 (Sun/Moon/Venus) ──
  const astroSynergy = [];
  if (chart1.astro && chart2.astro) {
    const pairs = [
      { p1:"Sun", p2:"Moon", label:"태양-달 결합", desc:"본질과 정서의 만남" },
      { p1:"Moon", p2:"Sun", label:"달-태양 결합", desc:"정서와 본질의 만남" },
      { p1:"Venus", p2:"Mars", label:"금성-화성 결합", desc:"애정과 열정의 만남" },
      { p1:"Mars", p2:"Venus", label:"화성-금성 결합", desc:"열정과 애정의 만남" },
      { p1:"Sun", p2:"Sun", label:"태양-태양", desc:"두 본질의 직접 만남" },
      { p1:"Moon", p2:"Moon", label:"달-달", desc:"정서적 공명" },
    ];
    pairs.forEach(({p1,p2,label,desc}) => {
      const lonA = chart1.astro[p1], lonB = chart2.astro[p2];
      if (typeof lonA !== "number" || typeof lonB !== "number") return;
      const diff = Math.abs(lonA - lonB);
      const angle = Math.min(diff, 360-diff);
      let aspect = null;
      if (angle <= 8) aspect = { name:"합", color:"#f1c40f", sym:"☌" };
      else if (Math.abs(angle - 120) <= 8) aspect = { name:"삼합", color:"#3498db", sym:"△" };
      else if (Math.abs(angle - 60) <= 6) aspect = { name:"육분", color:"#2ecc71", sym:"⚹" };
      else if (Math.abs(angle - 90) <= 7) aspect = { name:"사각", color:"#e74c3c", sym:"□" };
      else if (Math.abs(angle - 180) <= 8) aspect = { name:"대립", color:"#9b59b6", sym:"☍" };
      if (aspect) astroSynergy.push({ label, desc, aspect, angle: angle.toFixed(1) });
    });
  }

  // ── 6. 종합 점수 (참고용 - 운명 결정 X) ──
  let synergyScore = 50;
  if (ilganRelation) {
    if (["천간합","육합","삼합 일부"].includes(ilganRelation.type)) synergyScore += 12;
    else if (["천간충","충"].includes(ilganRelation.type)) synergyScore += 5; // 충은 자극이지 나쁜 게 아님
    else if (ilganRelation.type === "내가 돕는 관계") synergyScore += 8;
    else if (ilganRelation.type === "나를 돕는 관계") synergyScore += 8;
  }
  if (iljiRelation) {
    if (iljiRelation.type === "육합") synergyScore += 12;
    else if (iljiRelation.type === "삼합 일부") synergyScore += 10;
    else if (iljiRelation.type === "충") synergyScore += 5;
  }
  synergyScore += complementCount * 4;
  synergyScore += astroSynergy.filter(a => ["합","삼합","육분"].includes(a.aspect.name)).length * 3;
  synergyScore = Math.min(95, Math.max(30, synergyScore));

  return {
    ilganRelation,
    iljiRelation,
    ohaengComplement,
    complementCount,
    yongCompat,
    astroSynergy,
    synergyScore,
  };
}

// ═══════════════════════════════════════════════════════════
//  CHART STORAGE (localStorage with safe fallback)
// ═══════════════════════════════════════════════════════════
const STORAGE_KEY = "saju_app_charts_v1";

function loadCharts() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Storage load failed:", e);
    return [];
  }
}

function persistCharts(charts) {
  try {
    if (typeof localStorage === "undefined") return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
    return true;
  } catch (e) {
    console.warn("Storage save failed:", e);
    return false;
  }
}

function exportChartsJSON(charts) {
  const blob = new Blob([JSON.stringify(charts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `saju-charts-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── SavedChartsPanel ─────────────────────────────────────
function SavedChartsPanel({ charts, onLoad, onDelete, onExport, onImport }) {
  const [open, setOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const fileInputRef = useState(null);

  function handleImportClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          if (!Array.isArray(imported)) throw new Error();
          onImport(imported);
        } catch {
          alert("올바른 차트 파일이 아닙니다");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  if (charts.length === 0) {
    // 차트가 없을 때도 가져오기 버튼은 보여주기
    return (
      <div style={{
        marginBottom:10, padding:"8px 12px",
        background:"rgba(255,255,255,0.02)", borderRadius:6,
        border:"1px dashed rgba(201,168,76,0.15)",
        display:"flex", alignItems:"center", gap:8
      }}>
        <span style={{ flex:1, fontSize:10, color:"rgba(240,230,200,0.4)" }}>
          저장된 차트가 없습니다
        </span>
        <button onClick={handleImportClick} style={{
          padding:"3px 9px", fontSize:9, borderRadius:4,
          background:"transparent", border:"1px solid rgba(201,168,76,0.2)",
          color:"rgba(201,168,76,0.6)", cursor:"pointer", fontFamily:"inherit"
        }}>↑ 가져오기</button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom:10 }}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:"100%", padding:"10px 12px", borderRadius:6, cursor:"pointer",
        background:"rgba(201,168,76,0.06)",
        border:"1px solid rgba(201,168,76,0.25)",
        color:"#c9a84c", fontSize:11, fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:8, letterSpacing:"0.05em"
      }}>
        <span>💾</span>
        <span style={{ flex:1, textAlign:"left" }}>저장된 차트 ({charts.length}개)</span>
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition:"0.3s", fontSize:9 }}>▼</span>
      </button>

      {open && (
        <div style={{
          marginTop:6, padding:"8px",
          background:"rgba(8,12,26,0.5)",
          border:"1px solid rgba(201,168,76,0.15)",
          borderRadius:6,
          animation:"fadeUp 0.3s ease both"
        }}>
          <div style={{ maxHeight:280, overflowY:"auto" }}>
            {charts.map(c => (
              <div key={c.id} style={{
                background:"rgba(255,255,255,0.025)", borderRadius:5,
                padding:"8px 10px", marginBottom:4,
                border:"1px solid rgba(201,168,76,0.1)"
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                  <span style={{ fontSize:11 }}>{c.data.gender === "남" ? "☰" : "☷"}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{
                      fontSize:11, color:"#f0e6c8",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
                    }}>{c.data.name || "이름 없음"}</div>
                    <div style={{ fontSize:9, color:"rgba(240,230,200,0.4)" }}>
                      {c.data.year}.{String(c.data.month).padStart(2,"0")}.{String(c.data.day).padStart(2,"0")} {c.data.hour}:{String(c.data.minute||0).padStart(2,"0")}
                      {c.summary && <span style={{ color:"#c9a84c", marginLeft:6 }}>· {c.summary}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:4 }}>
                  <button onClick={()=>onLoad(c)} style={{
                    flex:1, padding:"4px", borderRadius:4, cursor:"pointer",
                    background:"rgba(201,168,76,0.15)",
                    border:"1px solid rgba(201,168,76,0.3)",
                    color:"#c9a84c", fontSize:9, fontFamily:"inherit"
                  }}>↻ 불러오기</button>
                  {confirmDel === c.id ? (
                    <>
                      <button onClick={()=>{ onDelete(c.id); setConfirmDel(null); }} style={{
                        flex:1, padding:"4px", borderRadius:4, cursor:"pointer",
                        background:"rgba(168,32,32,0.3)",
                        border:"1px solid rgba(168,32,32,0.6)",
                        color:"#ffaaaa", fontSize:9, fontFamily:"inherit"
                      }}>확인 ✓</button>
                      <button onClick={()=>setConfirmDel(null)} style={{
                        padding:"4px 8px", borderRadius:4, cursor:"pointer",
                        background:"rgba(255,255,255,0.05)",
                        border:"1px solid rgba(255,255,255,0.1)",
                        color:"rgba(240,230,200,0.5)", fontSize:9, fontFamily:"inherit"
                      }}>취소</button>
                    </>
                  ) : (
                    <button onClick={()=>setConfirmDel(c.id)} style={{
                      padding:"4px 9px", borderRadius:4, cursor:"pointer",
                      background:"transparent",
                      border:"1px solid rgba(168,32,32,0.3)",
                      color:"rgba(168,32,32,0.7)", fontSize:9, fontFamily:"inherit"
                    }}>🗑</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            display:"flex", gap:4, marginTop:6,
            paddingTop:6, borderTop:"1px solid rgba(201,168,76,0.1)"
          }}>
            <button onClick={onExport} style={{
              flex:1, padding:"5px", borderRadius:4, cursor:"pointer",
              background:"transparent",
              border:"1px solid rgba(201,168,76,0.25)",
              color:"rgba(201,168,76,0.7)", fontSize:9, fontFamily:"inherit"
            }}>↓ 전체 내보내기 (JSON)</button>
            <button onClick={handleImportClick} style={{
              flex:1, padding:"5px", borderRadius:4, cursor:"pointer",
              background:"transparent",
              border:"1px solid rgba(201,168,76,0.25)",
              color:"rgba(201,168,76,0.7)", fontSize:9, fontFamily:"inherit"
            }}>↑ 가져오기</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SaveButton (현재 차트 저장) ──────────────────────────
function SaveChartButton({ onSave, saved }) {
  const [showAnim, setShowAnim] = useState(false);
  function handleSave() {
    onSave();
    setShowAnim(true);
    setTimeout(()=>setShowAnim(false), 2000);
  }
  return (
    <button onClick={handleSave} style={{
      padding:"6px 12px", borderRadius:5, cursor:"pointer",
      background: showAnim ? "rgba(46,204,113,0.2)" : "rgba(201,168,76,0.08)",
      border: `1px solid ${showAnim ? "rgba(46,204,113,0.5)" : "rgba(201,168,76,0.3)"}`,
      color: showAnim ? "#2ecc71" : "#c9a84c",
      fontSize:10, fontFamily:"inherit", letterSpacing:"0.05em",
      transition:"all 0.3s",
      display:"inline-flex", alignItems:"center", gap:5
    }}>
      <span>{showAnim ? "✓" : "💾"}</span>
      <span>{showAnim ? "저장됨" : (saved ? "다시 저장" : "이 차트 저장")}</span>
    </button>
  );
}

// ─── LocationPicker (OpenStreetMap Nominatim) ─────────────
function LocationPicker({ form, setForm }) {
  const [mode, setMode] = useState("search"); // "search" | "manual"
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showMap, setShowMap] = useState(false);

  // 디바운스된 검색
  useEffect(() => {
    if (mode !== "search" || !query || query.trim().length < 2) {
      setResults([]); setErrMsg("");
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true); setErrMsg("");
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&accept-language=ko`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("검색 실패");
        const data = await res.json();
        setResults(data);
        if (data.length === 0) setErrMsg("검색 결과가 없습니다");
      } catch (e) {
        setErrMsg("검색 중 오류 발생 — 수동 입력을 사용해 주세요");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, mode]);

  function selectResult(r) {
    setForm({
      ...form,
      lat: parseFloat(parseFloat(r.lat).toFixed(4)),
      lon: parseFloat(parseFloat(r.lon).toFixed(4)),
      locationName: r.display_name,
    });
    setQuery(""); setResults([]);
    setShowMap(true);
  }

  // 약식 표시명 (전체 display_name이 너무 길어서)
  const shortName = form.locationName?.split(",").slice(0, 3).join(", ");
  const bbox = `${form.lon-0.05},${form.lat-0.04},${form.lon+0.05},${form.lat+0.04}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${form.lat},${form.lon}&layer=mapnik`;

  return (
    <div style={{
      background:"rgba(255,255,255,0.02)", borderRadius:8,
      border:"1px solid rgba(201,168,76,0.15)", padding:"10px 12px"
    }}>
      {/* 현재 선택된 위치 */}
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"6px 8px", marginBottom:8, borderRadius:5,
        background:"rgba(201,168,76,0.06)",
        border:"1px solid rgba(201,168,76,0.2)"
      }}>
        <span style={{ color:"#c9a84c", fontSize:13 }}>📍</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontSize:11, color:"rgba(240,230,200,0.85)",
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
          }}>{shortName || "선택된 위치 없음"}</div>
          <div style={{ fontSize:9, color:"rgba(240,230,200,0.4)", marginTop:1 }}>
            {form.lat?.toFixed(4)}, {form.lon?.toFixed(4)}
          </div>
        </div>
        {form.locationName && (
          <button onClick={()=>setShowMap(s=>!s)} style={{
            padding:"3px 8px", fontSize:9, borderRadius:4,
            background:"transparent", border:"1px solid rgba(201,168,76,0.3)",
            color:"#c9a84c", cursor:"pointer", fontFamily:"inherit"
          }}>{showMap ? "지도 닫기" : "지도 보기"}</button>
        )}
      </div>

      {/* 지도 미리보기 */}
      {showMap && form.locationName && (
        <div style={{
          marginBottom:8, borderRadius:6, overflow:"hidden",
          border:"1px solid rgba(201,168,76,0.3)",
          animation:"fadeUp 0.3s ease both"
        }}>
          <iframe
            title="map"
            width="100%" height="180"
            frameBorder="0" scrolling="no"
            src={mapUrl}
            style={{ display:"block", filter:"hue-rotate(180deg) invert(0.92) saturate(0.6)" }}
          />
        </div>
      )}

      {/* 검색/수동 토글 */}
      <div style={{ display:"flex", gap:4, marginBottom:8 }}>
        {[
          {v:"search", l:"🔍 검색"},
          {v:"manual", l:"✎ 수동 입력"}
        ].map(o => (
          <button key={o.v} onClick={()=>setMode(o.v)} style={{
            flex:1, padding:"6px 8px", borderRadius:5, cursor:"pointer",
            background: mode===o.v ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${mode===o.v ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}`,
            color: mode===o.v ? "#c9a84c" : "rgba(240,230,200,0.4)",
            fontSize:10, fontFamily:"inherit"
          }}>{o.l}</button>
        ))}
      </div>

      {/* 검색 모드 */}
      {mode === "search" && (
        <>
          <input
            type="text" value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="예: 서울 강남구 / Pasadena, CA / 부산"
            style={{
              width:"100%", padding:"8px 10px", borderRadius:5, outline:"none",
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(201,168,76,0.25)",
              color:"#f0e6c8", fontSize:12, fontFamily:"inherit"
            }}
          />
          {loading && (
            <div style={{
              padding:"8px", textAlign:"center", fontSize:10,
              color:"rgba(201,168,76,0.6)"
            }}>
              <span style={{ display:"inline-block", animation:"blink 1s infinite" }}>✦</span> 검색 중...
            </div>
          )}
          {errMsg && (
            <div style={{
              padding:"6px 8px", marginTop:5, fontSize:10,
              color:"#f0b27a", background:"rgba(243,156,18,0.08)",
              borderRadius:4, border:"1px solid rgba(243,156,18,0.2)"
            }}>{errMsg}</div>
          )}
          {results.length > 0 && (
            <div style={{ marginTop:5, maxHeight:160, overflowY:"auto" }}>
              {results.map((r, i) => (
                <button key={i} onClick={()=>selectResult(r)} style={{
                  display:"block", width:"100%", textAlign:"left",
                  padding:"7px 9px", marginBottom:3, borderRadius:4,
                  background:"rgba(255,255,255,0.025)",
                  border:"1px solid rgba(201,168,76,0.1)",
                  color:"rgba(240,230,200,0.8)",
                  fontSize:10, fontFamily:"inherit", lineHeight:1.4,
                  cursor:"pointer"
                }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.025)"}>
                  <span style={{ color:"#c9a84c" }}>📍</span> {r.display_name}
                </button>
              ))}
            </div>
          )}
          <div style={{
            marginTop:6, fontSize:9, color:"rgba(240,230,200,0.3)",
            textAlign:"center", lineHeight:1.5
          }}>
            OpenStreetMap (Nominatim) · 도시·동·주소 모두 검색 가능
          </div>
        </>
      )}

      {/* 수동 입력 모드 */}
      {mode === "manual" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
          <div>
            <div style={{ fontSize:9, color:"rgba(201,168,76,0.5)", marginBottom:3 }}>위도 (Latitude)</div>
            <input type="number" step="any" value={form.lat || ""}
              onChange={e=>setForm({...form, lat: Number(e.target.value), locationName:`수동 입력 (${e.target.value}, ${form.lon})`})}
              placeholder="37.57"
              style={{
                width:"100%", padding:"7px 9px", borderRadius:5, outline:"none",
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(201,168,76,0.2)",
                color:"#f0e6c8", fontSize:11, fontFamily:"inherit"
              }} />
          </div>
          <div>
            <div style={{ fontSize:9, color:"rgba(201,168,76,0.5)", marginBottom:3 }}>경도 (Longitude)</div>
            <input type="number" step="any" value={form.lon || ""}
              onChange={e=>setForm({...form, lon: Number(e.target.value), locationName:`수동 입력 (${form.lat}, ${e.target.value})`})}
              placeholder="126.98"
              style={{
                width:"100%", padding:"7px 9px", borderRadius:5, outline:"none",
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(201,168,76,0.2)",
                color:"#f0e6c8", fontSize:11, fontFamily:"inherit"
              }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP 1: 입력 ─────────────────────────────────────────
function Step1Input({ data, onNext }) {
  const [form, setForm] = useState(data);
  const isValid = form.name && form.year && form.month && form.day && form.gender;

  function Input({ k, type="number", min, max, ph }) {
    return (
      <input
        type={type} value={form[k] ?? ""} min={min} max={max}
        step={type==="number"?"any":undefined} placeholder={ph}
        onChange={e=>setForm({...form, [k]: type==="number" ? Number(e.target.value) : e.target.value})}
        style={{
          width:"100%", padding:"9px 11px", borderRadius:6, outline:"none",
          background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.25)",
          color:"#f0e6c8", fontSize:13, fontFamily:"inherit"
        }} />
    );
  }
  function Toggle({ k, options }) {
    return (
      <div style={{ display:"flex", gap:6 }}>
        {options.map(o => (
          <button key={o.v} onClick={()=>setForm({...form, [k]:o.v})} style={{
            flex:1, padding:"8px 4px", borderRadius:6, cursor:"pointer",
            background: form[k]===o.v ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${form[k]===o.v ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.15)"}`,
            color: form[k]===o.v ? "#c9a84c" : "rgba(240,230,200,0.5)",
            fontSize:12, fontFamily:"inherit"
          }}>{o.l}</button>
        ))}
      </div>
    );
  }
  function Label({ children }) {
    return <div style={{ fontSize:9, letterSpacing:"0.15em", color:"rgba(201,168,76,0.6)", marginBottom:5 }}>{children}</div>;
  }

  return (
    <div style={{ animation:"fadeUp 0.5s ease both" }}>
      <Card title="기본 정보" subtitle="Birth Information">
        <div style={{ marginBottom:12 }}>
          <Label>이름</Label>
          <Input k="name" type="text" ph="홍길동" />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
          <div><Label>성별</Label><Toggle k="gender" options={[{v:"남",l:"남명 ☰"},{v:"여",l:"여명 ☷"}]} /></div>
          <div><Label>달력</Label><Toggle k="calType" options={[{v:"양력",l:"양력"},{v:"음력",l:"음력"}]} /></div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr 1fr 1fr 1fr", gap:8, marginBottom:12 }}>
          <div><Label>연도</Label><Input k="year" min={1900} max={2030} /></div>
          <div><Label>월</Label><Input k="month" min={1} max={12} /></div>
          <div><Label>일</Label><Input k="day" min={1} max={31} /></div>
          <div><Label>시</Label><Input k="hour" min={0} max={23} /></div>
          <div><Label>분</Label><Input k="minute" min={0} max={59} /></div>
        </div>

        <Label>출생지 (어센던트 계산용)</Label>
        <LocationPicker form={form} setForm={setForm} />

        {form.calType === "음력" && (
          <div style={{
            marginTop:8, padding:"8px 12px", fontSize:10,
            color:"#f0b27a", lineHeight:1.6,
            background:"rgba(243,156,18,0.08)", borderRadius:6,
            border:"1px solid rgba(243,156,18,0.25)"
          }}>
            ⚠ 음력 입력은 양력으로 변환해 주십시오 (만세력 앱 또는 네이버 검색 활용).
            <br/>※ 사주는 절기(節氣) 기준이므로 음력 변환 후에도 정확한 절기를 통해 계산됩니다.
          </div>
        )}
      </Card>

      <button onClick={()=>isValid && onNext(form)} disabled={!isValid} style={{
        width:"100%", padding:"14px", marginTop:12, borderRadius:10,
        cursor: isValid ? "pointer" : "not-allowed",
        background: isValid
          ? "linear-gradient(135deg,rgba(201,168,76,0.3),rgba(180,140,60,0.15))"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${isValid ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.1)"}`,
        color: isValid ? "#f0e6c8" : "rgba(240,230,200,0.25)",
        fontSize:13, fontFamily:"inherit", letterSpacing:"0.25em", transition:"all 0.3s"
      }}>✦ 명식 세우기 →</button>
    </div>
  );
}

// ─── STEP 2: 명식 + 대운 ──────────────────────────────────
function Step2Saju({ pillars, meta, daeunInfo, sewoon, ilgan, currentAge, onNext, onBack }) {
  const labels = ["연주","월주","일주","시주"];
  const currentDaeunIdx = daeunInfo.daeuns.findIndex((d, i) => {
    const next = daeunInfo.daeuns[i+1];
    return currentAge >= d.age && (!next || currentAge < next.age);
  });

  return (
    <div style={{ animation:"fadeUp 0.5s ease both" }}>
      <Card title="사주 명식" subtitle="四柱八字">
        {meta && (
          <div style={{
            fontSize:9, color:"rgba(201,168,76,0.55)", marginBottom:10,
            textAlign:"center", letterSpacing:"0.05em",
            padding:"4px 8px", background:"rgba(201,168,76,0.05)", borderRadius:4
          }}>
            ✦ 절기 기준: {meta.currentTerm} 이후 · 사주년 {meta.sajuYear}
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:8 }}>
          {labels.map((l,i)=>(
            <div key={i} style={{
              flex:1, maxWidth:80, textAlign:"center", padding:"4px 0",
              background:"#a82020", borderRadius:5, fontSize:11, letterSpacing:"0.05em"
            }}>{l}</div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:5 }}>
          {pillars.map((p,i)=>(
            <div key={i} style={{ flex:1, maxWidth:80, textAlign:"center", fontSize:10,
              color: i===2 ? "#c9a84c" : "rgba(240,230,200,0.6)" }}>
              {i===2 ? "일간" : getSibsin(ilgan, p.gan)}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:6 }}>
          {pillars.map((p,i)=>{
            const c = ganColor(p.gan);
            return (
              <div key={i} style={{
                flex:1, maxWidth:80, height:64, borderRadius:8,
                background:c.bg, color:c.text, border:`1px solid ${c.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:36, fontWeight:700
              }}>{p.gan}</div>
            );
          })}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:5 }}>
          {pillars.map((p,i)=>{
            const c = jiColor(p.ji);
            return (
              <div key={i} style={{
                flex:1, maxWidth:80, height:64, borderRadius:8,
                background:c.bg, color:c.text, border:`1px solid ${c.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:36, fontWeight:700
              }}>{p.ji}</div>
            );
          })}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:8 }}>
          {pillars.map((p,i)=>(
            <div key={i} style={{ flex:1, maxWidth:80, textAlign:"center", fontSize:10, color:"rgba(240,230,200,0.6)" }}>
              {getSibsin(ilgan, p.ji)}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:6 }}>
          {pillars.map((p,i)=>(
            <div key={i} style={{ flex:1, maxWidth:80, textAlign:"center", fontSize:11, lineHeight:1.7 }}>
              {(JIJI[p.ji]?.jg || []).map(([g])=>(
                <span key={g} style={{
                  display:"inline-block", margin:"1px",
                  background:OC[CHEONGAN[g]?.o]?.bg, color:OC[CHEONGAN[g]?.o]?.text,
                  padding:"1px 4px", borderRadius:3
                }}>{g}</span>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card title="대운 · 세운" subtitle="大運 流年">
        <div style={{ fontSize:10, color:"rgba(201,168,76,0.6)", marginBottom:10, textAlign:"right" }}>
          {daeunInfo.sunhaeng ? "순행" : "역행"} · 대운수 {daeunInfo.daeunsu}세
          {daeunInfo.daysToTerm && <span style={{ opacity:0.6, marginLeft:6 }}>(입절까지 {daeunInfo.daysToTerm}일)</span>}
        </div>
        <div style={{ overflowX:"auto" }}>
          <div style={{ display:"flex", gap:5, minWidth:"max-content" }}>
            <div style={{
              padding:"8px 6px", borderRadius:6, minWidth:48,
              border:"2px solid #c9a84c", background:"rgba(201,168,76,0.1)",
              display:"flex", flexDirection:"column", alignItems:"center", gap:3
            }}>
              <div style={{ fontSize:9, color:"#c9a84c" }}>세운</div>
              <div style={{ fontSize:10, color:"rgba(240,230,200,0.5)" }}>{sewoon.year}</div>
              <div style={{ width:36, height:36, borderRadius:5,
                background:ganColor(sewoon.gan).bg, color:ganColor(sewoon.gan).text,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, fontWeight:700
              }}>{sewoon.gan}</div>
              <div style={{ width:36, height:36, borderRadius:5,
                background:jiColor(sewoon.ji).bg, color:jiColor(sewoon.ji).text,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, fontWeight:700
              }}>{sewoon.ji}</div>
            </div>
            <div style={{ width:1, background:"rgba(201,168,76,0.2)", margin:"0 3px" }}/>
            {daeunInfo.daeuns.map((d,i)=>{
              const isCur = i === currentDaeunIdx;
              return (
                <div key={i} style={{
                  padding:"8px 6px", borderRadius:6, minWidth:48,
                  border:`1px solid ${isCur ? "#c9a84c" : "rgba(201,168,76,0.15)"}`,
                  background: isCur ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.02)",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3
                }}>
                  <div style={{ fontSize:11, fontWeight:isCur?700:400, color:isCur?"#c9a84c":"rgba(240,230,200,0.7)" }}>{d.age}</div>
                  <div style={{ fontSize:9, color:"rgba(240,230,200,0.5)" }}>{getSibsin(ilgan, d.gan)}</div>
                  <div style={{ width:36, height:36, borderRadius:5,
                    background:ganColor(d.gan).bg, color:ganColor(d.gan).text,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:18, fontWeight:700,
                    boxShadow: isCur ? "0 0 8px rgba(201,168,76,0.5)" : "none"
                  }}>{d.gan}</div>
                  <div style={{ width:36, height:36, borderRadius:5,
                    background:jiColor(d.ji).bg, color:jiColor(d.ji).text,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:18, fontWeight:700
                  }}>{d.ji}</div>
                  <div style={{ fontSize:9, color:"rgba(240,230,200,0.5)" }}>{getSibsin(ilgan, d.ji)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <NavBtns onBack={onBack} onNext={onNext} nextLabel="오행 분석 →" />
    </div>
  );
}

// ─── STEP 3: 오행 ─────────────────────────────────────────
function Step3Ohaeng({ analysis, onNext, onBack }) {
  const [animated, setAnimated] = useState(false);
  useEffect(()=>{ setTimeout(()=>setAnimated(true), 200); }, []);

  return (
    <div style={{ animation:"fadeUp 0.5s ease both" }}>
      <Card title="신강 신약" subtitle="身强 身弱">
        <div style={{
          fontSize:9, color:"rgba(240,230,200,0.4)", marginBottom:10,
          padding:"6px 10px", background:"rgba(255,255,255,0.02)", borderRadius:4,
          lineHeight:1.6, fontStyle:"italic", textAlign:"center"
        }}>
          신강도 신약도 우열이 아닙니다. 자기 결을 이해하는 시작일 뿐.
        </div>
        <div style={{ textAlign:"center", marginBottom:14 }}>
          <div style={{
            fontSize:24, fontWeight:700, color:analysis.shingang.color,
            textShadow:`0 0 16px ${analysis.shingang.color}88`, letterSpacing:"0.1em"
          }}>{analysis.shingang.level}</div>
          <div style={{ fontSize:10, color:"rgba(240,230,200,0.4)", marginTop:3 }}>
            도아 {analysis.shingang.doaScore.toFixed(1)} : 극설 {analysis.shingang.geukScore.toFixed(1)}
          </div>
        </div>
        <div style={{ position:"relative", height:14, borderRadius:7,
          background:"linear-gradient(90deg,#c03030,#c07820,#c9a84c,#3a7ac0,#6030a0)",
          border:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{
            position:"absolute", top:"50%", transform:"translate(-50%,-50%)",
            left:`${(1-analysis.shingang.ratio)*100}%`,
            width:18, height:18, borderRadius:"50%",
            background:"#f0e6c8", border:"2px solid #c9a84c",
            boxShadow:"0 0 10px rgba(201,168,76,0.8)"
          }}/>
        </div>
      </Card>

      <Card title="오행 분포" subtitle="五行 分布">
        {OHAENG_LIST.map(o => {
          const c = OC[o], pct = analysis.pct[o];
          const isYong = analysis.yongsin.yong.includes(o);
          const isGi = analysis.yongsin.gi.includes(o);
          return (
            <div key={o} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{
                width:32, height:32, borderRadius:5, flexShrink:0,
                background:c.bg, border:`1px solid ${c.border}`, color:c.text,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, fontWeight:700,
                boxShadow: isYong ? `0 0 10px ${c.glow}` : "none"
              }}>{c.label}</div>
              <div style={{ flex:1, position:"relative" }}>
                <div style={{
                  height:24, borderRadius:4, background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,255,255,0.05)", overflow:"hidden"
                }}>
                  <div style={{
                    height:"100%", width: animated ? `${pct}%` : 0,
                    background:`linear-gradient(90deg, ${c.bg}, ${c.border})`,
                    transition:"width 0.9s ease"
                  }}/>
                </div>
                <div style={{
                  position:"absolute", right:6, top:"50%", transform:"translateY(-50%)",
                  fontSize:11, color:c.text, fontWeight:600
                }}>{pct}%</div>
              </div>
              <div style={{
                width:30, fontSize:9, fontWeight:600, textAlign:"center",
                color: isYong ? "#f1c40f" : isGi ? "#e74c3c" : "rgba(240,230,200,0.4)"
              }}>{isYong ? "용신" : isGi ? "기신" : ""}</div>
            </div>
          );
        })}
      </Card>

      <Card title="용신 판단" subtitle="用神 · 喜神 · 忌神">
        <div style={{
          fontSize:9, color:"rgba(240,230,200,0.4)", marginBottom:8,
          padding:"6px 10px", background:"rgba(255,255,255,0.02)", borderRadius:4,
          lineHeight:1.6, fontStyle:"italic"
        }}>
          ※ 좋은 오행도, 나쁜 오행도 없습니다. 각자의 자리에서 균형을 이룰 뿐.
        </div>
        {[
          { label:"용신 用神", arr:analysis.yongsin.yong, color:"#f1c40f", desc:"내면의 빛을 키우는 오행" },
          { label:"희신 喜神", arr:analysis.yongsin.hee, color:"#2ecc71", desc:"용신을 받쳐주는 동반자" },
          { label:"기신 忌神", arr:analysis.yongsin.gi,  color:"#e74c3c", desc:"균형을 위해 인식할 오행" },
          { label:"구신 仇神", arr:analysis.yongsin.gu,  color:"#e67e22", desc:"기신의 흐름을 더하는 결" },
          { label:"한신 閑神", arr:analysis.yongsin.han, color:"#7f8c8d", desc:"고요한 중립의 오행" },
        ].filter(x=>x.arr.length).map(item=>(
          <div key={item.label} style={{
            background:"rgba(255,255,255,0.025)", borderLeft:`3px solid ${item.color}`,
            borderRadius:6, padding:"9px 12px", marginBottom:6
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
              <span style={{ fontSize:11, fontWeight:700, color:item.color, letterSpacing:"0.08em" }}>{item.label}</span>
              <span style={{ fontSize:9, color:"rgba(240,230,200,0.4)" }}>· {item.desc}</span>
            </div>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {item.arr.map(o=>(
                <span key={o} style={{
                  background:OC[o].bg, color:OC[o].text, border:`1px solid ${OC[o].border}`,
                  borderRadius:4, padding:"3px 8px", fontSize:13, fontWeight:700
                }}>{OC[o].label}{o}</span>
              ))}
            </div>
          </div>
        ))}
      </Card>

      <NavBtns onBack={onBack} onNext={onNext} nextLabel="아스트로그램 →" />
    </div>
  );
}

// ─── STEP 4: 아스트로그램 ─────────────────────────────────
function Step4Astro({ astro, aspects, onNext, onBack }) {
  const [hovered, setHovered] = useState(null);
  const W = 360, CX = W/2, CY = W/2;
  const R_OUTER = 165, R_SIGN_SYM = 152, R_HOUSE = 122, R_PLANET = 100, R_INNER = 70;
  const ascLon = astro.ASC;

  function p2xy(angle, r) {
    const a = (angle - 90) * D2R;
    return { x: CX + r*Math.cos(a), y: CY + r*Math.sin(a) };
  }
  const lonToAngle = lon => norm(-(lon - ascLon) + 180);

  const planetKeys = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto","ASC"];
  const sortedP = planetKeys.map(k => ({ key:k, lon:astro[k], angle:lonToAngle(astro[k]) }))
    .sort((a,b)=>a.angle-b.angle);
  const MIN_GAP = 16;
  for (let pass=0; pass<3; pass++) {
    for (let i=0; i<sortedP.length; i++) {
      const prev = sortedP[(i-1+sortedP.length) % sortedP.length];
      let diff = sortedP[i].angle - prev.angle;
      if (diff < 0) diff += 360;
      if (diff < MIN_GAP && diff > 0) {
        sortedP[i].angle += (MIN_GAP-diff)/2;
        prev.angle -= (MIN_GAP-diff)/2;
      }
    }
  }
  const angleMap = Object.fromEntries(sortedP.map(p => [p.key, p.angle]));

  return (
    <div style={{ animation:"fadeUp 0.5s ease both" }}>
      <Card title="출생 차트" subtitle="Natal Chart · 星盤">
        <div style={{ display:"flex", gap:6, marginBottom:12, justifyContent:"center" }}>
          {["Sun","Moon","ASC"].map(k => {
            const pd = PLANET_DATA[k];
            return (
              <div key={k} style={{
                flex:1, background:"rgba(255,255,255,0.03)", borderRadius:6,
                border:`1px solid ${pd.color}33`, padding:"7px", textAlign:"center"
              }}>
                <div style={{ fontSize:14, color:pd.color, marginBottom:1 }}>{pd.sym}</div>
                <div style={{ fontSize:9, color:"rgba(240,230,200,0.5)" }}>{pd.kor}</div>
                <div style={{ fontSize:11, color:pd.color, marginTop:2, fontWeight:600 }}>{signLabel(astro[k])}</div>
              </div>
            );
          })}
        </div>

        <svg width="100%" viewBox={`0 0 ${W} ${W}`} style={{ display:"block" }}>
          <defs>
            <radialGradient id="bg2" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#0d1117"/><stop offset="100%" stopColor="#04070f"/>
            </radialGradient>
            <filter id="glw"><feGaussianBlur stdDeviation="1.5"/></filter>
          </defs>
          <circle cx={CX} cy={CY} r={R_OUTER+5} fill="url(#bg2)"/>

          {aspects.map((asp,i)=>{
            const p1 = astro[asp.p1], p2 = astro[asp.p2];
            if (typeof p1 !== "number" || typeof p2 !== "number") return null;
            const pt1 = p2xy(lonToAngle(p1), R_INNER-5);
            const pt2 = p2xy(lonToAngle(p2), R_INNER-5);
            return <line key={i} x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y}
              stroke={asp.type.color} strokeWidth={0.8} strokeOpacity={0.4}
              strokeDasharray={asp.type.angle===0?"none":"3 2"}/>;
          })}

          <circle cx={CX} cy={CY} r={R_INNER} fill="rgba(255,255,255,0.02)" stroke="rgba(201,168,76,0.15)"/>

          {[0,1,2,3,4,5,6,7,8,9,10,11].map(h=>{
            const angle = lonToAngle(h*30);
            const i1 = p2xy(angle, R_INNER), o1 = p2xy(angle, R_HOUSE);
            const isAng = h%3===0;
            return <line key={h} x1={i1.x} y1={i1.y} x2={o1.x} y2={o1.y}
              stroke={isAng?"rgba(201,168,76,0.4)":"rgba(201,168,76,0.12)"} strokeWidth={isAng?1.2:0.6}/>;
          })}

          {SIGNS.map((s,i)=>{
            const a1 = lonToAngle(i*30), a2 = lonToAngle((i+1)*30);
            const am = lonToAngle(i*30+15);
            const sa = p2xy(a1, R_HOUSE), sb = p2xy(a1, R_OUTER);
            const ea = p2xy(a2, R_OUTER), eb = p2xy(a2, R_HOUSE);
            const large = Math.abs(a2-a1)>180?1:0;
            const path = `M${sa.x},${sa.y} L${sb.x},${sb.y} A${R_OUTER},${R_OUTER} 0 ${large} 1 ${ea.x},${ea.y} L${eb.x},${eb.y} A${R_HOUSE},${R_HOUSE} 0 ${large} 0 ${sa.x},${sa.y}`;
            const symPt = p2xy(am, R_SIGN_SYM);
            return (
              <g key={i}>
                <path d={path} fill={EL_COLOR[s.el]} stroke="rgba(201,168,76,0.1)" strokeWidth={0.4}/>
                <text x={symPt.x} y={symPt.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={11} fill={s.color} filter="url(#glw)">{s.sym}</text>
              </g>
            );
          })}

          <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth={0.8}/>
          <circle cx={CX} cy={CY} r={R_HOUSE} fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth={0.6}/>

          {planetKeys.map(k=>{
            const lon = astro[k], pd = PLANET_DATA[k];
            const dispA = angleMap[k] ?? lonToAngle(lon);
            const origA = lonToAngle(lon);
            const pp = p2xy(dispA, R_PLANET);
            const op = p2xy(origA, R_HOUSE-3);
            const isHov = hovered === k;
            return (
              <g key={k} style={{ cursor:"pointer" }}
                onMouseEnter={()=>setHovered(k)} onMouseLeave={()=>setHovered(null)}>
                <line x1={pp.x} y1={pp.y} x2={op.x} y2={op.y} stroke={pd.color} strokeWidth={0.5} strokeOpacity={0.3} strokeDasharray="2 2"/>
                <circle cx={op.x} cy={op.y} r={2} fill={pd.color} opacity={0.7}/>
                <circle cx={pp.x} cy={pp.y} r={isHov?11:9}
                  fill={isHov ? pd.color+"44" : "rgba(13,17,23,0.85)"}
                  stroke={pd.color} strokeWidth={isHov?1.3:0.8}/>
                <text x={pp.x} y={pp.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={k==="ASC"?6:10} fill={pd.color} fontWeight="bold" filter="url(#glw)">{pd.sym}</text>
              </g>
            );
          })}

          <circle cx={CX} cy={CY} r={14} fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.3)"/>
          <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill="rgba(201,168,76,0.6)">✦</text>
        </svg>

        {hovered && (
          <div style={{
            marginTop:8, padding:"7px 11px",
            background:"rgba(255,255,255,0.04)", borderRadius:6,
            border:`1px solid ${PLANET_DATA[hovered].color}66`,
            fontSize:11, color:PLANET_DATA[hovered].color, textAlign:"center"
          }}>
            {PLANET_DATA[hovered].sym} {PLANET_DATA[hovered].kor} · {signLabel(astro[hovered])} ({SIGNS[signOf(astro[hovered])].name})
          </div>
        )}
      </Card>

      <Card title="주요 어스펙트" subtitle="Major Aspects">
        {aspects.length === 0 ? (
          <div style={{ textAlign:"center", color:"rgba(240,230,200,0.3)", fontSize:11, padding:10 }}>없음</div>
        ) : aspects.slice(0, 8).map((asp,i)=>{
          const p1 = PLANET_DATA[asp.p1], p2 = PLANET_DATA[asp.p2];
          return (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"6px 9px", borderRadius:5, marginBottom:3,
              background:"rgba(255,255,255,0.02)",
              borderLeft:`2px solid ${asp.type.color}`
            }}>
              <span style={{ color:p1.color, fontSize:13 }}>{p1.sym}</span>
              <span style={{ color:"rgba(240,230,200,0.5)", fontSize:11, flex:1 }}>{p1.kor}</span>
              <span style={{ color:asp.type.color, fontSize:14 }}>{asp.type.symbol}</span>
              <span style={{ color:"rgba(240,230,200,0.4)", fontSize:9 }}>±{asp.orb}°</span>
              <span style={{ color:p2.color, fontSize:11, flex:1, textAlign:"right" }}>{p2.kor}</span>
              <span style={{ color:p2.color, fontSize:13 }}>{p2.sym}</span>
            </div>
          );
        })}
      </Card>

      <NavBtns onBack={onBack} onNext={onNext} nextLabel="AI 통합 리딩 →" />
    </div>
  );
}

// ─── STEP 5: AI 리딩 ──────────────────────────────────────
const SECTIONS = [
  { key:"본성과_성격",         icon:"✦", title:"본성과 성격",         subtitle:"빛과 그림자를 함께",       color:"#c9a84c" },
  { key:"재능과_적성",         icon:"🌟", title:"재능과 적성",         subtitle:"발휘하며 기여하는 길",     color:"#2ecc71" },
  { key:"재물의_흐름",         icon:"💫", title:"재물의 흐름",         subtitle:"운영하는 지혜",            color:"#f39c12" },
  { key:"몸과_마음_돌봄",      icon:"☽",  title:"몸과 마음 돌봄",      subtitle:"자기 사랑의 언어",         color:"#1abc9c" },
  { key:"관계의_결",           icon:"♡",  title:"관계의 결",           subtitle:"좋은 사람이 되는 길",      color:"#e91e8c" },
  { key:"올해의_흐름과_기회",  icon:"⭐", title:"올해의 흐름과 기회",  subtitle:"성장의 자양분으로",        color:"#9b59b6" },
  { key:"오늘보다_나아지는_법", icon:"∞", title:"오늘보다 나아지는 법", subtitle:"이 명식의 북극성",        color:"#3498db" },
];

function useTypewriter(text, speed=10, active=true) {
  const [d, setD] = useState("");
  useEffect(()=>{
    if (!active || !text) { setD(text||""); return; }
    setD(""); let i = 0;
    const iv = setInterval(()=>{
      i++;
      setD(text.slice(0,i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return ()=>clearInterval(iv);
  }, [text, active]);
  return d;
}

function ReadingSection({ section, text, idx, visible }) {
  const typed = useTypewriter(visible ? text : "", 8, visible && !!text);
  const [open, setOpen] = useState(true);
  if (!visible) return null;
  return (
    <div style={{
      background:"rgba(8,12,26,0.85)", border:`1px solid ${section.color}33`,
      borderLeft:`3px solid ${section.color}`, borderRadius:10,
      marginBottom:8, overflow:"hidden",
      animation:`fadeUp 0.5s ${idx*0.06}s ease both`, opacity:0
    }}>
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"11px 14px", cursor:"pointer",
        background:`linear-gradient(90deg,${section.color}10, transparent)`,
        borderBottom: open ? `1px solid ${section.color}22` : "none"
      }} onClick={()=>setOpen(o=>!o)}>
        <span style={{ fontSize:15, color:section.color }}>{section.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:section.color, letterSpacing:"0.05em" }}>{section.title}</div>
          <div style={{ fontSize:8, color:"rgba(240,230,200,0.3)", letterSpacing:"0.12em", marginTop:1 }}>{section.subtitle}</div>
        </div>
        <span style={{ fontSize:9, color:`${section.color}88`, transform:open?"rotate(180deg)":"none", transition:"0.3s" }}>▼</span>
      </div>
      {open && (
        <div style={{ padding:"12px 14px" }}>
          {text ? (
            <p style={{ margin:0, fontSize:12.5, lineHeight:2, color:"rgba(240,230,200,0.8)", whiteSpace:"pre-wrap" }}>
              {typed}
              {typed.length < text.length && <span style={{ animation:"blink 0.7s infinite", color:section.color }}>│</span>}
            </p>
          ) : (
            <div style={{ color:"rgba(240,230,200,0.3)", fontSize:11 }}>분석 중...</div>
          )}
        </div>
      )}
    </div>
  );
}

function Step5Reading({ data, pillars, ilgan, analysis, daeunInfo, sewoon, astro, aspects, currentAge, onBack }) {
  const [status, setStatus] = useState("idle");
  const [reading, setReading] = useState({});
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState("");

  const currentDaeun = daeunInfo.daeuns.find((d,i)=>{
    const next = daeunInfo.daeuns[i+1];
    return currentAge >= d.age && (!next || currentAge < next.age);
  }) || daeunInfo.daeuns[0];

  function buildPrompt() {
    const labels = ["연주","월주","일주","시주"];
    const sajuStr = pillars.map((p,i)=>`${labels[i]}: ${p.gan}${p.ji} (${getSibsin(ilgan, p.gan)}·${getSibsin(ilgan, p.ji)})`).join("\n");
    const ohaengStr = OHAENG_LIST.map(o=>`${OC[o].label}(${o}) ${analysis.pct[o]}%`).join(" | ");
    const yongStr = `용신: ${analysis.yongsin.yong.join(",")} | 희신: ${analysis.yongsin.hee.join(",")} | 기신: ${analysis.yongsin.gi.join(",")}`;
    const astroStr = ["Sun","Moon","ASC","Mercury","Venus","Mars","Jupiter","Saturn"]
      .map(k=>`${PLANET_DATA[k].kor}: ${SIGNS[signOf(astro[k])].name} ${signLabel(astro[k])}`).join("\n");
    const aspectStr = aspects.slice(0,8).map(a=>`${PLANET_DATA[a.p1].kor} ${a.type.symbol} ${PLANET_DATA[a.p2].kor} (${a.type.name}, ±${a.orb}°)`).join("\n");

    return `[이 리딩의 북극성 — 절대 잊지 마십시오]
이 리딩의 목적은 단 하나입니다:
"오늘의 나보다 조금 더 나은 내가 되는 법, 그리고 주위 모든 사람에게 더 좋은 사람이 되는 것."
이 외의 모든 분석은 부차적입니다. 모든 섹션은 결국 이 두 방향으로 수렴해야 합니다.

[지켜야 할 원칙]
1. 좋은 사주도, 나쁜 사주도 없습니다. 모든 명식은 고유한 빛과 그림자를 함께 가지고 있습니다.
2. 단점·약점은 결함이 아니라 인간됨의 자연스러운 일부입니다. 따뜻하게, 부끄럽지 않게 받아들이도록 도와주십시오.
3. 운명을 단정 짓거나 예언하지 마십시오. "당신은 ~이다" 대신 "이런 결이 보이며, 이를 어떻게 마주할 수 있을지" 안내하십시오.
4. 두려움·공포·운명론적 경고 대신, 자비와 격려의 언어를 사용하십시오.
5. 강점은 겸손하게 발휘하도록, 약점은 자비롭게 안아주도록 이끌어주십시오.
6. 매 섹션 마지막에 "오늘 한 걸음 더 나아가기 위해" 할 수 있는 작고 구체적인 실천 하나를 제안하십시오.
7. 인간관계 섹션에서는 "내가 성장하는 것이 곧 주변에 좋은 사람이 되는 길"이라는 점을 분명히 일깨워 주십시오.
8. 사주명리와 점성술의 두 체계가 어떻게 공명하고 보완하는지 보여주되, 결국 모든 통찰은 자기 이해와 성장으로 수렴해야 합니다.

[기본 정보]
이름: ${data.name} | 성별: ${data.gender}명 | 나이: ${currentAge}세
생년월일시: ${data.year}년 ${data.month}월 ${data.day}일 ${data.hour}시 ${data.minute||0}분

[사주 명식]
${sajuStr}
일간: ${ilgan} (${CHEONGAN[ilgan].o} · ${CHEONGAN[ilgan].ey})
신강신약: ${analysis.shingang.level} (도아 ${analysis.shingang.doaScore.toFixed(1)} : 극설 ${analysis.shingang.geukScore.toFixed(1)})

[오행 분포]
${ohaengStr}
${yongStr}

[현재 대운/세운]
대운: ${currentDaeun.gan}${currentDaeun.ji} (${currentDaeun.age}~${currentDaeun.age+9}세)
세운: ${sewoon.year}년 ${sewoon.gan}${sewoon.ji}년

[아스트로그램]
${astroStr}

[주요 어스펙트]
${aspectStr}

반드시 아래 JSON 형식으로만 응답 (마크다운 코드블록 절대 금지):
{
  "본성과_성격": "사주 일간 + 어센던트 + 태양/달을 통합한 본성. 빛과 그림자를 함께 보되, 그림자도 따뜻하게 안아주는 톤으로. 마지막에 '오늘 자신에게 들려주면 좋을 한 마디'를 더해주세요. 350자 이상.",
  "재능과_적성": "타고난 재능과 그 재능을 어떻게 발휘할 때 자신과 주변 모두에게 좋은 영향을 주는지. 마지막에 작은 실천 하나. 350자 이상.",
  "재물의_흐름": "재물에 대한 태도와 운영 방식. 풍요/부족의 단정이 아니라 자기 운영의 지혜로. 마지막에 작은 실천 하나. 250자 이상.",
  "몸과_마음_돌봄": "오행과 어스펙트가 가리키는 몸과 마음의 결. 공포가 아닌 자기 사랑의 지혜로. 마지막에 작은 돌봄 실천 하나. 250자 이상.",
  "관계의_결": "관계 십신 + 금성/달 통합. '내가 어떤 사람이 되어야 주변에 좋은 사람이 될 수 있는가'를 중심으로. 마지막에 작은 실천 하나. 300자 이상.",
  "올해의_흐름과_기회": "${sewoon.year}년 세운과 대운이 가리키는 성장의 기회. 위기조차 어떻게 성장의 자양분으로 삼을지. 마지막에 올해 안에 시도해볼 작은 일 하나. 350자 이상.",
  "오늘보다_나아지는_법": "두 체계가 공통으로 가리키는, 이 사람이 '오늘보다 조금 더 나은 자신'이 되기 위한 인생의 화두. 그리고 그것이 어떻게 주변에 더 좋은 사람이 되는 길로 이어지는지. 350자 이상."
}`;
  }

  async function generate() {
    setStatus("loading"); setReading({}); setProgress(0); setErrMsg("");
    const pInt = setInterval(()=>setProgress(p=>Math.min(p+Math.random()*8, 88)), 400);
    try {
      const res = await fetch("/api/anthropic/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:4000,
          system:"당신은 사주명리학과 서양점성술을 통달했지만, 무엇보다 따뜻한 인생의 길잡이입니다. 좋은 사주도 나쁜 사주도 없으며, 모든 사람은 빛과 그림자를 함께 가진 존재임을 깊이 이해하고 있습니다. 운명을 단정 짓지 않고, 자기 이해와 성장으로 안내합니다. 두려움 대신 자비의 언어를 사용하며, 결국 모든 통찰은 '오늘보다 조금 더 나은 내가 되고, 주변에 더 좋은 사람이 되는 길'로 수렴해야 합니다. 반드시 순수 JSON만 반환하고 마크다운 코드블록을 절대 사용하지 마십시오.",
          messages:[{ role:"user", content: buildPrompt() }]
        })
      });
      clearInterval(pInt);
      if (!res.ok) {
        const e = await res.json().catch(()=>({}));
        throw new Error(e?.error?.message || `HTTP ${res.status}`);
      }
      const dat = await res.json();
      const raw = dat.content?.find(b=>b.type==="text")?.text || "";
      const cleaned = raw.replace(/^```json\s*/,"").replace(/```\s*$/,"").replace(/^```\s*/,"").trim();
      let parsed;
      try { parsed = JSON.parse(cleaned); }
      catch {
        const m = cleaned.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]); else throw new Error("JSON 파싱 오류");
      }
      setProgress(100); setReading(parsed); setStatus("done");
    } catch (e) {
      clearInterval(pInt); setErrMsg(e.message); setStatus("error");
    }
  }

  return (
    <div style={{ animation:"fadeUp 0.5s ease both" }}>
      {status === "idle" && (
        <Card title="AI 통합 리딩" subtitle="사주 + 아스트로그램 융합 분석">
          <div style={{
            padding:"12px 14px", marginBottom:14, borderRadius:8,
            background:"linear-gradient(135deg,rgba(201,168,76,0.06),rgba(155,89,182,0.04))",
            border:"1px solid rgba(201,168,76,0.2)",
            fontSize:11, lineHeight:1.9, color:"rgba(240,230,200,0.75)",
            fontStyle:"italic", textAlign:"center"
          }}>
            이 리딩은 운명을 예언하지 않습니다.<br/>
            <span style={{ color:"#c9a84c" }}>오늘의 나보다 조금 더 나은 내가 되고,<br/>
            주변 사람들에게 더 좋은 사람이 되는 길</span><br/>
            — 그 한 가지를 비추는 거울입니다.
          </div>
          <div style={{
            display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:14
          }}>
            {[
              ["일간", `${ilgan} · ${analysis.shingang.level}`],
              ["용신", analysis.yongsin.yong.map(o=>OC[o].label+o).join("·")],
              ["대운", `${currentDaeun.gan}${currentDaeun.ji}`],
              ["세운", `${sewoon.gan}${sewoon.ji}년`],
              ["태양", `${SIGNS[signOf(astro.Sun)].name}`],
              ["ASC",  SIGNS[signOf(astro.ASC)].name],
            ].map(([k,v])=>(
              <div key={k} style={{
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)",
                borderRadius:6, padding:"6px 10px", display:"flex", gap:6, alignItems:"center"
              }}>
                <span style={{ fontSize:9, color:"rgba(201,168,76,0.5)", minWidth:24 }}>{k}</span>
                <span style={{ fontSize:11, color:"rgba(240,230,200,0.85)" }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={generate} style={{
            width:"100%", padding:"14px",
            background:"linear-gradient(135deg,rgba(201,168,76,0.25),rgba(100,60,200,0.15))",
            border:"1px solid rgba(201,168,76,0.5)", borderRadius:8,
            color:"#f0e6c8", fontSize:13, fontFamily:"inherit",
            letterSpacing:"0.2em", cursor:"pointer", animation:"pulse 3s infinite"
          }}>✦ 통합 운명 리딩 생성</button>
        </Card>
      )}

      {status === "loading" && (
        <Card>
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ position:"relative", width:120, height:120, margin:"0 auto 16px" }}>
              <div style={{
                position:"absolute", top:"50%", left:"50%", width:30, height:30,
                margin:"-15px 0 0 -15px", borderRadius:"50%",
                background:"rgba(201,168,76,0.15)", border:"1px solid rgba(201,168,76,0.4)",
                display:"flex", alignItems:"center", justifyContent:"center", color:"#c9a84c", fontSize:14
              }}>✦</div>
              {[["orbA","#f39c12",4],["orbB","#bdc3c7",6],["orbC","#2ecc71",3]].map(([n,c,d],i)=>(
                <div key={i} style={{
                  position:"absolute", top:"50%", left:"50%", width:8, height:8,
                  margin:"-4px 0 0 -4px", borderRadius:"50%", background:c,
                  animation:`${n} ${d}s linear infinite`, boxShadow:`0 0 6px ${c}`
                }}/>
              ))}
              {[100,80,60].map((d,i)=>(
                <div key={i} style={{
                  position:"absolute", top:`calc(50% - ${d/2}px)`, left:`calc(50% - ${d/2}px)`,
                  width:d, height:d, borderRadius:"50%",
                  border:`1px solid rgba(201,168,76,${0.08+i*0.04})`
                }}/>
              ))}
            </div>
            <div style={{ fontSize:13, color:"rgba(240,230,200,0.7)", marginBottom:6 }}>사주와 별자리를 읽는 중...</div>
            <div style={{ fontSize:10, color:"rgba(240,230,200,0.35)", marginBottom:16 }}>동서양의 지혜를 통합하고 있습니다</div>
            <div style={{ height:3, borderRadius:2, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${progress}%`, transition:"width 0.4s",
                background:"linear-gradient(90deg,#c9a84c,#9b59b6)"
              }}/>
            </div>
            <div style={{ fontSize:9, color:"rgba(201,168,76,0.4)", marginTop:5 }}>{Math.floor(progress)}%</div>
          </div>
        </Card>
      )}

      {status === "error" && (
        <Card>
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>⚠</div>
            <div style={{ color:"#e74c3c", fontSize:12, marginBottom:12 }}>{errMsg}</div>
            <button onClick={generate} style={{
              padding:"7px 18px", borderRadius:5,
              background:"rgba(168,32,32,0.2)", border:"1px solid rgba(168,32,32,0.5)",
              color:"#ffaaaa", fontSize:11, cursor:"pointer", fontFamily:"inherit"
            }}>다시 시도</button>
          </div>
        </Card>
      )}

      {status === "done" && (
        <>
          <div style={{
            background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.3)",
            borderRadius:8, padding:"10px 14px", marginBottom:12,
            display:"flex", alignItems:"center", gap:8
          }}>
            <span style={{ color:"#c9a84c" }}>✦</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:"#c9a84c", letterSpacing:"0.08em" }}>통합 리딩 완료</div>
              <div style={{ fontSize:9, color:"rgba(240,230,200,0.35)" }}>{data.name} · {data.year}.{data.month}.{data.day}</div>
            </div>
            <button onClick={generate} style={{
              padding:"4px 10px", borderRadius:4, background:"transparent",
              border:"1px solid rgba(201,168,76,0.3)", color:"rgba(201,168,76,0.6)",
              fontSize:9, cursor:"pointer", fontFamily:"inherit"
            }}>↺ 재생성</button>
          </div>
          {SECTIONS.map((sec,i)=>(
            <ReadingSection key={sec.key} section={sec} text={reading[sec.key]||""} idx={i} visible={true} />
          ))}
          <div style={{
            marginTop:14, padding:"16px 18px", borderRadius:10,
            background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(155,89,182,0.05))",
            border:"1px solid rgba(201,168,76,0.25)",
            textAlign:"center", animation:"fadeUp 0.6s 0.5s ease both", opacity:0
          }}>
            <div style={{ fontSize:11, color:"#c9a84c", letterSpacing:"0.15em", marginBottom:8 }}>✦ 맺음말 ✦</div>
            <div style={{
              fontSize:12, lineHeight:2, color:"rgba(240,230,200,0.85)",
              fontStyle:"italic", letterSpacing:"0.02em"
            }}>
              운명은 당신을 결정짓지 않습니다.<br/>
              명식은 거울일 뿐, 길은 당신이 걷습니다.<br/>
              <br/>
              <span style={{ color:"#c9a84c" }}>오늘 한 걸음.<br/>
              그것이면 충분합니다.</span>
            </div>
          </div>
        </>
      )}

      <NavBtns onBack={onBack} hideNext />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  COMPATIBILITY MODE (궁합)
// ═══════════════════════════════════════════════════════════

// 차트 1개에 대해 명식/오행/점성술 모두 계산해 반환
function computeFullChart(d) {
  const sajuResult = getSajuPillars(d.year, d.month, d.day, d.hour, d.minute);
  const pillars = sajuResult.pillars;
  const meta = sajuResult.meta;
  const ilgan = pillars[2].gan;
  const analysis = analyzeOhaeng(pillars, ilgan);
  const astro = buildAstroChart(d.year, d.month, d.day, d.hour, d.minute, d.lat, d.lon);
  return { data: d, pillars, meta, ilgan, analysis, astro };
}

function ChartPickerForCompat({ charts, selected, onSelect, label, color }) {
  return (
    <div style={{
      background:"rgba(8,12,26,0.85)", border:`1px solid ${color}33`,
      borderLeft:`3px solid ${color}`, borderRadius:8, padding:"10px 12px"
    }}>
      <div style={{ fontSize:10, color, letterSpacing:"0.15em", marginBottom:8 }}>{label}</div>
      {selected ? (
        <div>
          <div style={{ fontSize:13, color:"#f0e6c8", marginBottom:3 }}>
            {selected.data.gender === "남" ? "☰" : "☷"} {selected.data.name || "이름 없음"}
          </div>
          <div style={{ fontSize:9, color:"rgba(240,230,200,0.5)" }}>
            {selected.data.year}.{String(selected.data.month).padStart(2,"0")}.{String(selected.data.day).padStart(2,"0")}
            {" · "}
            {selected.summary || ""}
          </div>
          <button onClick={()=>onSelect(null)} style={{
            marginTop:6, padding:"3px 9px", borderRadius:4, fontSize:9,
            background:"transparent", border:"1px solid rgba(201,168,76,0.2)",
            color:"rgba(201,168,76,0.6)", cursor:"pointer", fontFamily:"inherit"
          }}>변경</button>
        </div>
      ) : (
        <div style={{ maxHeight:140, overflowY:"auto" }}>
          {charts.length === 0 ? (
            <div style={{ fontSize:10, color:"rgba(240,230,200,0.4)", padding:"6px" }}>
              저장된 차트가 없습니다
            </div>
          ) : charts.map(c => (
            <button key={c.id} onClick={()=>onSelect(c)} style={{
              display:"block", width:"100%", textAlign:"left",
              padding:"6px 8px", marginBottom:3, borderRadius:4,
              background:"rgba(255,255,255,0.025)",
              border:"1px solid rgba(201,168,76,0.1)",
              color:"rgba(240,230,200,0.85)",
              fontSize:10, fontFamily:"inherit", cursor:"pointer"
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.1)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.025)"}>
              <span style={{ marginRight:5 }}>{c.data.gender === "남" ? "☰" : "☷"}</span>
              {c.data.name} <span style={{ color:"rgba(240,230,200,0.4)", fontSize:9 }}>· {c.data.year}.{c.data.month}.{c.data.day}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CompatibilityResult({ chart1, chart2, compat }) {
  const [readingStatus, setReadingStatus] = useState("idle"); // idle | loading | done | error
  const [reading, setReading] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [scoreAnim, setScoreAnim] = useState(0);

  useEffect(()=>{
    let i = 0;
    const target = compat.synergyScore;
    const iv = setInterval(()=>{
      i += 2;
      if (i >= target) { setScoreAnim(target); clearInterval(iv); }
      else setScoreAnim(i);
    }, 20);
    return ()=>clearInterval(iv);
  }, [compat.synergyScore]);

  function buildPrompt() {
    const c1 = chart1, c2 = chart2;
    return `[북극성]
이 궁합 리딩의 목적은 단 하나입니다:
"두 사람이 서로를 통해 더 나은 사람이 되고, 함께 더 좋은 영향을 세상에 주는 길"
점수나 우열을 가리는 것이 아닙니다.

[지켜야 할 원칙]
1. 좋은 궁합도 나쁜 궁합도 없습니다. 모든 관계는 고유한 결을 가지며, 어떤 결은 더 큰 노력이 필요할 뿐.
2. "맞다/안 맞다"의 단정 대신 "이런 결인데, 어떻게 함께 자랄 수 있을까"의 안내.
3. 충(衝)·형(刑)·원진(怨嗔)은 결함이 아니라 함께 다루어 갈 자료. 자극과 단련의 기회로 해석.
4. 한 쪽이 일방적으로 노력해야 한다는 식의 판단 금지. 서로 보완하는 길을 찾도록.
5. 매 섹션 끝에 두 사람이 함께할 수 있는 작은 실천을 제안.

[A의 정보]
이름: ${c1.data.name} | ${c1.data.gender}명 | ${c1.data.year}.${c1.data.month}.${c1.data.day} ${c1.data.hour}:${c1.data.minute||0}
명식: ${c1.pillars.map(p=>p.gan+p.ji).join(" ")}
일간: ${c1.ilgan} (${CHEONGAN[c1.ilgan].o}) · ${c1.analysis.shingang.level}
용신: ${c1.analysis.yongsin.yong.join(",")} | 기신: ${c1.analysis.yongsin.gi.join(",")}
태양: ${SIGNS[signOf(c1.astro.Sun)].name} | 달: ${SIGNS[signOf(c1.astro.Moon)].name} | 금성: ${SIGNS[signOf(c1.astro.Venus)].name}

[B의 정보]
이름: ${c2.data.name} | ${c2.data.gender}명 | ${c2.data.year}.${c2.data.month}.${c2.data.day} ${c2.data.hour}:${c2.data.minute||0}
명식: ${c2.pillars.map(p=>p.gan+p.ji).join(" ")}
일간: ${c2.ilgan} (${CHEONGAN[c2.ilgan].o}) · ${c2.analysis.shingang.level}
용신: ${c2.analysis.yongsin.yong.join(",")} | 기신: ${c2.analysis.yongsin.gi.join(",")}
태양: ${SIGNS[signOf(c2.astro.Sun)].name} | 달: ${SIGNS[signOf(c2.astro.Moon)].name} | 금성: ${SIGNS[signOf(c2.astro.Venus)].name}

[감지된 관계]
일간 관계: ${compat.ilganRelation?.type} (${compat.ilganRelation?.strength})
일지 관계: ${compat.iljiRelation?.type} (${compat.iljiRelation?.strength})
오행 보완 항목 수: ${compat.complementCount}개
A가 B로부터 받는 용신 점수: ${compat.yongCompat.aGetsFromB}%
B가 A로부터 받는 용신 점수: ${compat.yongCompat.bGetsFromA}%
점성 시너지: ${compat.astroSynergy.map(s=>`${s.label}(${s.aspect.name})`).join(", ") || "없음"}

반드시 아래 JSON 형식으로만 응답 (마크다운 코드블록 절대 금지):
{
  "관계의_본질": "두 사주가 만났을 때 자연스럽게 형성되는 결의 본질. 일간/일지 관계와 점성술이 무엇을 가리키는지. 350자 이상.",
  "서로에게_주는_빛": "A가 B에게, B가 A에게 어떤 자양분을 줄 수 있는지. 양방향으로. 300자 이상.",
  "함께_마주할_그림자": "이 관계에서 자연스럽게 부딪힐 수 있는 결. 비난이 아닌 이해의 톤으로. 300자 이상.",
  "함께_자라는_길": "이 관계가 두 사람을 어떻게 더 나은 사람으로 만들 수 있는지. 구체적으로. 함께할 수 있는 작은 실천 포함. 350자 이상.",
  "관계의_핵심_화두": "두 사람이 함께 깨달아 갈 인생의 화두 한 가지. 이 만남이 가진 깊은 의미. 250자 이상."
}`;
  }

  async function generate() {
    setReadingStatus("loading"); setReading({}); setProgress(0); setErrMsg("");
    const pInt = setInterval(()=>setProgress(p=>Math.min(p+Math.random()*7, 88)), 400);
    try {
      const res = await fetch("/api/anthropic/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:4000,
          system:"당신은 사주명리와 점성술 양쪽에 통달한 따뜻한 관계 상담자입니다. 두 사람의 궁합을 평가하지 않고, 서로를 통해 어떻게 더 나은 사람으로 자랄 수 있는지 비춰주는 거울 역할을 합니다. 좋은 궁합도 나쁜 궁합도 없습니다. 반드시 순수 JSON만 반환하고 마크다운 코드블록을 절대 사용하지 마십시오.",
          messages:[{ role:"user", content: buildPrompt() }]
        })
      });
      clearInterval(pInt);
      if (!res.ok) {
        const e = await res.json().catch(()=>({}));
        throw new Error(e?.error?.message || `HTTP ${res.status}`);
      }
      const dat = await res.json();
      const raw = dat.content?.find(b=>b.type==="text")?.text || "";
      const cleaned = raw.replace(/^```json\s*/,"").replace(/```\s*$/,"").replace(/^```\s*/,"").trim();
      let parsed;
      try { parsed = JSON.parse(cleaned); }
      catch {
        const m = cleaned.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]); else throw new Error("JSON 파싱 오류");
      }
      setProgress(100); setReading(parsed); setReadingStatus("done");
    } catch (e) {
      clearInterval(pInt); setErrMsg(e.message); setReadingStatus("error");
    }
  }

  const COMPAT_SECTIONS = [
    { key:"관계의_본질", title:"관계의 본질", subtitle:"두 사주가 만나 만드는 결", color:"#c9a84c", icon:"✦" },
    { key:"서로에게_주는_빛", title:"서로에게 주는 빛", subtitle:"양방향의 자양분", color:"#2ecc71", icon:"☀" },
    { key:"함께_마주할_그림자", title:"함께 마주할 그림자", subtitle:"이해로 풀어가는 결", color:"#9b59b6", icon:"☾" },
    { key:"함께_자라는_길", title:"함께 자라는 길", subtitle:"성장의 동반자로", color:"#3498db", icon:"∞" },
    { key:"관계의_핵심_화두", title:"관계의 핵심 화두", subtitle:"이 만남의 의미", color:"#e91e8c", icon:"♡" },
  ];

  const r1 = compat.ilganRelation, r2 = compat.iljiRelation;

  return (
    <div style={{ animation:"fadeUp 0.5s ease both" }}>
      {/* 두 사람 헤더 */}
      <div style={{
        display:"flex", alignItems:"center", gap:8, marginBottom:10,
        padding:"10px 12px",
        background:"linear-gradient(135deg,rgba(201,168,76,0.06),rgba(155,89,182,0.04))",
        border:"1px solid rgba(201,168,76,0.2)", borderRadius:8
      }}>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#f0e6c8" }}>
            {chart1.data.gender === "남" ? "☰" : "☷"} {chart1.data.name}
          </div>
          <div style={{ fontSize:9, color:"rgba(240,230,200,0.5)" }}>{chart1.pillars[2].gan}{chart1.pillars[2].ji}</div>
        </div>
        <div style={{ fontSize:18, color:"#c9a84c" }}>♡</div>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#f0e6c8" }}>
            {chart2.data.gender === "남" ? "☰" : "☷"} {chart2.data.name}
          </div>
          <div style={{ fontSize:9, color:"rgba(240,230,200,0.5)" }}>{chart2.pillars[2].gan}{chart2.pillars[2].ji}</div>
        </div>
      </div>

      {/* 시너지 점수 (참고용) */}
      <Card title="시너지 지표" subtitle="Synergy Indicator">
        <div style={{
          fontSize:9, color:"rgba(240,230,200,0.4)", marginBottom:10,
          padding:"6px 10px", background:"rgba(255,255,255,0.02)", borderRadius:4,
          lineHeight:1.6, fontStyle:"italic", textAlign:"center"
        }}>
          궁합에는 점수가 없습니다. 이것은 결의 강도를 가리킬 뿐입니다.
        </div>
        <div style={{ position:"relative", height:48, margin:"0 auto", textAlign:"center" }}>
          <div style={{
            fontSize:38, fontWeight:300,
            background:"linear-gradient(135deg,#c9a84c,#9b59b6)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            letterSpacing:"0.05em"
          }}>{scoreAnim}</div>
          <div style={{ fontSize:9, color:"rgba(240,230,200,0.4)", letterSpacing:"0.1em" }}>SYNERGY</div>
        </div>
      </Card>

      {/* 일간 / 일지 관계 */}
      <Card title="핵심 관계" subtitle="Core Relationships">
        {r1 && (
          <div style={{
            padding:"9px 12px", borderRadius:6, marginBottom:6,
            background:"rgba(255,255,255,0.025)",
            borderLeft:`3px solid ${r1.color}`
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
              <span style={{ fontSize:10, color:"rgba(201,168,76,0.5)", letterSpacing:"0.05em" }}>일간</span>
              <span style={{ fontSize:12, fontWeight:600, color:r1.color }}>{r1.type}</span>
              <span style={{ fontSize:9, color:"rgba(240,230,200,0.4)" }}>· {r1.strength}</span>
            </div>
            <div style={{ fontSize:10, color:"rgba(240,230,200,0.7)", lineHeight:1.7 }}>{r1.desc}</div>
          </div>
        )}
        {r2 && (
          <div style={{
            padding:"9px 12px", borderRadius:6, marginBottom:6,
            background:"rgba(255,255,255,0.025)",
            borderLeft:`3px solid ${r2.color}`
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
              <span style={{ fontSize:10, color:"rgba(201,168,76,0.5)", letterSpacing:"0.05em" }}>일지</span>
              <span style={{ fontSize:12, fontWeight:600, color:r2.color }}>{r2.type}</span>
              <span style={{ fontSize:9, color:"rgba(240,230,200,0.4)" }}>· {r2.strength}</span>
            </div>
            <div style={{ fontSize:10, color:"rgba(240,230,200,0.7)", lineHeight:1.7 }}>{r2.desc}</div>
          </div>
        )}
      </Card>

      {/* 오행 보완성 */}
      <Card title="오행 보완성" subtitle="Five Elements Balance">
        <div style={{
          fontSize:9, color:"rgba(240,230,200,0.4)", marginBottom:10,
          fontStyle:"italic", textAlign:"center"
        }}>
          보완 {compat.complementCount}개 영역 — 상대가 부족한 곳을 채워줄 수 있는 결
        </div>
        {OHAENG_LIST.map(o => {
          const item = compat.ohaengComplement.find(x=>x.ohaeng===o);
          const c = OC[o];
          return (
            <div key={o} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
              <div style={{
                width:24, height:24, borderRadius:4,
                background:c.bg, color:c.text, border:`1px solid ${c.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700
              }}>{c.label}</div>
              {/* A 막대 */}
              <div style={{ flex:1, position:"relative" }}>
                <div style={{
                  marginLeft:"auto", height:14, width:`${item.a}%`,
                  background:`linear-gradient(90deg, transparent, ${c.bg})`,
                  border:`1px solid ${c.border}66`, borderRadius:"7px 0 0 7px",
                  marginRight:0
                }}/>
              </div>
              <div style={{ fontSize:10, color:c.text, minWidth:30, textAlign:"center" }}>
                {item.a}|{item.b}
              </div>
              {/* B 막대 */}
              <div style={{ flex:1, position:"relative" }}>
                <div style={{
                  height:14, width:`${item.b}%`,
                  background:`linear-gradient(90deg, ${c.bg}, transparent)`,
                  border:`1px solid ${c.border}66`, borderRadius:"0 7px 7px 0"
                }}/>
              </div>
              {item.complement && (
                <span style={{ fontSize:10, color:"#2ecc71" }}>✓</span>
              )}
            </div>
          );
        })}
      </Card>

      {/* 점성술 시너지 */}
      {compat.astroSynergy.length > 0 && (
        <Card title="점성술 시너지" subtitle="Astrological Synergy">
          {compat.astroSynergy.slice(0,5).map((s,i)=>(
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"7px 10px", borderRadius:5, marginBottom:4,
              background:"rgba(255,255,255,0.02)",
              borderLeft:`2px solid ${s.aspect.color}`
            }}>
              <span style={{ color:s.aspect.color, fontSize:14 }}>{s.aspect.sym}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:"#f0e6c8" }}>{s.label} <span style={{ color:s.aspect.color, fontSize:10 }}>{s.aspect.name}</span></div>
                <div style={{ fontSize:9, color:"rgba(240,230,200,0.5)" }}>{s.desc}</div>
              </div>
              <span style={{ fontSize:9, color:"rgba(240,230,200,0.3)" }}>{s.angle}°</span>
            </div>
          ))}
        </Card>
      )}

      {/* AI 리딩 영역 */}
      {readingStatus === "idle" && (
        <Card title="AI 관계 리딩" subtitle="동서양 통합 분석">
          <div style={{
            padding:"12px 14px", marginBottom:14, borderRadius:8,
            background:"linear-gradient(135deg,rgba(201,168,76,0.06),rgba(155,89,182,0.04))",
            border:"1px solid rgba(201,168,76,0.2)",
            fontSize:11, lineHeight:1.9, color:"rgba(240,230,200,0.75)",
            fontStyle:"italic", textAlign:"center"
          }}>
            이 리딩은 두 사람이<br/>
            <span style={{ color:"#c9a84c" }}>서로를 통해 더 나은 사람이 되고,<br/>
            함께 더 좋은 영향을 세상에 주는 길</span><br/>
            을 비추는 거울입니다.
          </div>
          <button onClick={generate} style={{
            width:"100%", padding:"14px",
            background:"linear-gradient(135deg,rgba(201,168,76,0.25),rgba(155,89,182,0.15))",
            border:"1px solid rgba(201,168,76,0.5)", borderRadius:8,
            color:"#f0e6c8", fontSize:13, fontFamily:"inherit",
            letterSpacing:"0.2em", cursor:"pointer", animation:"pulse 3s infinite"
          }}>♡ 관계 리딩 생성</button>
        </Card>
      )}

      {readingStatus === "loading" && (
        <Card>
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:36, color:"#c9a84c", marginBottom:12,
              animation:"pulse 2s infinite" }}>♡</div>
            <div style={{ fontSize:13, color:"rgba(240,230,200,0.7)", marginBottom:6 }}>
              두 영혼의 결을 읽는 중...
            </div>
            <div style={{ height:3, borderRadius:2, marginTop:14,
              background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${progress}%`, transition:"width 0.4s",
                background:"linear-gradient(90deg,#c9a84c,#e91e8c)"
              }}/>
            </div>
            <div style={{ fontSize:9, color:"rgba(201,168,76,0.4)", marginTop:5 }}>{Math.floor(progress)}%</div>
          </div>
        </Card>
      )}

      {readingStatus === "error" && (
        <Card>
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>⚠</div>
            <div style={{ color:"#e74c3c", fontSize:12, marginBottom:12 }}>{errMsg}</div>
            <button onClick={generate} style={{
              padding:"7px 18px", borderRadius:5,
              background:"rgba(168,32,32,0.2)", border:"1px solid rgba(168,32,32,0.5)",
              color:"#ffaaaa", fontSize:11, cursor:"pointer", fontFamily:"inherit"
            }}>다시 시도</button>
          </div>
        </Card>
      )}

      {readingStatus === "done" && (
        <>
          {COMPAT_SECTIONS.map((sec,i)=>(
            <ReadingSection key={sec.key} section={sec} text={reading[sec.key]||""} idx={i} visible={true}/>
          ))}
          <div style={{
            marginTop:14, padding:"16px 18px", borderRadius:10,
            background:"linear-gradient(135deg,rgba(201,168,76,0.08),rgba(233,30,140,0.05))",
            border:"1px solid rgba(201,168,76,0.25)",
            textAlign:"center", animation:"fadeUp 0.6s 0.5s ease both", opacity:0
          }}>
            <div style={{ fontSize:11, color:"#c9a84c", letterSpacing:"0.15em", marginBottom:8 }}>✦ 맺음말 ✦</div>
            <div style={{
              fontSize:12, lineHeight:2, color:"rgba(240,230,200,0.85)",
              fontStyle:"italic"
            }}>
              모든 관계는 서로를 비추는 거울입니다.<br/>
              <span style={{ color:"#c9a84c" }}>서로를 통해 자라는 두 사람만이<br/>
              세상에 더 좋은 영향을 줄 수 있습니다.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CompatibilityMode({ charts, onClose }) {
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);
  const [computed1, setComputed1] = useState(null);
  const [computed2, setComputed2] = useState(null);
  const [compat, setCompat] = useState(null);

  function startAnalysis() {
    if (!chart1 || !chart2) return;
    const c1 = computeFullChart(chart1.data);
    const c2 = computeFullChart(chart2.data);
    const result = analyzeCompatibility(c1, c2);
    setComputed1(c1);
    setComputed2(c2);
    setCompat(result);
  }

  function reset() {
    setChart1(null); setChart2(null);
    setComputed1(null); setComputed2(null); setCompat(null);
  }

  if (computed1 && computed2 && compat) {
    return (
      <div>
        <div style={{ display:"flex", gap:6, marginBottom:10 }}>
          <button onClick={reset} style={{
            flex:1, padding:"8px",
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(201,168,76,0.2)",
            borderRadius:6, color:"rgba(240,230,200,0.7)",
            fontSize:11, fontFamily:"inherit", cursor:"pointer"
          }}>← 다시 선택</button>
          <button onClick={onClose} style={{
            flex:1, padding:"8px",
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(201,168,76,0.2)",
            borderRadius:6, color:"rgba(240,230,200,0.7)",
            fontSize:11, fontFamily:"inherit", cursor:"pointer"
          }}>✕ 궁합 모드 종료</button>
        </div>
        <CompatibilityResult chart1={computed1} chart2={computed2} compat={compat}/>
      </div>
    );
  }

  return (
    <div style={{ animation:"fadeUp 0.5s ease both" }}>
      <Card title="궁합 분석" subtitle="Compatibility Analysis">
        <div style={{
          padding:"10px 12px", marginBottom:14, borderRadius:6,
          background:"linear-gradient(135deg,rgba(201,168,76,0.05),rgba(233,30,140,0.04))",
          border:"1px solid rgba(201,168,76,0.18)",
          fontSize:11, lineHeight:1.8, color:"rgba(240,230,200,0.7)",
          fontStyle:"italic", textAlign:"center"
        }}>
          좋은 궁합도 나쁜 궁합도 없습니다.<br/>
          <span style={{ color:"#c9a84c" }}>서로를 통해 자라는 길을 비추는 거울일 뿐.</span>
        </div>

        {charts.length < 2 ? (
          <div style={{
            padding:"20px", textAlign:"center",
            color:"rgba(240,230,200,0.5)", fontSize:12, lineHeight:1.8
          }}>
            궁합 분석을 위해서는<br/>
            <strong style={{ color:"#c9a84c" }}>최소 2개의 저장된 차트</strong>가 필요합니다.<br/>
            <span style={{ fontSize:10, color:"rgba(240,230,200,0.4)" }}>
              ({charts.length}개 / 2개)
            </span>
            <br/><br/>
            <button onClick={onClose} style={{
              padding:"8px 18px", borderRadius:6,
              background:"rgba(201,168,76,0.1)",
              border:"1px solid rgba(201,168,76,0.3)",
              color:"#c9a84c", fontSize:11,
              fontFamily:"inherit", cursor:"pointer"
            }}>← 차트 더 만들기</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:10 }}>
              <ChartPickerForCompat
                charts={charts.filter(c=>c.id !== chart2?.id)}
                selected={chart1}
                onSelect={setChart1}
                label="A · 첫 번째 사람"
                color="#c9a84c"
              />
            </div>
            <div style={{ textAlign:"center", margin:"4px 0", fontSize:14, color:"#e91e8c" }}>♡</div>
            <div style={{ marginBottom:14 }}>
              <ChartPickerForCompat
                charts={charts.filter(c=>c.id !== chart1?.id)}
                selected={chart2}
                onSelect={setChart2}
                label="B · 두 번째 사람"
                color="#e91e8c"
              />
            </div>

            <button
              onClick={startAnalysis}
              disabled={!chart1 || !chart2}
              style={{
                width:"100%", padding:"12px",
                cursor:(chart1&&chart2)?"pointer":"not-allowed",
                background:(chart1&&chart2)
                  ? "linear-gradient(135deg,rgba(201,168,76,0.3),rgba(233,30,140,0.15))"
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${(chart1&&chart2)?"rgba(201,168,76,0.5)":"rgba(201,168,76,0.1)"}`,
                borderRadius:8,
                color:(chart1&&chart2)?"#f0e6c8":"rgba(240,230,200,0.25)",
                fontSize:12, fontFamily:"inherit", letterSpacing:"0.2em"
              }}>
              ✦ 두 사주의 결 비추기 →
            </button>
          </>
        )}
      </Card>

      <button onClick={onClose} style={{
        width:"100%", padding:"10px", marginTop:8, borderRadius:6,
        background:"transparent",
        border:"1px solid rgba(201,168,76,0.2)",
        color:"rgba(240,230,200,0.5)",
        fontSize:11, fontFamily:"inherit", cursor:"pointer"
      }}>← 일반 분석으로 돌아가기</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name:"", gender:"여", calType:"양력",
    year:1990, month:5, day:15, hour:12, minute:0,
    lat:37.57, lon:126.98, locationName:"서울특별시"
  });
  const [computed, setComputed] = useState(null);
  const [charts, setCharts] = useState(()=>loadCharts());
  const [currentChartId, setCurrentChartId] = useState(null);
  const [mode, setMode] = useState("single"); // "single" | "compat"

  function handleStep1Next(formData) {
    setData(formData);
    const sajuResult = getSajuPillars(formData.year, formData.month, formData.day, formData.hour, formData.minute);
    const pillars = sajuResult.pillars;
    const meta = sajuResult.meta;
    const ilgan = pillars[2].gan;
    const analysis = analyzeOhaeng(pillars, ilgan);
    const daeunInfo = calcDaeun(pillars, formData.gender, meta);
    const currentAge = new Date().getFullYear() - formData.year + 1;
    const currentYear = new Date().getFullYear();
    const sewoon = calcSewoon(currentYear);
    const astro = buildAstroChart(formData.year, formData.month, formData.day, formData.hour, formData.minute, formData.lat, formData.lon);
    const aspects = calcAspects(astro);
    setComputed({ pillars, meta, ilgan, analysis, daeunInfo, sewoon, astro, aspects, currentAge });
    setStep(1);
  }

  // ─── 차트 저장/불러오기/삭제 ───
  function saveCurrentChart() {
    if (!computed) return;
    const summary = `${computed.pillars[2].gan}${computed.pillars[2].ji} 일주`;
    if (currentChartId) {
      // 업데이트
      const updated = charts.map(c =>
        c.id === currentChartId
          ? { ...c, data, summary, savedAt: new Date().toISOString() }
          : c
      );
      setCharts(updated);
      persistCharts(updated);
    } else {
      // 신규 저장
      const newChart = {
        id: Date.now().toString() + "-" + Math.random().toString(36).slice(2,7),
        savedAt: new Date().toISOString(),
        data: { ...data },
        summary,
      };
      const updated = [newChart, ...charts];
      setCharts(updated);
      persistCharts(updated);
      setCurrentChartId(newChart.id);
    }
  }

  function loadChart(chart) {
    setData(chart.data);
    setCurrentChartId(chart.id);
    handleStep1Next(chart.data);
  }

  function deleteChart(id) {
    const updated = charts.filter(c => c.id !== id);
    setCharts(updated);
    persistCharts(updated);
    if (currentChartId === id) setCurrentChartId(null);
  }

  function importCharts(imported) {
    // 기존과 합치되 id 중복 시 가져온 쪽이 우선
    const existingIds = new Set(charts.map(c=>c.id));
    const newOnes = imported.filter(c => c && c.id && c.data && !existingIds.has(c.id));
    const merged = [...newOnes, ...charts];
    setCharts(merged);
    persistCharts(merged);
    alert(`${newOnes.length}개의 차트를 가져왔습니다`);
  }

  function newChart() {
    setCurrentChartId(null);
    setComputed(null);
    setStep(0);
  }

  const labels = ["입력","명식","오행","점성","리딩"];
  const isSaved = currentChartId !== null;

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#04070f 0%,#080c1a 50%,#060a16 100%)",
      padding:"20px 14px", fontFamily:"'Noto Serif KR',serif", color:"#f0e6c8"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.2)} 50%{box-shadow:0 0 16px 0 rgba(201,168,76,0.4)} }
        @keyframes orbA { from{transform:rotate(0deg) translateX(50px) rotate(0deg)} to{transform:rotate(360deg) translateX(50px) rotate(-360deg)} }
        @keyframes orbB { from{transform:rotate(120deg) translateX(40px) rotate(-120deg)} to{transform:rotate(480deg) translateX(40px) rotate(-480deg)} }
        @keyframes orbC { from{transform:rotate(240deg) translateX(30px) rotate(-240deg)} to{transform:rotate(600deg) translateX(30px) rotate(-600deg)} }
        input:focus { border-color:rgba(201,168,76,0.6)!important; }
        ::-webkit-scrollbar { height:4px; width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.3); border-radius:2px; }
      `}</style>

      <div style={{ maxWidth:520, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:16, animation:"fadeUp 0.5s ease both" }}>
          <div style={{ fontSize:9, letterSpacing:"0.4em", color:"#c9a84c", opacity:0.7, marginBottom:5 }}>
            ✦ 사주명리 · 서양점성술 통합 ✦
          </div>
          <h1 style={{ fontSize:20, fontWeight:300, letterSpacing:"0.12em", margin:0 }}>
            命 · Astrochart · 統合
          </h1>
          <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)", margin:"10px 0" }}/>
          <div style={{
            fontSize:10, lineHeight:1.9, color:"rgba(240,230,200,0.55)",
            fontStyle:"italic", letterSpacing:"0.03em",
            maxWidth:380, margin:"0 auto"
          }}>
            좋은 사주도 나쁜 사주도 없습니다.<br/>
            누구나 빛과 그림자를 함께 가지고 있습니다.
          </div>
          <div style={{
            fontSize:11, lineHeight:1.9, color:"#c9a84c",
            letterSpacing:"0.05em", marginTop:10,
            maxWidth:380, margin:"10px auto 0",
            padding:"8px 14px",
            background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.06),transparent)",
            borderTop:"1px solid rgba(201,168,76,0.2)",
            borderBottom:"1px solid rgba(201,168,76,0.2)"
          }}>
            오늘의 나보다 조금 더 나은 내가 되는 법,<br/>
            <span style={{ opacity:0.8 }}>그리고 주위 사람들에게 더 좋은 사람이 되는 것</span>
          </div>
        </div>

        {mode === "single" && <StepIndicator step={step} total={5} labels={labels} />}

        {/* 모드 토글 (Step 1에서만 표시) */}
        {step === 0 && mode === "single" && (
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            <button onClick={()=>setMode("single")} style={{
              flex:1, padding:"8px", borderRadius:6, cursor:"pointer",
              background:"rgba(201,168,76,0.15)",
              border:"1px solid rgba(201,168,76,0.4)",
              color:"#c9a84c", fontSize:11, fontFamily:"inherit",
              letterSpacing:"0.05em"
            }}>✦ 단일 분석</button>
            <button onClick={()=>setMode("compat")} style={{
              flex:1, padding:"8px", borderRadius:6, cursor:"pointer",
              background:"rgba(255,255,255,0.025)",
              border:"1px solid rgba(233,30,140,0.2)",
              color:"rgba(233,30,140,0.7)", fontSize:11, fontFamily:"inherit",
              letterSpacing:"0.05em"
            }}>♡ 궁합 분석</button>
          </div>
        )}

        {/* 궁합 모드 */}
        {mode === "compat" && (
          <CompatibilityMode
            charts={charts}
            onClose={()=>setMode("single")}
          />
        )}

        {/* 저장된 차트 패널 (Step 1 + single 모드에서만) */}
        {mode === "single" && step === 0 && (
          <SavedChartsPanel
            charts={charts}
            onLoad={loadChart}
            onDelete={deleteChart}
            onExport={()=>exportChartsJSON(charts)}
            onImport={importCharts}
          />
        )}

        {/* 현재 차트 액션 바 (Step 2-5 + single 모드에서만) */}
        {mode === "single" && step > 0 && computed && (
          <div style={{
            display:"flex", alignItems:"center", gap:6, marginBottom:10,
            padding:"6px 10px",
            background:"rgba(255,255,255,0.02)", borderRadius:6,
            border:"1px solid rgba(255,255,255,0.05)"
          }}>
            <span style={{ fontSize:11, color:"rgba(240,230,200,0.6)" }}>
              {data.gender === "남" ? "☰" : "☷"} {data.name || "이름 없음"}
              {isSaved && <span style={{ color:"#2ecc71", marginLeft:6, fontSize:9 }}>● 저장됨</span>}
            </span>
            <div style={{ flex:1 }}/>
            <SaveChartButton onSave={saveCurrentChart} saved={isSaved}/>
            <button onClick={newChart} style={{
              padding:"6px 10px", borderRadius:5, cursor:"pointer",
              background:"transparent",
              border:"1px solid rgba(201,168,76,0.2)",
              color:"rgba(201,168,76,0.6)",
              fontSize:10, fontFamily:"inherit", letterSpacing:"0.05em"
            }}>+ 새 차트</button>
          </div>
        )}

        {mode === "single" && step === 0 && <Step1Input data={data} onNext={handleStep1Next} />}
        {mode === "single" && step === 1 && computed && (
          <Step2Saju
            pillars={computed.pillars} meta={computed.meta}
            daeunInfo={computed.daeunInfo}
            sewoon={computed.sewoon} ilgan={computed.ilgan}
            currentAge={computed.currentAge}
            onNext={()=>setStep(2)} onBack={()=>setStep(0)}
          />
        )}
        {mode === "single" && step === 2 && computed && (
          <Step3Ohaeng analysis={computed.analysis}
            onNext={()=>setStep(3)} onBack={()=>setStep(1)} />
        )}
        {mode === "single" && step === 3 && computed && (
          <Step4Astro astro={computed.astro} aspects={computed.aspects}
            onNext={()=>setStep(4)} onBack={()=>setStep(2)} />
        )}
        {mode === "single" && step === 4 && computed && (
          <Step5Reading data={data} {...computed} onBack={()=>setStep(3)} />
        )}

        <div style={{ textAlign:"center", marginTop:14, fontSize:9, color:"rgba(201,168,76,0.2)", letterSpacing:"0.2em" }}>
          四柱命理 · Western Astrology · Integrated Reading
        </div>
      </div>
    </div>
  );
}
