/* Dwujęzyczność PL/EN — przełącznik bez przeładowania, zapamiętany w localStorage.
   Wartości mogą zawierać HTML (ustawiane przez innerHTML). Atrybuty: data-i18n-attr="attr:key,..." */
(function () {
  const I18N = {
    pl: {
      // dokumenty
      "doc.title": "CARMA — Kalkulator ryzyka kardiochirurgicznego (30-dniowa śmiertelność)",
      "doc.desc": "CARMA — kalkulator ryzyka 30-dniowej śmiertelności po operacji kardiochirurgicznej. Uniwersalny model uczenia maszynowego na danych KROK (AUC 0,805, bije EuroSCORE II). Wyłącznie do celów badawczych.",
      "doc.titleAuthors": "CARMA — Autorzy projektu",
      "doc.descAuthors": "Zespół i instytucje stojące za CARMA — kalkulatorem ryzyka kardiochirurgicznego opartym na danych KROK.",
      "brand.full": "CARdiac surgery Mortality Assessment",
      // UI
      "ui.theme": "Jasny / ciemny motyw",
      "ui.lang": "Zmień język (polski / angielski)",
      // hero kalkulatora
      "hero.title": "Kalkulator ryzyka 30-dniowej śmiertelności",
      "hero.sub": `<strong>Uniwersalny</strong> model uczenia maszynowego (gradient boosting) na polskim rejestrze <strong>KROK</strong> — ocenia <strong>każdą</strong> operację kardiochirurgiczną u dorosłych.`,
      "badge.auc": "AUC 0,805",
      "badge.euro": "EuroSCORE II: 0,773",
      "badge.universal": "Uniwersalny — jak EuroSCORE II",
      "badge.n": "296 528 operacji · 2012–2024",
      "hero.warn": `<strong>Wyłącznie do celów badawczych i demonstracyjnych.</strong> Nie stosować do decyzji klinicznych.`,
      // dane pacjenta
      "patient.title": "Dane pacjenta",
      "f.age": `Wiek <span class="unit">(lata)</span>`,
      "f.sex": "Płeć",
      "opt.male": "Mężczyzna",
      "opt.female": "Kobieta",
      "f.weight": `Masa ciała <span class="unit">(kg)</span>`,
      "f.ef": `Frakcja wyrzutowa EF <span class="unit">(%)</span>`,
      "f.crea": `Kreatynina <span class="unit">(mg/dl)</span>`,
      "f.nyha": "Klasa NYHA",
      "f.ph": "Nadciśnienie płucne",
      "ph.none": "Brak / łagodne",
      "ph.mod": "Umiarkowane (31–55 mmHg)",
      "ph.sev": "Ciężkie (>55 mmHg)",
      // choroby
      "dis.title": "Stan i choroby współistniejące",
      "c.reop": "Reoperacja",
      "c.crit": "Krytyczny stan przedoperacyjny",
      "c.copd": "Przewlekła choroba płuc",
      "c.arterio": "Arteriopatia pozasercowa",
      "c.mobil": "Ograniczona mobilność",
      "c.mi": "Świeży zawał serca",
      "c.endo": "Czynne zapalenie wsierdzia",
      "c.insulin": "Cukrzyca leczona insuliną",
      "c.ccs4": "Dławica CCS 4 / niestabilna",
      // zabieg
      "proc.title": "Zabieg",
      "f.weightInt": `Złożoność zabiegu <span class="unit">(Weight of intervention)</span>`,
      "w.cabg": "Izolowany CABG",
      "w.noncabg": "Pojedynczy zabieg nie-CABG",
      "w.2": "2 procedury",
      "w.3": "3 procedury",
      "f.urg": "Tryb operacji",
      "u.elective": "Planowa",
      "u.urgent": "Pilna",
      "u.emergency": "Nagła",
      "u.salvage": "Ratująca życie (resuscytacja przed znieczuleniem)",
      "c.aorta": "Operacja aorty piersiowej",
      "proc.note": `<strong>Model jest uniwersalny — ocenia każdą operację kardiochirurgiczną.</strong> Tak jak w EuroSCORE II dowolny zabieg mieści się w jednej z kategorii złożoności: „Pojedynczy zabieg nie-CABG" obejmuje każdą izolowaną operację niewieńcową (zastawka, guz, wada wrodzona i inne), a „2 / 3 procedury" — zabiegi łączone.`,
      // wynik
      "res.cap": "ryzyko zgonu / 30 dni",
      "res.cohort": "Średnia w kohorcie",
      "res.cohortVal": "~4,5%",
      "res.scale": "Skala wskaźnika",
      "res.scaleVal": "0–60%",
      "res.disc": `Wynik orientacyjny, <strong>wyłącznie do celów badawczych</strong> — nie zastępuje oceny klinicznej.`,
      // stopka kalkulatora
      "foot.train": `<strong>Dane treningowe</strong><br/>296 528 operacji kardiochirurgicznych u dorosłych (KROK, 2012–2024).`,
      "foot.valid": `<strong>Walidacja punktu końcowego</strong><br/>Zgon w ciągu 30 dni zweryfikowany wobec rejestru zgonów Ministerstwa Zdrowia (PESEL).`,
      "foot.privacy": `<strong>Prywatność</strong><br/>Obliczenia w całości w Twojej przeglądarce. Żadne dane pacjenta nie są wysyłane ani zapisywane.`,
      "foot.disc": `<strong>Wyłącznie do celów badawczych — nie do decyzji klinicznych.</strong> Wersja uproszczona (26 zmiennych klinicznych) modelu badawczego.`,
      "foot.authors": "Autorzy projektu i instytucje →",
      "nav.authors": "Autorzy i instytucje →",
      // przyciski (dynamiczne, używane przez app.js)
      "btn.calc": "Oblicz ryzyko",
      "btn.loading": "Ładowanie modelu…",
      "btn.loadError": "Błąd ładowania modelu",
      "btn.calculating": "Liczę…",
      "level.low": "Ryzyko niskie",
      "level.mod": "Ryzyko umiarkowane",
      "level.elev": "Ryzyko podwyższone",
      "level.high": "Ryzyko wysokie",
      "err.calc": "Błąd obliczeń: ",
      // strona autorów
      "a.hero.title": "Zespół i autorzy projektu",
      "a.hero.sub": `Ludzie i instytucje, którzy stworzyli kalkulator ryzyka kardiochirurgicznego na podstawie polskiego rejestru <strong>KROK</strong>.`,
      "a.back": "Wróć do kalkulatora",
      "a.about.title": "O projekcie",
      "a.about.body": `<strong>CARMA</strong> (CARdiac surgery Mortality Assessment) to kalkulator powstały w ramach projektu badawczego wykorzystującego dane <strong>Krajowego Rejestru Operacji Kardiochirurgicznych (KROK)</strong>. Model uczenia maszynowego (gradient boosting) przewiduje 30-dniową śmiertelność po operacji kardiochirurgicznej u dorosłych i w walidacji czasowej osiąga <strong>AUC 0,805</strong> wobec 0,773 dla EuroSCORE II. Punkt końcowy zweryfikowano wobec rejestru zgonów Ministerstwa Zdrowia (PESEL). Celem projektu jest dostarczenie precyzyjnego, niezależnego narzędzia oceny ryzyka opartego na rzeczywistych polskich danych klinicznych.`,
      "a.authors": "Autorzy",
      "a.institutions": "Instytucje",
      "a.photo.soon": "Zdjęcie zespołu — wkrótce",
      "a.photo.cap": "Od lewej: prof. Marian Burysz, prof. Radosław Litwinowicz — Oddział Kardiochirurgiczny, RSS im. dr. Biegańskiego w Grudziądzu",
      "a.affil": "Oddział Kardiochirurgiczny, RSS im. dr. W. Biegańskiego (Grudziądz) · Politechnika Bydgoska",
      "a.lit.name": "prof. Radosław Litwinowicz",
      "a.lit.role": "Kardiochirurgia · AI w medycynie",
      "a.lit.bio": `Kardiochirurg, profesor nauk medycznych — jeden z najmłodszych profesorów w polskiej medycynie. Przewodniczący Rady Naukowej Dyscypliny Nauki Medyczne Politechniki Bydgoskiej; w Grudziądzu rozwija program kardiochirurgii hybrydowej i małoinwazyjnej. Laureat nagrody ISMICS oraz stypendysta Francis Fontan Award EACTS. Zwolennik wykorzystania modeli AI w medycynie.`,
      "a.bur.name": "prof. Marian Burysz",
      "a.bur.role": "Kardiochirurgia · chirurgia aorty",
      "a.bur.bio": `Kardiochirurg, koordynator Oddziału Kardiochirurgicznego w Grudziądzu i twórca tamtejszego Centrum Leczenia Aorty. Jako pierwszy na świecie wykonał endowaskularną wymianę łuku aorty stentgraftem trójodgałęzionym. Adiunkt Wydziału Medycznego PBŚ; autor publikacji w czasopismach międzynarodowych poświęconych leczeniu tętniaków i rozwarstwień aorty.`,
      "i.hosp.name": "Regionalny Szpital Specjalistyczny im. dr. W. Biegańskiego",
      "i.hosp.desc": "Grudziądz · ośrodek kliniczny (kardiochirurgia)",
      "i.krok.name": "KROK — Krajowy Rejestr Operacji Kardiochirurgicznych",
      "i.krok.desc": "Źródło danych (2012–2024)",
      "i.pb.name": "Politechnika Bydgoska — Wydział Medyczny",
      "i.pb.desc": "Partner akademicki",
      "i.ptkt.name": "Polskie Towarzystwo Kardio-Torakochirurgiczne",
      "i.ptkt.desc": "Towarzystwo naukowe (PTKT)",
      "a.foot.disc": `<strong>Wyłącznie do celów badawczych — nie do decyzji klinicznych.</strong> Model na danych KROK (2012–2024) · punkt końcowy zweryfikowany wobec rejestru zgonów MZ.`
    },
    en: {
      "doc.title": "CARMA — Cardiac Surgery Risk Calculator (30-day mortality)",
      "doc.desc": "CARMA — calculator of 30-day mortality risk after cardiac surgery. Universal machine-learning model on KROK data (AUC 0.805, beats EuroSCORE II). For research purposes only.",
      "doc.titleAuthors": "CARMA — Project authors",
      "doc.descAuthors": "The team and institutions behind CARMA — the cardiac surgery risk calculator built on KROK data.",
      "brand.full": "CARdiac surgery Mortality Assessment",
      "ui.theme": "Light / dark theme",
      "ui.lang": "Change language (Polish / English)",
      "hero.title": "30-day Mortality Risk Calculator",
      "hero.sub": `<strong>Universal</strong> machine-learning model (gradient boosting) trained on the Polish <strong>KROK</strong> registry — it assesses <strong>any</strong> adult cardiac operation.`,
      "badge.auc": "AUC 0.805",
      "badge.euro": "EuroSCORE II: 0.773",
      "badge.universal": "Universal — like EuroSCORE II",
      "badge.n": "296,528 operations · 2012–2024",
      "hero.warn": `<strong>For research and demonstration purposes only.</strong> Not for clinical decisions.`,
      "patient.title": "Patient data",
      "f.age": `Age <span class="unit">(years)</span>`,
      "f.sex": "Sex",
      "opt.male": "Male",
      "opt.female": "Female",
      "f.weight": `Body weight <span class="unit">(kg)</span>`,
      "f.ef": `Ejection fraction EF <span class="unit">(%)</span>`,
      "f.crea": `Creatinine <span class="unit">(mg/dl)</span>`,
      "f.nyha": "NYHA class",
      "f.ph": "Pulmonary hypertension",
      "ph.none": "None / mild",
      "ph.mod": "Moderate (31–55 mmHg)",
      "ph.sev": "Severe (>55 mmHg)",
      "dis.title": "Status and comorbidities",
      "c.reop": "Reoperation",
      "c.crit": "Critical preoperative state",
      "c.copd": "Chronic lung disease",
      "c.arterio": "Extracardiac arteriopathy",
      "c.mobil": "Poor mobility",
      "c.mi": "Recent myocardial infarction",
      "c.endo": "Active endocarditis",
      "c.insulin": "Insulin-treated diabetes",
      "c.ccs4": "CCS 4 / unstable angina",
      "proc.title": "Procedure",
      "f.weightInt": `Procedure complexity <span class="unit">(Weight of intervention)</span>`,
      "w.cabg": "Isolated CABG",
      "w.noncabg": "Single non-CABG procedure",
      "w.2": "2 procedures",
      "w.3": "3 procedures",
      "f.urg": "Urgency",
      "u.elective": "Elective",
      "u.urgent": "Urgent",
      "u.emergency": "Emergency",
      "u.salvage": "Salvage (CPR before anaesthesia)",
      "c.aorta": "Thoracic aorta surgery",
      "proc.note": `<strong>The model is universal — it assesses every cardiac operation.</strong> As in EuroSCORE II, any procedure falls into one of the complexity categories: “Single non-CABG procedure” covers any isolated non-coronary operation (valve, tumour, congenital defect and others), and “2 / 3 procedures” — combined surgery.`,
      "res.cap": "mortality risk / 30 days",
      "res.cohort": "Cohort average",
      "res.cohortVal": "~4.5%",
      "res.scale": "Gauge scale",
      "res.scaleVal": "0–60%",
      "res.disc": `Indicative result, <strong>for research purposes only</strong> — it does not replace clinical judgement.`,
      "foot.train": `<strong>Training data</strong><br/>296,528 adult cardiac surgery operations (KROK, 2012–2024).`,
      "foot.valid": `<strong>Endpoint validation</strong><br/>30-day death verified against the Ministry of Health mortality registry (PESEL).`,
      "foot.privacy": `<strong>Privacy</strong><br/>All computation runs in your browser. No patient data is sent or stored.`,
      "foot.disc": `<strong>For research purposes only — not for clinical decisions.</strong> Simplified version (26 clinical variables) of the research model.`,
      "foot.authors": "Project authors and institutions →",
      "nav.authors": "Authors & institutions →",
      "btn.calc": "Calculate risk",
      "btn.loading": "Loading model…",
      "btn.loadError": "Model loading error",
      "btn.calculating": "Calculating…",
      "level.low": "Low risk",
      "level.mod": "Moderate risk",
      "level.elev": "Elevated risk",
      "level.high": "High risk",
      "err.calc": "Calculation error: ",
      "a.hero.title": "Team and project authors",
      "a.hero.sub": `The people and institutions who created the cardiac surgery risk calculator based on the Polish <strong>KROK</strong> registry.`,
      "a.back": "Back to calculator",
      "a.about.title": "About the project",
      "a.about.body": `<strong>CARMA</strong> (CARdiac surgery Mortality Assessment) is a calculator developed within a research project using data from the <strong>Polish National Registry of Cardiac Surgery Procedures (KROK)</strong>. The machine-learning model (gradient boosting) predicts 30-day mortality after adult cardiac surgery and, in temporal validation, reaches <strong>AUC 0.805</strong> versus 0.773 for EuroSCORE II. The endpoint was verified against the Ministry of Health mortality registry (PESEL). The project's goal is to provide a precise, independent risk-assessment tool based on real Polish clinical data.`,
      "a.authors": "Authors",
      "a.institutions": "Institutions",
      "a.photo.soon": "Team photo — coming soon",
      "a.photo.cap": "From left: Prof. Marian Burysz, Prof. Radosław Litwinowicz — Cardiac Surgery Department, Dr. Biegański Regional Specialist Hospital in Grudziądz",
      "a.affil": "Cardiac Surgery Department, Dr. W. Biegański Regional Specialist Hospital (Grudziądz) · Bydgoszcz University of Science and Technology",
      "a.lit.name": "Prof. Radosław Litwinowicz",
      "a.lit.role": "Cardiac surgery · AI in medicine",
      "a.lit.bio": `Cardiac surgeon and professor of medical sciences — one of the youngest professors in Polish medicine. Chair of the Scientific Council of the Medical Sciences Discipline at Bydgoszcz University of Science and Technology; in Grudziądz he develops the hybrid and minimally invasive cardiac surgery programme. Laureate of the ISMICS award and an EACTS Francis Fontan Award fellow. An advocate of using AI models in medicine.`,
      "a.bur.name": "Prof. Marian Burysz",
      "a.bur.role": "Cardiac surgery · aortic surgery",
      "a.bur.bio": `Cardiac surgeon, coordinator of the Cardiac Surgery Department in Grudziądz and founder of its Aortic Treatment Centre. He performed the world's first endovascular aortic arch replacement with a triple-branched stent-graft. Assistant professor at the Faculty of Medicine, Bydgoszcz UST; author of papers in international journals on the treatment of aortic aneurysms and dissections.`,
      "i.hosp.name": "Dr. W. Biegański Regional Specialist Hospital",
      "i.hosp.desc": "Grudziądz · clinical centre (cardiac surgery)",
      "i.krok.name": "KROK — Polish National Registry of Cardiac Surgery Procedures",
      "i.krok.desc": "Data source (2012–2024)",
      "i.pb.name": "Bydgoszcz University of Science and Technology — Faculty of Medicine",
      "i.pb.desc": "Academic partner",
      "i.ptkt.name": "Polish Society of Cardio-Thoracic Surgery",
      "i.ptkt.desc": "Scientific society (PTKT)",
      "a.foot.disc": `<strong>For research purposes only — not for clinical decisions.</strong> Model on KROK data (2012–2024) · endpoint verified against the MoH mortality registry.`
    }
  };

  function detect() {
    try { var s = localStorage.getItem("lang"); if (s === "pl" || s === "en") return s; } catch (e) {}
    return (navigator.language || "pl").toLowerCase().indexOf("en") === 0 ? "en" : "pl";
  }

  function apply(lang) {
    var dict = I18N[lang] || I18N.pl;
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (dict[k] != null) el.innerHTML = dict[k];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var i = pair.indexOf(":"); if (i < 0) return;
        var attr = pair.slice(0, i).trim(), key = pair.slice(i + 1).trim();
        if (dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });
    var lt = document.getElementById("langToggle");
    if (lt) { var c = lt.querySelector(".lang-code"); if (c) c.textContent = lang.toUpperCase(); }
    window.LANG = lang; window.I18N = I18N;
    try { window.dispatchEvent(new CustomEvent("langchange", { detail: lang })); } catch (e) {}
  }

  function toggle() {
    var next = window.LANG === "en" ? "pl" : "en";
    try { localStorage.setItem("lang", next); } catch (e) {}
    apply(next);
  }

  // udostępnij od razu (app.js ładowany po i18n.js)
  window.LANG = detect();
  window.I18N = I18N;
  window.__toggleLang = toggle;

  function start() {
    apply(window.LANG);
    var lt = document.getElementById("langToggle");
    if (lt) lt.addEventListener("click", toggle);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
