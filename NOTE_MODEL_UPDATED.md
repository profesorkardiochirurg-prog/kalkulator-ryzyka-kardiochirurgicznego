# ⚠️ MODEL ZAKTUALIZOWANY — strona wymaga przebudowy

**Data: 2026-06-06.** Model został poprawiony w projekcie głównym (KROK). Twoja statyczna
strona (index.html / app.js / model.onnx / model_features.json) była zbudowana na STARYM,
błędnym modelu i wymaga regeneracji.

## Co było źle (zgłoszone przez użytkownika — kardiochirurga)
Stary model lite (20 cech) miał pola dla **wybranych typów operacji** (CABG, zastawka aortalna,
mitralna, aorta). To NIE tak jak EuroSCORE II — i **pomijało ~10% operacji** (28 479 op., w tym
najcięższe, śmiertelność 9,2%), bo nie mieściły się w tych 4 typach.

## Co jest teraz (poprawione)
Nowy **uniwersalny** model lite (**26 cech**) — na wzór EuroSCORE II — ocenia KAŻDĄ operację
przez klasyfikację złożoności **„Weight of the intervention"** + flagę aorty piersiowej,
zamiast listy wybranych operacji. AUC nadal 0,805 (vs EuroSCORE 0,773).

Aktualne źródło prawdy (już w repo):
- `model_lite.joblib` — NOWY model (26 cech)
- `model_spec.json` — NOWA lista cech (kolejność!)
- `kalkulator_app_streamlit_referencja.py` — ZAKTUALIZOWANY kalkulator (pokazuje nowe pola UI:
  dropdown „Złożoność zabiegu (Weight of intervention)", nowe choroby: ograniczona mobilność,
  czynne zapalenie wsierdzia, CCS 4, nadciśnienie płucne jako 3-stopniowe, tryb 4-stopniowy)

## Co trzeba zrobić (regeneracja strony)
1. Ponownie uruchom `export_onnx.py` → nowy `model.onnx` + `model_features.json` z modelu 26-cechowego.
2. Przebuduj formularz w `index.html` / `app.js`:
   - USUŃ 4 checkboxy typów operacji (CABG/aortalna/mitralna/aorta).
   - DODAJ dropdown „Złożoność zabiegu": Izolowany CABG / Pojedynczy zabieg nie-CABG / 2 procedury / 3 procedury.
   - DODAJ checkbox „Operacja aorty piersiowej" (osobna flaga, jak EuroSCORE II).
   - DODAJ: ograniczona mobilność, czynne zapalenie wsierdzia, CCS 4; nadciśnienie płucne → 3 opcje;
     tryb operacji → 4 opcje (Planowa/Pilna/Nagła/Ratująca życie).
   - Mapowanie pól → cech: 1:1 jak w `kalkulator_app_streamlit_referencja.py`.
3. Walidacja sanity (po przebudowie): planowy izolowany CABG 60l EF60 → ~0,5%;
   „pojedynczy nie-CABG" 74l EF40 NYHA III → ~3,1%; 3 procedury 80l EF25 krytyczny → ~53%.
