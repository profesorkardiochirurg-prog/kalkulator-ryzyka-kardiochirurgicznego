# -*- coding: utf-8 -*-
"""Kalkulator ryzyka 30-dniowej śmiertelności po operacji kardiochirurgicznej.
Uniwersalny (na wzór EuroSCORE II) — ocenia KAŻDĄ operację kardiochirurgiczną.
WYŁĄCZNIE DO BADAŃ — nie do decyzji klinicznych. Model: KROK (PL), gradient boosting."""
import streamlit as st
import numpy as np, pandas as pd, joblib, os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model_lite.joblib")
st.set_page_config(page_title="Kalkulator ryzyka kardiochirurgicznego", page_icon="🫀", layout="centered")

@st.cache_resource
def load_model():
    return joblib.load(MODEL_PATH)
B = load_model()
MODEL, FEAT = B["model"], B["feat"]

st.title("🫀 Kalkulator ryzyka 30-dniowej śmiertelności")
st.caption("Uniwersalny model uczenia maszynowego (gradient boosting) na danych KROK — ocenia każdą "
           "operację kardiochirurgiczną u dorosłych. AUC 0,805 vs EuroSCORE II 0,773 (walidacja 2022–2024).")
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
    ccs4 = st.checkbox("Dławica CCS 4 / niestabilna")
    plucna = st.selectbox("Nadciśnienie płucne", ["Brak/łagodne", "Umiarkowane (31–55 mmHg)", "Ciężkie (>55 mmHg)"])

st.subheader("Zabieg")
g1, g2 = st.columns(2)
with g1:
    # UNIWERSALNA klasyfikacja zlozonosci - jak EuroSCORE II (obejmuje KAZDA operacje)
    weight = st.selectbox("Złożoność zabiegu (Weight of intervention)",
        ["Izolowany CABG", "Pojedynczy zabieg nie-CABG", "2 procedury", "3 procedury"],
        help="Jak w EuroSCORE II: dowolna operacja kardiochirurgiczna mieści się w jednej z tych kategorii. "
             "Pojedynczy zabieg nie-CABG = każda izolowana operacja niewieńcowa (np. zastawka, guz, inna).")
    aorta = st.checkbox("Operacja aorty piersiowej")
with g2:
    tryb = st.selectbox("Tryb operacji", ["Planowa", "Pilna", "Nagła", "Ratująca życie"])

st.subheader("Stan i choroby współistniejące")
d1, d2 = st.columns(2)
with d1:
    reop = st.checkbox("Reoperacja")
    kryt = st.checkbox("Krytyczny stan przedoperacyjny")
    copd = st.checkbox("Przewlekła choroba płuc")
    arterio = st.checkbox("Arteriopatia pozasercowa")
    mobil = st.checkbox("Ograniczona mobilność")
with d2:
    zawal = st.checkbox("Świeży zawał serca")
    endo = st.checkbox("Czynne zapalenie wsierdzia")
    insulina = st.checkbox("Cukrzyca leczona insuliną")

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
    'Poor mobility': yn(mobil),
    'Świeży zawał serca': yn(zawal),
    'Zapalenie wsierdzia': yn(endo),
    'Leczenie cukrzycy - Insulina (z lekami doustnymi lub bez)': yn(insulina),
    'NYHA (stan obecny) - NYHA III': yn(nyha == "III"),
    'NYHA (stan obecny) - NYHA IV': yn(nyha == "IV"),
    'CCS Class - CCS 4': yn(ccs4),
    'Pulmonary hypertension - moderate (PA systolic 31-55 mmHg)': yn(plucna.startswith("Umiark")),
    'Pulmonary hypertension - severe (PA systolic >55 mmHg)': yn(plucna.startswith("Ciężkie")),
    'Tryb operacji - Planowa': yn(tryb == "Planowa"),
    'Tryb operacji - Pilna: pacjent nie był przyjęty w celu operacji, ale wymaga operacji w trakcie tego pobytu ze względów medycznych i nie może być wypisany bez operacji.': yn(tryb == "Pilna"),
    'Tryb operacji - Ratująca życie: pacjent wymagał resuscytacji krążeniowo-oddechowej w drodze na blok operacyjny lub przed indukcją znieczulenia.': yn(tryb == "Ratująca życie"),
    'Weight of the intervention - isolated CABG': yn(weight == "Izolowany CABG"),
    'Weight of the intervention - single non CABG': yn(weight == "Pojedynczy zabieg nie-CABG"),
    'Weight of the intervention - 2 procedures': yn(weight == "2 procedury"),
    'Weight of the intervention - 3 procedures': yn(weight == "3 procedury"),
    'Operacja aorty piersiowej': yn(aorta),
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
st.caption("Model trenowany na 296 528 operacjach (2012–2024), punkt końcowy zweryfikowany wobec "
           "rejestru zgonów MZ. Uniwersalny (jak EuroSCORE II) — obejmuje każdy typ operacji "
           "kardiochirurgicznej przez klasyfikację złożoności zabiegu.")
