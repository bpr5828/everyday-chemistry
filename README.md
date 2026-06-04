# Everyday Chemistry

> A student-built, interactive public science platform that decodes the chemistry inside everyday products, homes, and water supplies.

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://everyday-chemistry.vercel.app)

---

## 🔬 Project Overview

**Everyday Chemistry** is a full-stack web application designed as a college-application portfolio project to translate complex chemical nomenclature into accessible public science. It combines:

- **X-Ray House** – Click through rooms to scan household objects and reveal their hidden chemistry
- **De-Jargonizer** – Search 100+ chemical compounds by name, IUPAC, or formula for plain-English explanations
- **Product Analyzer** – Paste any product ingredient label and receive a safety-scored molecular breakdown
- **Food & Chemistry Articles** – Citation-backed articles on cooking reactions, fermentation, and medicinal chemistry
- **Podcast Hub** – Audio episodes with synchronized visual chemical annotations that update in real time
- **Citizen Chemistry Map** – Submit anonymized local tap-water pH readings to a community science map
- **Admin Moderation** – Moderate flagged outlier submissions before they appear on the public map

---

## 🏗️ Architecture

```
┌────────────────────────────────────────┐
│          React + Vite (Frontend)       │
│       Tailwind CSS v4 (Styling)        │
└────────────────────┬───────────────────┘
                     │ /api proxy
┌────────────────────▼───────────────────┐
│      FastAPI (Python Serverless)       │
│         SQLAlchemy ORM Layer           │
│  SQLite (local) → Postgres (prod)      │
└────────────────────────────────────────┘
```

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Backend | FastAPI + Uvicorn |
| ORM | SQLAlchemy 2.0 |
| Database | SQLite (local) / PostgreSQL (Vercel/Neon) |
| Hosting | Vercel (frontend + serverless functions) |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 20+
- Python 3.9+

### 1. Clone the repository
```bash
git clone https://github.com/bpr5828/everyday-chemistry.git
cd everyday-chemistry
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Set up Python backend
```bash
python3 -m venv venv
source venv/bin/activate       # macOS / Linux
# OR: venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

### 4. Seed the local database
```bash
PYTHONPATH=. python3 api/seed.py
```
This creates `everyday_chemistry.db` with **105+ compounds**, 10 products, 10 articles, 4 podcast episodes, and sample citizen pH measurements.

### 5. Start the backend API
```bash
PYTHONPATH=. venv/bin/uvicorn api.index:app --host 127.0.0.1 --port 8000 --reload
```

### 6. Start the frontend dev server (new terminal)
```bash
npm run dev
```

Navigate to `http://localhost:5173`

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `chemical_compounds` | 105+ compounds with IUPAC names, formulas, safety tiers, mechanisms, citations |
| `consumer_products` | Sample products with safety aggregate scores |
| `product_ingredients` | Mapping between products and compound records with confidence scores |
| `articles` | Food & chemistry articles with source logs and reading levels |
| `podcast_tracks` | Episode metadata with CDN audio URLs |
| `timed_annotations` | Synchronized visual overlays at specific audio timestamps |
| `citizen_metrics` | Community pH readings with verification status and location buckets |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/search?q=` | Unified search across compounds, articles, podcasts |
| `GET` | `/api/compounds` | List all 100+ compounds |
| `GET` | `/api/compounds/:id` | Compound detail with citations and misconceptions |
| `POST` | `/api/products/parse` | Parse pasted ingredient label, return scored cards |
| `GET` | `/api/articles` | List all food chemistry articles |
| `GET` | `/api/articles/:slug` | Full article with compound references |
| `GET` | `/api/podcast/:episode_id` | Episode with audio URL, transcript, and annotations |
| `POST` | `/api/metrics` | Submit citizen pH measurement (anomaly detection) |
| `GET` | `/api/metrics/map` | Public map data (approved only) |
| `GET` | `/api/metrics/pending` | Admin queue of flagged submissions |
| `POST` | `/api/metrics/verify` | Approve or reject a pending submission |

---

## ☁️ Vercel Deployment

The `vercel.json` routes all `/api/*` requests to the Python serverless function at `api/index.py`.

Set the `DATABASE_URL` environment variable in Vercel to a PostgreSQL connection string (e.g., from [Neon](https://neon.tech) or [Supabase](https://supabase.com)).

---

## 🔬 Data Ethics & Citizen Science Safeguards

| Risk | Mitigation |
|------|-----------|
| Inaccurate readings | Measurements deviating from local norms flagged as `pending` for review |
| Location privacy | Bucketed to zip code level; no precise home addresses stored |
| Medical advice | All content is educational only; no diagnosis or treatment guidance |
| Misinformation | Citation-backed records; confidence scores shown for uncertain matches |
| Minor data safety | No names, school IDs, or health identifiers collected |

---

## 📚 College Application Theme

> *"I transformed chemistry from something people memorize into something people can see, question, and contribute to."*

**Resume Bullet Points:**
- Founded Everyday Chemistry, an interactive public science platform translating 100+ everyday chemicals into citation-backed explanations for students and families
- Built a React/FastAPI ingredient decoder and citizen chemistry map with anomaly detection to flag outlier pH measurements before publication
- Produced web-synced chemistry podcast episodes with timestamped visual annotations linking audio segments to compound records

---

## 📄 License

MIT — Built for educational and academic portfolio purposes.
