/* Kalkulator ryzyka 30-dniowej śmiertelności — inferencja w przeglądarce (onnxruntime-web).
   Żadne dane nie opuszczają urządzenia. Wyłącznie do celów badawczych. */
"use strict";

const CDN = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
ort.env.wasm.wasmPaths = CDN;
ort.env.wasm.numThreads = 1;          // jednowątkowo: brak wymogu nagłówków COOP/COEP (działa na GitHub Pages)

const GAUGE_MAX = 60;                  // skala wskaźnika kołowego: 0–60%

const $ = (id) => document.getElementById(id);
const btn = $("btn");
const ctaTxt = btn.querySelector(".cta-txt");

let session = null;
let FEAT = null;
let INPUT_NAME = "input";
let arcLen = 0;

function setBtn(text, { loading = false, disabled = false } = {}) {
  ctaTxt.textContent = text;
  btn.disabled = disabled;
  btn.classList.toggle("loading", loading);
}

async function init() {
  // przygotuj długość łuku wskaźnika
  const arc = $("gaugeArc");
  arcLen = arc.getTotalLength();
  arc.style.strokeDasharray = arcLen;
  arc.style.strokeDashoffset = arcLen;   // start: pusty

  try {
    const spec = await (await fetch("model_features.json", { cache: "no-store" })).json();
    FEAT = spec.feat;
    session = await ort.InferenceSession.create("model.onnx", { executionProviders: ["wasm"] });
    INPUT_NAME = session.inputNames[0] || "input";
    setBtn("Oblicz ryzyko", { disabled: false });
  } catch (e) {
    console.error(e);
    setBtn("Błąd ładowania modelu", { disabled: true });
    btn.title = String(e);
  }
}

/* Zbiera wartości z formularza i mapuje na cechy modelu (dokładne nazwy cech jako klucze).
   Mapowanie 1:1 z kalkulator_app_streamlit_referencja.py (model uniwersalny, 26 cech). */
function collectValues() {
  const yn = (id) => ($(id).checked ? 1 : 0);
  const nyha = $("nyha").value;
  const tryb = $("tryb").value;
  const plucna = $("plucna").value;   // "brak" | "moderate" | "severe"
  const weight = $("weight").value;   // "cabg" | "noncabg" | "2" | "3"
  return {
    "age_final": +$("wiek").value,
    "Frakcja wyrzutowa wg ECHO (EF) - wartość (%)": +$("ef").value,
    "Ostatni poziom kreatyniny przed operacją (mg/dl)": +$("krea").value,
    "Masa ciała (kg)": +$("masa").value,
    "Płeć": +$("plec").value,                       // 1 = mężczyzna, 0 = kobieta
    "Czy ta operacja jest reoperacją?": yn("reop"),
    "Krytyczny stan przedoperacyjny": yn("kryt"),
    "Chronic lung disease": yn("copd"),
    "Extracardiac arteriopathy": yn("arterio"),
    "Poor mobility": yn("mobil"),
    "Świeży zawał serca": yn("zawal"),
    "Zapalenie wsierdzia": yn("endo"),
    "Leczenie cukrzycy - Insulina (z lekami doustnymi lub bez)": yn("insulina"),
    "NYHA (stan obecny) - NYHA III": nyha === "III" ? 1 : 0,
    "NYHA (stan obecny) - NYHA IV": nyha === "IV" ? 1 : 0,
    "CCS Class - CCS 4": yn("ccs4"),
    "Pulmonary hypertension - moderate (PA systolic 31-55 mmHg)": plucna === "moderate" ? 1 : 0,
    "Pulmonary hypertension - severe (PA systolic >55 mmHg)": plucna === "severe" ? 1 : 0,
    "Tryb operacji - Planowa": tryb === "Planowa" ? 1 : 0,
    "Tryb operacji - Pilna: pacjent nie był przyjęty w celu operacji, ale wymaga operacji w trakcie tego pobytu ze względów medycznych i nie może być wypisany bez operacji.":
      tryb === "Pilna" ? 1 : 0,
    "Tryb operacji - Ratująca życie: pacjent wymagał resuscytacji krążeniowo-oddechowej w drodze na blok operacyjny lub przed indukcją znieczulenia.":
      tryb === "Ratująca życie" ? 1 : 0,
    "Weight of the intervention - isolated CABG": weight === "cabg" ? 1 : 0,
    "Weight of the intervention - single non CABG": weight === "noncabg" ? 1 : 0,
    "Weight of the intervention - 2 procedures": weight === "2" ? 1 : 0,
    "Weight of the intervention - 3 procedures": weight === "3" ? 1 : 0,
    "Operacja aorty piersiowej": yn("aorta"),
  };
}

async function predict() {
  const vals = collectValues();
  const x = new Float32Array(FEAT.length);
  for (let i = 0; i < FEAT.length; i++) {
    const v = vals[FEAT[i]];
    if (v === undefined || Number.isNaN(v)) throw new Error("Brak/niepoprawna wartość cechy: " + FEAT[i]);
    x[i] = v;
  }
  const out = await session.run({ [INPUT_NAME]: new ort.Tensor("float32", x, [1, FEAT.length]) });

  let prob = null;
  for (const name of Object.keys(out)) {
    const t = out[name];
    if (t.dims && t.dims.length === 2 && t.dims[1] === 2) { prob = t.data[1]; break; }
  }
  if (prob === null) {
    const last = out[session.outputNames[session.outputNames.length - 1]];
    prob = last.data[last.data.length - 1];
  }
  return prob * 100;
}

function levelFor(risk) {
  if (risk < 2)  return { txt: "Ryzyko niskie",       dot: "🟢", color: "var(--green)",  bg: "#dcfce7", fg: "#15803d" };
  if (risk < 5)  return { txt: "Ryzyko umiarkowane",  dot: "🟡", color: "var(--yellow)", bg: "#fef3c7", fg: "#b45309" };
  if (risk < 10) return { txt: "Ryzyko podwyższone",  dot: "🟠", color: "var(--orange)", bg: "#ffedd5", fg: "#c2410c" };
  return            { txt: "Ryzyko wysokie",       dot: "🔴", color: "var(--red)",    bg: "#fee2e2", fg: "#b91c1c" };
}

const fmtPct = (p) => p.toFixed(1).replace(".", ",") + "%";

function showResult(risk) {
  const lvl = levelFor(risk);
  $("riskPct").textContent = fmtPct(risk);
  $("riskPct").style.color = lvl.color;

  const pill = $("riskLevel");
  pill.textContent = lvl.dot + " " + lvl.txt;
  pill.style.background = lvl.bg;
  pill.style.color = lvl.fg;

  // wskaźnik kołowy
  const frac = Math.min(risk / GAUGE_MAX, 1);
  const arc = $("gaugeArc");
  arc.style.stroke = lvl.color;
  arc.style.strokeDashoffset = arcLen * (1 - frac);

  const res = $("result");
  res.classList.remove("hidden");
  res.classList.remove("show"); void res.offsetWidth; res.classList.add("show");  // restart animacji
  res.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

$("form").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  if (!session) return;
  setBtn("Liczę…", { loading: true, disabled: true });
  try {
    showResult(await predict());
  } catch (e) {
    console.error(e);
    alert("Błąd obliczeń: " + e.message);
  } finally {
    setBtn("Oblicz ryzyko", { disabled: false });
  }
});

init();
