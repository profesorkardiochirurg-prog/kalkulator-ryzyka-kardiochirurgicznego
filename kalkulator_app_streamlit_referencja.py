# -*- coding: utf-8 -*-
"""Kalkulator ryzyka 30-dniowej śmiertelności po operacji kardiochirurgicznej.
WYŁĄCZNIE DO BADAŃ — nie do decyzji klinicznych. Model: KROK (PL), gradient boosting."""
import streamlit as st
import numpy as np, pandas as pd, joblib, os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model_lite.joblib")

st.set_page_config(page_title="Kalkulator ryzyka kardiochirurgicznego", page_icon="🫀", layout="centered")

@st.cache_resource
def load_model():
    return joblib.load(MODEL_PATH)
B = load_model()
MODEL, NUM, BIN, FEAT = B["model"], B["num"], B["bin"], B["feat"]

st.title("🫀 Kalkulator ryzyka 30-dniowej śmiertelności")
st.caption("Model uczenia maszynowego (gradient boosting) na danych KROK. "
           "AUC 0,805 vs EuroSCORE II 0,773 (walidacja czasowa 2022–2024).")
st.warning("⚠️ **Wyłącznie do celów badawczych i demonstracyjnych. Nie stosować do decyzji klinicznych.**")

st.subheader("Dane pacjenta")
c1, c2 = st.columns(2)
with c1:
    wiek = st.number_input("Wiek (lata)", 18, 100, 65)
    plec = st.radio("Płeć", ["Mężczyzna", "Kobieta"], horizontal=True)
    masa = st.number_input("Masa ciała (kg)", 30.0, 200.0, 78.0, step=1.0)
    ef = st.number_input("Frakcja wyrzutowa EF (%)", 10, 80, 55)
    krea = st.number_input("Kreatynina (mg/dl)", 0.3, 12.0, 1.0, step=0.1)
with c2:
    nyha = st.selectbox("Klasa NYHA", ["I", "II", "III", "IV"], index=1)
    tryb = st.selectbox("Tryb operacji", ["Planowa", "Pilna", "Nagła", "Ratująca życie"])
    reop = st.checkbox("Reoperacja")
    kryt = st.checkbox("Krytyczny stan przedoperacyjny")
    plucna = st.checkbox("Ciężkie nadciśnienie płucne (>55 mmHg)")

st.subheader("Choroby współistniejące")
d1, d2 = st.columns(2)
with d1:
    copd = st.checkbox("Przewlekła choroba płuc")
    arterio = st.checkbox("Arteriopatia pozasercowa")
    zawal = st.checkbox("Świeży zawał serca")
with d2:
    insulina = st.checkbox("Cukrzyca leczona insuliną")

st.subheader("Typ operacji")
e1, e2 = st.columns(2)
with e1:
    wiencowa = st.checkbox("Chirurgia wieńcowa (CABG)")
    aortalna = st.checkbox("Zastawka aortalna")
with e2:
    mitralna = st.checkbox("Zastawka mitralna")
    aorta = st.checkbox("Aorta piersiowa")

def yn(x): return 1 if x else 0
vals = {
    'age_final': wiek,
    'Frakcja wyrzutowa wg ECHO (EF) - wartość (%)': ef,
    'Ostatni poziom kreatyniny przed operacją (mg/dl)': krea,
    'Masa ciała (kg)': masa,
    'Płeć': 1 if plec == "Mężczyzna" else 0,
    'Czy ta operacja jest reoperacją?': yn(reop),
    'Krytyczny stan przedoperacyjny': yn(kryt),
    'Chronic lung disease': yn(copd),
    'Extracardiac arteriopathy': yn(arterio),
    'Świeży zawał serca': yn(zawal),
    'Leczenie cukrzycy - Insulina (z lekami doustnymi lub bez)': yn(insulina),
    'Chirurgia wieńcowa': yn(wiencowa),
    'Operacja zastawki aortalnej': yn(aortalna),
    'Operacja zastawki mitralnej': yn(mitralna),
    'Operacja aorty piersiowej': yn(aorta),
    'NYHA (stan obecny) - NYHA III': yn(nyha == "III"),
    'NYHA (stan obecny) - NYHA IV': yn(nyha == "IV"),
    'Tryb operacji - Planowa': yn(tryb == "Planowa"),
    'Tryb operacji - Ratująca życie: pacjent wymagał resuscytacji krążeniowo-oddechowej w drodze na blok operacyjny lub przed indukcją znieczulenia.': yn(tryb == "Ratująca życie"),
    'Pulmonary hypertension - severe (PA systolic >55 mmHg)': yn(plucna),
}
X = pd.DataFrame([[vals[f] for f in FEAT]], columns=FEAT)

if st.button("Oblicz ryzyko", type="primary", use_container_width=True):
    risk = float(MODEL.predict_proba(X)[:, 1][0]) * 100
    st.metric("Przewidywane ryzyko zgonu w ciągu 30 dni", f"{risk:.1f}%")
    if risk < 2: lvl, col = "niskie", "🟢"
    elif risk < 5: lvl, col = "umiarkowane", "🟡"
    elif risk < 10: lvl, col = "podwyższone", "🟠"
    else: lvl, col = "wysokie", "🔴"
    st.write(f"{col} Ryzyko **{lvl}** (średnia w kohorcie: ~4,5%).")
    st.progress(min(risk/20, 1.0))

st.divider()
st.caption("Model trenowany na 296 528 operacjach (2012–2024), punkt końcowy zweryfikowany "
           "wobec rejestru zgonów MZ. Wersja uproszczona (20 zmiennych) modelu badawczego.")
