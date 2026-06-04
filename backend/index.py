"""
Everyday Chemistry API — fully self-contained, no database.
All data is hardcoded in-memory so this works as a zero-dependency
serverless function on Vercel, Netlify, Railway, etc.
"""
import uuid
import json
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# ---------------------------------------------------------------------------
# App Setup
# ---------------------------------------------------------------------------
app = FastAPI(title="Everyday Chemistry API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Hardcoded Data Store
# ---------------------------------------------------------------------------
COMPOUNDS = [
    {
        "compound_uuid": "c001",
        "iupac_name": "sodium chloride",
        "common_name": "Table Salt",
        "molecular_formula": "NaCl",
        "safety_tier_rating": "Green",
        "description": "An ionic compound of sodium and chlorine, essential to human biology and the most common seasoning worldwide.",
        "function_txt": "Flavoring, preservative, electrolyte balance",
        "mechanism_of_action_txt": "Dissociates into Na⁺ and Cl⁻ ions in water; regulates osmotic pressure across cell membranes.",
        "misconceptions_txt": "Salt alone doesn't cause hypertension in everyone — genetic sensitivity varies widely.",
        "alternatives_txt": "Potassium chloride (KCl) as a lower-sodium substitute.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/5234"],
    },
    {
        "compound_uuid": "c002",
        "iupac_name": "acetic acid",
        "common_name": "Vinegar (Acetic Acid)",
        "molecular_formula": "CH₃COOH",
        "safety_tier_rating": "Green",
        "description": "The main component of vinegar, a weak organic acid used in cooking and cleaning.",
        "function_txt": "Preservative, cleaning agent, flavor enhancer",
        "mechanism_of_action_txt": "Weak acid that lowers pH; at concentrations >5% is antimicrobial.",
        "misconceptions_txt": "Vinegar is NOT an effective disinfectant against dangerous pathogens like Salmonella.",
        "alternatives_txt": "Citric acid for similar acidic cleaning applications.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/176"],
    },
    {
        "compound_uuid": "c003",
        "iupac_name": "sodium lauryl sulfate",
        "common_name": "SLS (Sodium Lauryl Sulfate)",
        "molecular_formula": "C₁₂H₂₅NaO₄S",
        "safety_tier_rating": "Yellow",
        "description": "A surfactant and foaming agent found in shampoos, toothpastes, and body washes.",
        "function_txt": "Surfactant, foaming/lathering agent",
        "mechanism_of_action_txt": "Amphiphilic molecule that disrupts lipid bilayers; reduces surface tension to lift oils from surfaces.",
        "misconceptions_txt": "SLS is not a carcinogen — multiple systematic reviews confirm it is safe at typical concentrations.",
        "alternatives_txt": "Sodium laureth sulfate (SLES), coco-glucoside for sensitive skin formulas.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/3423265"],
    },
    {
        "compound_uuid": "c004",
        "iupac_name": "ascorbic acid",
        "common_name": "Vitamin C",
        "molecular_formula": "C₆H₈O₆",
        "safety_tier_rating": "Green",
        "description": "An essential vitamin and powerful antioxidant found naturally in citrus fruits and many vegetables.",
        "function_txt": "Antioxidant, collagen synthesis cofactor, immune support",
        "mechanism_of_action_txt": "Donates electrons to neutralize free radicals; required for hydroxylation of proline and lysine in collagen.",
        "misconceptions_txt": "Mega-doses of Vitamin C do not cure the common cold — evidence shows only modest duration reduction.",
        "alternatives_txt": "Rose hip extract, acerola cherry for natural vitamin C sources.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/54670067"],
    },
    {
        "compound_uuid": "c005",
        "iupac_name": "caffeine",
        "common_name": "Caffeine",
        "molecular_formula": "C₈H₁₀N₄O₂",
        "safety_tier_rating": "Green",
        "description": "The world's most consumed psychoactive compound, naturally found in coffee, tea, and cacao.",
        "function_txt": "CNS stimulant, adenosine receptor antagonist",
        "mechanism_of_action_txt": "Competitively inhibits adenosine receptors (A1 and A2A), blocking sleep signals and increasing alertness.",
        "misconceptions_txt": "Moderate caffeine consumption (up to 400 mg/day) is considered safe for most healthy adults — it does not cause heart disease.",
        "alternatives_txt": "L-theanine for calm focus without jitteriness; adaptogenic herbs like Rhodiola.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/2519"],
    },
    {
        "compound_uuid": "c006",
        "iupac_name": "titanium dioxide",
        "common_name": "Titanium Dioxide",
        "molecular_formula": "TiO₂",
        "safety_tier_rating": "Yellow",
        "description": "A white pigment and UV filter used in sunscreens, paints, and food coatings.",
        "function_txt": "UV filter, white pigment, food colorant (E171)",
        "mechanism_of_action_txt": "Reflects and scatters UV radiation; in nanoparticle form may generate reactive oxygen species when photoactivated.",
        "misconceptions_txt": "The EU banned TiO₂ as a food additive in 2022 due to genotoxicity concerns; however topical use in sunscreens is still widely considered safe.",
        "alternatives_txt": "Zinc oxide (ZnO) as a mineral UV filter; non-nano formulations where possible.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/26042"],
    },
    {
        "compound_uuid": "c007",
        "iupac_name": "bisphenol A",
        "common_name": "BPA (Bisphenol A)",
        "molecular_formula": "C₁₅H₁₆O₂",
        "safety_tier_rating": "Red",
        "description": "An industrial chemical used to make polycarbonate plastics and epoxy resins; a known endocrine disruptor.",
        "function_txt": "Plasticizer, monomer for polycarbonate production",
        "mechanism_of_action_txt": "Mimics estrogen by binding to estrogen receptors (ERα/ERβ), disrupting hormonal signaling at very low doses.",
        "misconceptions_txt": "BPA-free plastics may still leach structurally similar bisphenols (BPS, BPF) with similar endocrine-disrupting effects.",
        "alternatives_txt": "Stainless steel, glass, or certified BPA/BPS-free Tritan™ plastics for food contact.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/6623"],
    },
    {
        "compound_uuid": "c008",
        "iupac_name": "hydrogen peroxide",
        "common_name": "Hydrogen Peroxide",
        "molecular_formula": "H₂O₂",
        "safety_tier_rating": "Yellow",
        "description": "A mild antiseptic and bleaching agent used in wound care, teeth whitening, and hair coloring.",
        "function_txt": "Antiseptic, bleaching agent, oxidizing agent",
        "mechanism_of_action_txt": "Releases reactive oxygen species that damage bacterial cell membranes and oxidize organic chromophores.",
        "misconceptions_txt": "3% H₂O₂ on wounds can delay healing by damaging fibroblasts — clean water or saline is often preferred.",
        "alternatives_txt": "Povidone-iodine or chlorhexidine for wound antisepsis; enzymatic tooth whitening systems.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/784"],
    },
    {
        "compound_uuid": "c009",
        "iupac_name": "citric acid",
        "common_name": "Citric Acid",
        "molecular_formula": "C₆H₈O₇",
        "safety_tier_rating": "Green",
        "description": "A naturally occurring weak organic acid found in citrus fruits, widely used as a food preservative and flavor enhancer.",
        "function_txt": "Preservative, flavor enhancer, pH adjuster, chelating agent",
        "mechanism_of_action_txt": "Lowers pH to inhibit microbial growth; chelates metal ions that catalyze oxidative spoilage.",
        "misconceptions_txt": "Citric acid in processed foods is primarily produced by Aspergillus niger fermentation, not from citrus fruit extraction.",
        "alternatives_txt": "Tartaric acid, malic acid for acidification in food and beverages.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/311"],
    },
    {
        "compound_uuid": "c010",
        "iupac_name": "ethanol",
        "common_name": "Ethyl Alcohol",
        "molecular_formula": "C₂H₅OH",
        "safety_tier_rating": "Yellow",
        "description": "The type of alcohol found in alcoholic beverages, also widely used as a solvent and disinfectant.",
        "function_txt": "Disinfectant, solvent, recreational/cultural beverage component",
        "mechanism_of_action_txt": "Denatures proteins and disrupts lipid membranes of bacteria; in humans acts as a CNS depressant via GABA receptor modulation.",
        "misconceptions_txt": "Ethanol above 60% concentration is required for effective hand sanitization — dilute solutions are far less effective.",
        "alternatives_txt": "Isopropyl alcohol (70%) for surface disinfection; nonalcoholic beverages.",
        "source_urls": ["https://pubchem.ncbi.nlm.nih.gov/compound/702"],
    },
]

ARTICLES = [
    {
        "slug": "what-is-in-your-tap-water",
        "title": "What's Really In Your Tap Water?",
        "category": "Water Quality",
        "reading_level": "Beginner",
        "last_reviewed_at": "2024-03-01",
        "compound_ids": ["c001"],
        "source_log": {"sources": ["EPA", "WHO", "NSF International"]},
        "content": (
            "Tap water travels a long journey before it reaches your faucet. Municipal treatment plants filter "
            "sediment, kill pathogens with chlorine or UV light, and test for over 90 regulated contaminants. "
            "What you actually drink includes calcium, magnesium, sodium, and trace amounts of chlorine disinfectant. "
            "In most developed countries, tap water is safer than bottled water and is subject to far stricter "
            "reporting requirements. The EPA's Safe Drinking Water Act mandates that utilities publish annual "
            "Consumer Confidence Reports — you can look yours up online. Key things to look for: lead (from old "
            "pipes), nitrates (from agricultural runoff), and disinfection byproducts like trihalomethanes. "
            "A simple activated carbon filter handles most of these at a fraction of the cost of bottled water."
        ),
    },
    {
        "slug": "chemistry-of-cleaning-products",
        "title": "The Chemistry Behind Everyday Cleaning Products",
        "category": "Household Chemistry",
        "reading_level": "Intermediate",
        "last_reviewed_at": "2024-04-15",
        "compound_ids": ["c002", "c003"],
        "source_log": {"sources": ["ACS", "NIH", "Consumer Reports"]},
        "content": (
            "Your kitchen cabinet is a chemistry lab. Dish soap works because its molecules have a water-loving "
            "(hydrophilic) head and an oil-loving (hydrophobic) tail — this structure, called a surfactant, "
            "physically grabs grease molecules and suspends them in water so they rinse away. White vinegar "
            "(acetic acid) excels at dissolving mineral deposits like limescale because it reacts with calcium "
            "carbonate. Baking soda is a mild abrasive and a base that neutralizes acidic odors. Bleach "
            "(sodium hypochlorite) is a powerful oxidizer that breaks apart the chromophores in stains and "
            "destroys microbial DNA. Never mix bleach with ammonia (produces toxic chloramine gas) or with "
            "vinegar (produces chlorine gas). Understanding the chemistry helps you clean more effectively "
            "with fewer products."
        ),
    },
    {
        "slug": "sunscreen-science",
        "title": "How Sunscreen Actually Protects Your Skin",
        "category": "Personal Care Chemistry",
        "reading_level": "Intermediate",
        "last_reviewed_at": "2024-05-10",
        "compound_ids": ["c006"],
        "source_log": {"sources": ["FDA", "AAD", "Photochemistry & Photobiology"]},
        "content": (
            "Sunscreens work through two mechanisms: physical blockers (mineral filters) and chemical absorbers. "
            "Zinc oxide and titanium dioxide are mineral filters that sit on skin and physically scatter UV "
            "photons before they can damage DNA. Chemical filters like avobenzone absorb UV radiation and "
            "release it as heat. The SPF number tells you how much longer you can stay in the sun before "
            "UVB-induced redness — SPF 30 blocks ~97% of UVB rays while SPF 50 blocks ~98%. UVA rays (linked "
            "to aging and melanoma) require broad-spectrum labeling. Controversy exists around oxybenzone "
            "bioaccumulation and reef impact, which is why Hawaii banned certain chemical filters. For reef "
            "ecosystems and sensitive skin, mineral formulas with non-nano zinc oxide are the current best practice."
        ),
    },
    {
        "slug": "endocrine-disruptors-explained",
        "title": "Endocrine Disruptors: What Are They and Should You Worry?",
        "category": "Toxicology",
        "reading_level": "Advanced",
        "last_reviewed_at": "2024-02-20",
        "compound_ids": ["c007"],
        "source_log": {"sources": ["NIH NIEHS", "Endocrine Society", "European Food Safety Authority"]},
        "content": (
            "Endocrine disruptors are chemicals that interfere with the body's hormonal system. BPA (bisphenol A) "
            "is the most studied — it mimics estrogen and has been linked to reproductive issues, metabolic "
            "disorders, and developmental problems in animal studies. The challenge is that effects occur at "
            "very low doses and may not follow classical dose-response curves. Phthalates (plasticizers in "
            "flexible PVC), parabens (preservatives), and PFAS (non-stick coatings) round out the major "
            "classes of concern. Regulatory bodies are divided: the EU applies the precautionary principle "
            "aggressively, while the US FDA takes a more wait-for-human-evidence approach. Practical "
            "reductions: choose glass or stainless for food storage, avoid heating food in plastic, and "
            "buy fragrance-free personal care products."
        ),
    },
    {
        "slug": "caffeine-science",
        "title": "The Science of Caffeine: How Your Morning Coffee Actually Works",
        "category": "Neuroscience & Chemistry",
        "reading_level": "Beginner",
        "last_reviewed_at": "2024-06-01",
        "compound_ids": ["c005"],
        "source_log": {"sources": ["PubMed", "Johns Hopkins", "European Journal of Nutrition"]},
        "content": (
            "Caffeine is an adenosine receptor antagonist — meaning it blocks the receptors that normally "
            "receive adenosine, a molecule your brain produces as a byproduct of activity that makes you feel "
            "tired. By occupying these receptors, caffeine prevents adenosine from binding and delays the "
            "onset of drowsiness. Caffeine also increases dopamine signaling, which improves mood and motivation. "
            "The half-life in most adults is 5–6 hours, which is why an afternoon coffee can disrupt sleep. "
            "Tolerance develops within 1–2 weeks of daily use — you need more to get the same effect. "
            "Withdrawal symptoms (headache, irritability) peak at 20–51 hours after cessation. The FDA "
            "considers 400 mg/day (about 4 cups of coffee) safe for healthy adults. Pure powdered caffeine "
            "is extremely dangerous — just 1/4 teaspoon (1.2g) can be fatal."
        ),
    },
]

PODCASTS = [
    {
        "episode_id": "ep001",
        "title_slug": "water-fluoridation-controversy",
        "audio_cdn_url": "https://archive.org/download/podcast-placeholder/ep001.mp3",
        "duration_seconds": 1842,
        "transcript_url": None,
        "linked_research_papers": ["https://doi.org/10.1289/EHP655"],
        "annotations": [
            {"start_seconds": 0, "end_seconds": 120, "label": "Introduction", "compound_uuid": None},
            {"start_seconds": 120, "end_seconds": 600, "label": "History of fluoridation", "compound_uuid": None},
            {"start_seconds": 600, "end_seconds": 1200, "label": "Current evidence review", "compound_uuid": None},
            {"start_seconds": 1200, "end_seconds": 1842, "label": "Practical takeaways", "compound_uuid": None},
        ],
    },
    {
        "episode_id": "ep002",
        "title_slug": "plastics-in-our-food",
        "audio_cdn_url": "https://archive.org/download/podcast-placeholder/ep002.mp3",
        "duration_seconds": 2203,
        "transcript_url": None,
        "linked_research_papers": ["https://doi.org/10.1016/j.chemosphere.2021.132227"],
        "annotations": [
            {"start_seconds": 0, "end_seconds": 90, "label": "Introduction to microplastics", "compound_uuid": "c007"},
            {"start_seconds": 90, "end_seconds": 900, "label": "How plastics enter food", "compound_uuid": "c007"},
            {"start_seconds": 900, "end_seconds": 1800, "label": "Health implications", "compound_uuid": "c007"},
            {"start_seconds": 1800, "end_seconds": 2203, "label": "What you can do", "compound_uuid": None},
        ],
    },
    {
        "episode_id": "ep003",
        "title_slug": "vitamin-c-megadosing-myths",
        "audio_cdn_url": "https://archive.org/download/podcast-placeholder/ep003.mp3",
        "duration_seconds": 1560,
        "transcript_url": None,
        "linked_research_papers": ["https://doi.org/10.1002/14651858.CD000980.pub5"],
        "annotations": [
            {"start_seconds": 0, "end_seconds": 180, "label": "Linus Pauling's claims", "compound_uuid": "c004"},
            {"start_seconds": 180, "end_seconds": 900, "label": "What the meta-analyses show", "compound_uuid": "c004"},
            {"start_seconds": 900, "end_seconds": 1560, "label": "Optimal dosing evidence", "compound_uuid": "c004"},
        ],
    },
]

METRICS = [
    {"record_id": 1, "location_bucket": "10001", "metric_type": "pH", "numeric_value": 7.2, "device_calibration_flag": True, "verification_status": "approved"},
    {"record_id": 2, "location_bucket": "90210", "metric_type": "pH", "numeric_value": 6.8, "device_calibration_flag": False, "verification_status": "approved"},
    {"record_id": 3, "location_bucket": "60601", "metric_type": "pH", "numeric_value": 7.5, "device_calibration_flag": True, "verification_status": "approved"},
    {"record_id": 4, "location_bucket": "77001", "metric_type": "pH", "numeric_value": 7.0, "device_calibration_flag": True, "verification_status": "approved"},
    {"record_id": 5, "location_bucket": "30301", "metric_type": "pH", "numeric_value": 6.5, "device_calibration_flag": False, "verification_status": "approved"},
    {"record_id": 6, "location_bucket": "98101", "metric_type": "pH", "numeric_value": 7.8, "device_calibration_flag": True, "verification_status": "approved"},
    {"record_id": 7, "location_bucket": "02101", "metric_type": "pH", "numeric_value": 6.9, "device_calibration_flag": True, "verification_status": "approved"},
    {"record_id": 8, "location_bucket": "85001", "metric_type": "pH", "numeric_value": 7.3, "device_calibration_flag": False, "verification_status": "approved"},
]

# In-memory store for user-submitted metrics (resets on cold start — by design for demo)
_submitted_metrics: list = []
_next_metric_id: int = 100

# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------
class MetricSubmission(BaseModel):
    location_bucket: str = Field(..., description="Zip code or generalized city region")
    numeric_value: float = Field(..., ge=0.0, le=14.0, description="pH level of tap water")
    device_calibration_flag: bool = Field(False, description="Whether the device was calibrated")

class ProductParseRequest(BaseModel):
    ingredients_text: str = Field(..., description="Raw ingredient list, comma-separated")

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Everyday Chemistry API is fully operational", "mode": "static-data"}


@app.get("/api/search")
def unified_search(q: str = Query("", min_length=0)):
    q_lower = q.lower().strip()
    if not q_lower:
        compounds = COMPOUNDS[:8]
        articles = ARTICLES[:4]
        podcasts = PODCASTS
    else:
        compounds = [
            c for c in COMPOUNDS
            if q_lower in c["common_name"].lower()
            or q_lower in (c["iupac_name"] or "").lower()
            or q_lower in (c["molecular_formula"] or "").lower()
            or q_lower in (c["description"] or "").lower()
        ]
        articles = [
            a for a in ARTICLES
            if q_lower in a["title"].lower()
            or q_lower in a["category"].lower()
            or q_lower in a["content"].lower()
        ]
        podcasts = [
            p for p in PODCASTS
            if q_lower in p["title_slug"].replace("-", " ")
        ]

    return {
        "compounds": [
            {k: c[k] for k in ("compound_uuid", "common_name", "iupac_name", "molecular_formula", "safety_tier_rating", "description", "function_txt")}
            for c in compounds
        ],
        "articles": [
            {k: a[k] for k in ("slug", "title", "category", "reading_level", "last_reviewed_at")}
            for a in articles
        ],
        "podcasts": [
            {k: p[k] for k in ("episode_id", "title_slug", "duration_seconds")}
            for p in podcasts
        ],
    }


@app.get("/api/compounds")
def list_compounds():
    return [
        {k: c[k] for k in ("compound_uuid", "common_name", "iupac_name", "molecular_formula", "safety_tier_rating")}
        for c in COMPOUNDS
    ]


@app.get("/api/compounds/{compound_id}")
def get_compound(compound_id: str):
    compound = next((c for c in COMPOUNDS if c["compound_uuid"] == compound_id), None)
    if not compound:
        raise HTTPException(status_code=404, detail="Chemical compound not found")
    return compound


@app.post("/api/products/parse")
def parse_ingredients(payload: ProductParseRequest):
    raw_text = payload.ingredients_text
    clean_text = (
        raw_text
        .replace("Active Ingredients:", "")
        .replace("Ingredients:", "")
        .replace(".", "")
    )
    raw_tokens = [tok.strip() for tok in clean_text.split(",") if tok.strip()]
    if not raw_tokens:
        raw_tokens = [tok.strip() for tok in clean_text.split(";") if tok.strip()]

    parsed = []
    green = yellow = red = 0

    for token in raw_tokens:
        token_clean = token.lower().strip()
        if "(" in token_clean:
            token_clean = token_clean.split("(")[0].strip()

        matched = None
        confidence = 0.0

        for c in COMPOUNDS:
            name = c["common_name"].lower()
            iupac = (c["iupac_name"] or "").lower()
            if token_clean == name or token_clean == iupac:
                matched = c; confidence = 1.0; break
            elif token_clean in name or name in token_clean:
                matched = c; confidence = 0.85
            elif iupac and (token_clean in iupac or iupac in token_clean):
                matched = c; confidence = 0.80

        # Special-case water
        if not matched and ("water" in token_clean or "aqua" in token_clean):
            green += 1
            parsed.append({
                "original_text": token, "matched": True, "confidence_score": 0.90,
                "compound_uuid": "water", "common_name": "Water", "molecular_formula": "H₂O",
                "safety_tier_rating": "Green", "function_txt": "Solvent",
                "description": "Universal solvent; the most abundant ingredient in most personal care products.",
            })
            continue

        if matched:
            rating = matched["safety_tier_rating"]
            if rating == "Green": green += 1
            elif rating == "Yellow": yellow += 1
            else: red += 1
            parsed.append({
                "original_text": token, "matched": True, "confidence_score": confidence,
                **{k: matched[k] for k in ("compound_uuid", "common_name", "molecular_formula", "safety_tier_rating", "function_txt", "description")},
            })
        else:
            yellow += 1
            parsed.append({
                "original_text": token, "matched": False, "confidence_score": 0.0,
                "compound_uuid": None, "common_name": token.title(),
                "molecular_formula": "N/A", "safety_tier_rating": "Yellow",
                "function_txt": "Unknown Ingredient",
                "description": "This ingredient did not match any compound in our database.",
            })

    aggregate_score = max(0.0, min(100.0, 100.0 - yellow * 10.0 - red * 25.0))

    return {
        "product_uuid": f"parsed_{uuid.uuid4().hex[:8]}",
        "ingredients": parsed,
        "safety_score_aggregate": aggregate_score,
        "ingredient_count": len(raw_tokens),
        "breakdown": {"green": green, "yellow": yellow, "red": red},
    }


@app.get("/api/metrics/map")
def get_map_metrics():
    approved = [m for m in METRICS + _submitted_metrics if m["verification_status"] == "approved"]
    return [{k: m[k] for k in ("record_id", "location_bucket", "metric_type", "numeric_value", "device_calibration_flag")} for m in approved]


@app.post("/api/metrics")
def submit_metric(payload: MetricSubmission):
    global _next_metric_id
    loc = payload.location_bucket.strip()
    if not loc:
        raise HTTPException(status_code=400, detail="Location bucket is required")
    new = {
        "record_id": _next_metric_id,
        "location_bucket": loc,
        "metric_type": "pH",
        "numeric_value": payload.numeric_value,
        "device_calibration_flag": payload.device_calibration_flag,
        "verification_status": "pending",
    }
    _submitted_metrics.append(new)
    _next_metric_id += 1
    return {"status": "submitted", "record_id": new["record_id"], "message": "Your reading is pending community review."}


@app.get("/api/articles")
def list_articles():
    return [{k: a[k] for k in ("slug", "title", "category", "reading_level", "last_reviewed_at")} for a in ARTICLES]


@app.get("/api/articles/{slug}")
def get_article(slug: str):
    article = next((a for a in ARTICLES if a["slug"] == slug), None)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    compounds = [
        {k: c[k] for k in ("compound_uuid", "common_name", "molecular_formula", "safety_tier_rating", "function_txt")}
        for c in COMPOUNDS if c["compound_uuid"] in article.get("compound_ids", [])
    ]
    return {**article, "compounds": compounds}


@app.get("/api/podcasts")
def list_podcasts():
    return [{k: p[k] for k in ("episode_id", "title_slug", "duration_seconds", "linked_research_papers")} for p in PODCASTS]


@app.get("/api/podcasts/{episode_id}")
def get_podcast(episode_id: str):
    podcast = next((p for p in PODCASTS if p["episode_id"] == episode_id), None)
    if not podcast:
        raise HTTPException(status_code=404, detail="Episode not found")
    return podcast
