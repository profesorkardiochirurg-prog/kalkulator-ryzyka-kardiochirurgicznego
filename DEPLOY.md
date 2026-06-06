# Wdrożenie kalkulatora (darmowy hosting)

Strona jest **w pełni statyczna** — działa bez serwera. Cała inferencja modelu odbywa się
w przeglądarce użytkownika (onnxruntime-web). Żadne dane pacjenta nie są wysyłane ani zapisywane.

## Pliki, które muszą trafić na hosting
- `index.html`
- `style.css`
- `app.js`
- `model.onnx`            ← model (540 KB)
- `model_features.json`   ← lista 20 cech w kolejności (źródło prawdy dla front-endu)

> `export_onnx.py`, `model_lite.joblib`, `README.md`, `DEPLOY.md`, `kalkulator_app_streamlit_referencja.py`
> NIE są potrzebne na produkcji (ale nie szkodzą). Wymagane jest tylko 5 plików powyżej.

## Opcja A — GitHub Pages (zalecane, darmowe, trwały link)
1. Załóż repo na GitHub (np. `kalkulator-ryzyka`) i wgraj zawartość tego folderu.
2. W repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Wybierz branch `main` i katalog `/ (root)`. Zapisz.
4. Po ~1 min strona będzie pod `https://<twoj-login>.github.io/kalkulator-ryzyka/`.

Z linii poleceń (jeśli wolisz):
```
cd C:/Users/Administrator/Desktop/kalkulator-www
git add index.html style.css app.js model.onnx model_features.json
git commit -m "Kalkulator ryzyka — strona statyczna"
git branch -M main
git remote add origin https://github.com/<twoj-login>/kalkulator-ryzyka.git
git push -u origin main
```

## Opcja B — Netlify (drag & drop, bez gita)
1. Wejdź na https://app.netlify.com/drop
2. Przeciągnij **cały folder** kalkulator-www na stronę.
3. Dostaniesz natychmiast publiczny link (można potem podpiąć własną domenę).

## Uruchomienie lokalne (do testów)
Nie otwieraj `index.html` przez `file://` — przeglądarka zablokuje wczytanie modelu (fetch).
Uruchom mały serwer:
```
cd C:/Users/Administrator/Desktop/kalkulator-www
python -m http.server 8753
```
i wejdź na http://127.0.0.1:8753

## Ponowny eksport modelu (gdyby zmienił się model_lite.joblib)
```
pip install skl2onnx "onnx==1.17.0" onnxruntime
python export_onnx.py
```
Skrypt zapisuje `model.onnx` + `model_features.json` i weryfikuje zgodność z `predict_proba`
(max różnica < 1e-6) oraz drukuje wyniki sanity dla modelu uniwersalnego (26 cech):
planowy izolowany CABG ≈ 0,4%; pojedynczy nie-CABG NYHA III ≈ 2,4%; 3 procedury + aorta, krytyczny, tryb ratujący ≈ 52,8%.

## Uwagi techniczne
- onnxruntime-web ładowany z CDN jsDelivr (`onnxruntime-web@1.20.1`); WASM jednowątkowy
  (`numThreads = 1`), więc nie wymaga nagłówków COOP/COEP — działa na GitHub Pages/Netlify.
- Jeśli chcesz uniezależnić się od CDN: pobierz pliki `ort.min.js` oraz `*.wasm` z paczki
  `onnxruntime-web@1.20.1/dist/`, wrzuć je obok i zmień ścieżki w `index.html` i `app.js`.
