# Kalkulator ryzyka kardiochirurgicznego — projekt strony WWW

Cel: zbudować stronę internetową z kalkulatorem przewidującym 30-dniową śmiertelność
po operacji kardiochirurgicznej u dorosłych. Model bije EuroSCORE II.

## Kontekst (skąd to)
Model pochodzi z projektu badawczego na danych KROK (Krajowy Rejestr Operacji
Kardiochirurgicznych). Pełna wersja (112 zmiennych) ma AUC 0,824 vs EuroSCORE II 0,773.
Tu jest wersja **lite UNIWERSALNA (26 zmiennych)**, AUC **0,805**, do użytku w kalkulatorze.
WAŻNE: model jest uniwersalny **na wzór EuroSCORE II** — ocenia KAŻDĄ operację kardiochirurgiczną
przez klasyfikację złożoności zabiegu „Weight of the intervention" (izolowany CABG / pojedynczy
nie-CABG / 2 procedury / 3 procedury) + flagę aorty piersiowej, NIE przez listę wybranych operacji.
To była poprawka błędu poprzedniej wersji (obejmowała tylko CABG/aortalną/mitralną/aortę, pomijała
~10% operacji o najwyższym ryzyku). Mapowanie pól → cech: patrz `kalkulator_app_streamlit_referencja.py`.
Punkt końcowy: zgon 30-dniowy zweryfikowany wobec rejestru zgonów Ministerstwa Zdrowia (PESEL).
Trening: 296 528 operacji (2012–2024), śmiertelność ~4,5%.

## Pliki w tym folderze
- `model_lite.joblib` — wytrenowany model (sklearn HistGradientBoostingClassifier, 20 cech)
- `model_spec.json` — lista 20 zmiennych (kolejność!), metadane
- `kalkulator_app_streamlit_referencja.py` — DZIAŁAJĄCY kalkulator w Streamlit (referencja:
  pokazuje mapowanie pól formularza → cechy modelu, progi ryzyka, układ UI)

## Zadanie
Zbudować stronę WWW. Sugerowane podejścia (do decyzji z użytkownikiem):
1. **Statyczna strona (HTML/JS)** — model uruchamiany w przeglądarce (eksport do ONNX +
   onnxruntime-web, albo re-fit logistyczny i wzór w JS). Hostowalna za darmo gdziekolwiek
   (GitHub Pages / Netlify), instant, bez serwera. NAJLEPSZE na publiczny link do artykułu.
2. **Streamlit na darmowym cloud** (Streamlit Community Cloud / Hugging Face Spaces) —
   reużywa istniejący kod, ale wymaga konta + repo.

## Twarde zasady
- **Język UI: polski** (diakrytyki ą ę ó ł ś ć ń ż ź).
- Wyraźna etykieta: **„Wyłącznie do celów badawczych — nie do decyzji klinicznych."**
- **Nie zapisywać danych pacjenta** (tylko liczyć i pokazać wynik) — czyste wobec RODO.
- Mapowanie pól: NYHA (dropdown I–IV) → flagi NYHA III / NYHA IV; Tryb operacji
  (Planowa/Pilna/Nagła/Ratująca życie) → flagi „Tryb operacji - Planowa" / „...Ratująca życie".
  Reszta to proste 0/1 i wartości liczbowe. Patrz `kalkulator_app_streamlit_referencja.py`.
- Walidacja sanity: planowy CABG 60-latka EF60 krea0,9 → ~0,5%; krytyczny 82-latek aorta
  EF25 NYHA IV → ~47%. Jeśli wyniki się zgadzają, mapowanie jest poprawne.

## Środowisko
Windows + Python 3.12 (globalny). Node 24 dostępny. Pakiety: scikit-learn 1.9, joblib.
Do eksportu ONNX: `pip install skl2onnx onnx onnxruntime` (jeśli pójdziemy ścieżką 1).
