# -*- coding: utf-8 -*-
"""Eksport model_lite.joblib -> ONNX i weryfikacja zgodnosci z predict_proba.
Wynik: model.onnx (do uruchomienia w przegladarce przez onnxruntime-web)."""
import json, numpy as np, pandas as pd, joblib

# --- Patch zgodnosci numpy 2.x <-> onnx 1.17: skl2onnx oddaje skalary np.uint32/np.bool_
#     w polach atrybutow, ktore onnx.make_attribute chce miec jako natywne int. Rzutujemy. ---
import onnx.helper as _oh
_orig_make_attr = _oh.make_attribute
def _coerce(v):
    if isinstance(v, (np.integer, np.bool_)):
        return int(v)
    if isinstance(v, np.floating):
        return float(v)
    if isinstance(v, np.ndarray):
        v = v.tolist()
    if isinstance(v, (list, tuple)):
        return [int(x) if isinstance(x, (np.integer, np.bool_, bool)) else
                (float(x) if isinstance(x, np.floating) else x) for x in v]
    return v
def _patched_make_attribute(key, value, *a, **k):
    return _orig_make_attr(key, _coerce(value), *a, **k)
_oh.make_attribute = _patched_make_attribute

from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import onnxruntime as ort

B = joblib.load("model_lite.joblib")
MODEL, FEAT = B["model"], B["feat"]
N = len(FEAT)

# Eksport: wejscie = pojedynczy tensor float [batch, 20]. zipmap=False -> czysty tensor prawdopodobienstw.
onx = convert_sklearn(
    MODEL,
    initial_types=[("input", FloatTensorType([None, N]))],
    options={id(MODEL): {"zipmap": False}},
    target_opset=17,
)
with open("model.onnx", "wb") as f:
    f.write(onx.SerializeToString())
print("Zapisano model.onnx")

# --- Weryfikacja zgodnosci ONNX vs sklearn ---
sess = ort.InferenceSession("model.onnx", providers=["CPUExecutionProvider"])
in_name = sess.get_inputs()[0].name
out_names = [o.name for o in sess.get_outputs()]
print("Wejscie ONNX:", in_name, "| Wyjscia:", out_names)

def vec(d):
    return np.array([[float(d.get(f, 0)) for f in FEAT]], dtype=np.float32)

def sk(d):
    X = pd.DataFrame([[d.get(f, 0) for f in FEAT]], columns=FEAT)
    return float(MODEL.predict_proba(X)[:, 1][0])

def onnx_p(d):
    out = sess.run(None, {in_name: vec(d)})
    # znajdz tensor prawdopodobienstw (2 kolumny)
    for o in out:
        a = np.array(o)
        if a.ndim == 2 and a.shape[1] == 2:
            return float(a[0, 1])
    return float(np.array(out[-1]).ravel()[-1])

cases = {
    "planowy CABG 60 EF60 krea0.9": {
        "age_final": 60, "Frakcja wyrzutowa wg ECHO (EF) - wartość (%)": 60,
        "Ostatni poziom kreatyniny przed operacją (mg/dl)": 0.9, "Masa ciała (kg)": 80,
        "Płeć": 1, "Chirurgia wieńcowa": 1, "Tryb operacji - Planowa": 1,
    },
    "krytyczny 82 aorta EF25 NYHA IV": {
        "age_final": 82, "Frakcja wyrzutowa wg ECHO (EF) - wartość (%)": 25,
        "Ostatni poziom kreatyniny przed operacją (mg/dl)": 1.5, "Masa ciała (kg)": 70,
        "Płeć": 1, "Operacja zastawki aortalnej": 1, "Krytyczny stan przedoperacyjny": 1,
        "NYHA (stan obecny) - NYHA IV": 1,
    },
}
# losowe przypadki do twardej weryfikacji numerycznej
rng = np.random.default_rng(0)
max_diff = 0.0
for _ in range(200):
    d = {}
    for f in FEAT:
        if f == "age_final": d[f] = int(rng.integers(18, 95))
        elif "Frakcja" in f: d[f] = int(rng.integers(15, 70))
        elif "kreatyniny" in f: d[f] = round(float(rng.uniform(0.5, 5.0)), 1)
        elif "Masa" in f: d[f] = int(rng.integers(45, 130))
        else: d[f] = int(rng.integers(0, 2))
    max_diff = max(max_diff, abs(sk(d) - onnx_p(d)))
print(f"Max |ONNX - sklearn| na 200 losowych przypadkach: {max_diff:.2e}")

print("\\n--- Sanity ---")
for name, d in cases.items():
    print(f"{name}: sklearn={sk(d)*100:.2f}%  onnx={onnx_p(d)*100:.2f}%")

# zapisz spec dla frontu (kolejnosc cech + ktore sa numeryczne)
spec = {"feat": FEAT, "num": B["num"], "bin": B["bin"]}
with open("model_features.json", "w", encoding="utf-8") as f:
    json.dump(spec, f, ensure_ascii=False, indent=2)
print("Zapisano model_features.json")
