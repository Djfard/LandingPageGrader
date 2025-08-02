# CLAUDE.md

<!--
  This file is automatically loaded into context by Claude Code.
  Keep secrets out. Update as architecture evolves.
-->

## 🎯 Role & Expectations

You (Claude) act as:

- **Expert software engineer & systems designer**
- **Mentor** who writes code and explanations a motivated beginner can follow
- **Best-practices guardian** (clean architecture, async where useful, clear naming, doc-strings, typed Python)

You will:

1. Produce modular, readable code ≤ 40 LOC per function when feasible.
2. Add concise comments and **beginner-level explanations** for non-obvious parts.
3. Highlight trade-offs / alternatives briefly when making design choices.
4. Never commit secrets, `venv/`, or `__pycache__/` directories.

---

## 📌 Project Summary

**Name** : Landing Page Clarity Grader  
**Goal** : Help founders & indie hackers see how their landing page reads to a first-time visitor.  
**User Flow (MVP)**

1. User pastes a **URL** or **raw copy**.
2. Clicks **Grade**.
3. Sees AI-generated insight:
   - _What it is_ / _Who it’s for_ / _Value prop_
   - Scorecard: clarity | focus | differentiation | CTA strength
4. Optional: **Download PDF** of results.

---

## 🧱 Tech Stack

| Layer     | Tooling                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Backend   | **Python 3.11 + FastAPI** • httpx • Playwright • BeautifulSoup • python-dotenv • google /genai (Gemini) |
| Frontend  | **Next.js (React + TypeScript)** • Tailwind CSS • html2pdf.js                                           |
| Dev Infra | GitHub • virtualenv (backend/venv) • GitHub Actions (lint/tests)                                        |
| Secrets   | `.env` (not committed) → loaded by `python-dotenv`                                                      |

---

## 📂 Folder Layout

```

LandingPageGrader/
├── backend/
│   ├── scraper.py          # fetch & clean landing page
│   ├── analyzer.py         # build prompt + call Gemini
│   ├── main.py             # FastAPI app /analyze route
│   ├── models.py           # Pydantic schemas
│   ├── .env.example        # template for secrets
│   └── venv/               # local virtualenv (git-ignored)
├── frontend/
│   ├── pages/index.tsx
│   ├── components/
│   └── utils/api.ts
├── CLAUDE.md               # ← you are here
└── .gitignore

```

---

## 🔐 Environment Variables

Create `backend/.env` (never commit):

Loaded in code via:

from dotenv import load_dotenv
import os
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

---

## 🔄 System Flow (MVP)

```
User → Next.js form → POST /analyze
     ↓
FastAPI validates & branches:
  └─ if url: fetch_page_text(url)  → Playwright (headless) → BeautifulSoup cleanup
       else: use raw_text provided
     ↓
generate_prompt(clean_text) → Gemini API
     ↓
receive structured JSON:
{
  "what_it_is": "...",
  "who_it_is_for": "...",
  "value_prop": "...",
  "scores": { "clarity": 4, ... }
}
     ↓
Return JSON → frontend renders → optional PDF export
```

---

## 🧑‍💻 Dev Commands

### Backend

# inside backend/

venv\Scripts\activate # Windows
source venv/bin/activate # macOS/Linux
uvicorn main:app --reload # start API
pytest # run tests

### Frontend

cd frontend
npm install
npm run dev

---

## 📝 Coding Norms

- **Async-first** where I/O bound (Playwright, httpx, FastAPI routes).
- Use **type hints** and `pydantic.BaseModel` for request/response.
- Keep **functions small & pure**; side-effects isolated.
- Add _doc-strings_ for all public functions.
- Prefer **f-strings** over concatenation.

---

## 🚫 Do Not

- Commit `.env`, `venv/`, `__pycache__/`, OS junk files.
- Hard-code API keys or secrets.
- Add dependencies without rationale.

---

## 📍 Outstanding TODOs

- [ ] Merge `scraper.py` + `Gemini` call into `analyze()` helper.
- [ ] Create FastAPI `/analyze` endpoint returning schema above.
- [ ] Basic front-to-back “walking skeleton” (form → API → dummy JSON).

_Update this file whenever architecture, env vars, or norms change._
