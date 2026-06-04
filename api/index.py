import json
import uuid
import hashlib
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional

from api.database import get_db, engine, Base
from api.models import ChemicalCompound, ConsumerProduct, ProductIngredient, Article, PodcastTrack, TimedAnnotation, CitizenMetric


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on cold-start (safe to call multiple times)
    Base.metadata.create_all(bind=engine)
    # Seed minimal demo data if the DB is empty
    _seed_if_empty()
    yield


app = FastAPI(title="Everyday Chemistry API", version="1.0.0", lifespan=lifespan)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class MetricSubmission(BaseModel):
    location_bucket: str = Field(..., description="Zip code or generalized city region")
    numeric_value: float = Field(..., ge=0.0, le=14.0, description="pH level of tap-water")
    device_calibration_flag: bool = Field(False, description="Whether the device was calibrated")

class MetricVerifyRequest(BaseModel):
    record_id: int
    action: str = Field(..., description="approve or reject")

class ProductParseRequest(BaseModel):
    ingredients_text: str = Field(..., description="Raw text of ingredients separated by commas")

# Helper to load JSON strings safely
def safe_json_loads(val, default=None):
    if not val:
        return default or []
    try:
        return json.loads(val)
    except:
        return default or []

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Everyday Chemistry API is fully operational"}

# 1. Unified Search Endpoint
@app.get("/api/search")
def unified_search(q: str = Query("", min_length=0), db: Session = Depends(get_db)):
    if not q:
        # Return a default set of featured chemicals and articles
        compounds = db.query(ChemicalCompound).limit(10).all()
        articles = db.query(Article).limit(5).all()
        podcasts = db.query(PodcastTrack).all()
    else:
        q_like = f"%{q}%"
        compounds = db.query(ChemicalCompound).filter(
            (ChemicalCompound.common_name.like(q_like)) | 
            (ChemicalCompound.iupac_name.like(q_like)) | 
            (ChemicalCompound.molecular_formula.like(q_like))
        ).limit(20).all()
        
        articles = db.query(Article).filter(
            (Article.title.like(q_like)) | 
            (Article.content.like(q_like)) | 
            (Article.category.like(q_like))
        ).limit(10).all()
        
        podcasts = db.query(PodcastTrack).filter(
            (PodcastTrack.title_slug.like(q_like))
        ).all()
        
    return {
        "compounds": [
            {
                "compound_uuid": c.compound_uuid,
                "common_name": c.common_name,
                "iupac_name": c.iupac_name,
                "molecular_formula": c.molecular_formula,
                "safety_tier_rating": c.safety_tier_rating,
                "description": c.description,
                "function_txt": c.function_txt
            } for c in compounds
        ],
        "articles": [
            {
                "slug": a.slug,
                "title": a.title,
                "category": a.category,
                "reading_level": a.reading_level,
                "last_reviewed_at": a.last_reviewed_at
            } for a in articles
        ],
        "podcasts": [
            {
                "episode_id": p.episode_id,
                "title_slug": p.title_slug,
                "duration_seconds": p.duration_seconds
            } for p in podcasts
        ]
    }

# 2. Get Compound by ID
@app.get("/api/compounds/{compound_id}")
def get_compound(compound_id: str, db: Session = Depends(get_db)):
    compound = db.query(ChemicalCompound).filter(ChemicalCompound.compound_uuid == compound_id).first()
    if not compound:
        raise HTTPException(status_code=404, detail="Chemical compound not found")
    
    return {
        "compound_uuid": compound.compound_uuid,
        "common_name": compound.common_name,
        "iupac_name": compound.iupac_name,
        "molecular_formula": compound.molecular_formula,
        "safety_tier_rating": compound.safety_tier_rating,
        "mechanism_of_action_txt": compound.mechanism_of_action_txt,
        "description": compound.description,
        "function_txt": compound.function_txt,
        "misconceptions_txt": compound.misconceptions_txt,
        "alternatives_txt": compound.alternatives_txt,
        "source_urls": safe_json_loads(compound.source_urls, ["https://pubchem.ncbi.nlm.nih.gov"])
    }

# List all compounds (for directory views)
@app.get("/api/compounds")
def list_compounds(db: Session = Depends(get_db)):
    compounds = db.query(ChemicalCompound).all()
    return [
        {
            "compound_uuid": c.compound_uuid,
            "common_name": c.common_name,
            "iupac_name": c.iupac_name,
            "molecular_formula": c.molecular_formula,
            "safety_tier_rating": c.safety_tier_rating
        } for c in compounds
    ]

# 3. Product Ingredient Paste Parser
@app.post("/api/products/parse")
def parse_ingredients(payload: ProductParseRequest, db: Session = Depends(get_db)):
    raw_text = payload.ingredients_text
    # Tokenize ingredients
    # Replace common leading descriptions and punctuation, split by comma or semicolon
    clean_text = raw_text.replace("Active Ingredients:", "").replace("Ingredients:", "").replace(".", "")
    raw_tokens = [tok.strip() for tok in clean_text.split(",") if tok.strip()]
    if not raw_tokens:
        # Check if semicolon split is better
        raw_tokens = [tok.strip() for tok in clean_text.split(";") if tok.strip()]

    parsed_ingredients = []
    green_count = 0
    yellow_count = 0
    red_count = 0
    
    # Retrieve all chemicals for matching in-memory to speed up parsing
    all_compounds = db.query(ChemicalCompound).all()
    
    for idx, token in enumerate(raw_tokens):
        # Perform normalization for match
        # Try to find an exact or fuzzy match
        matched_comp = None
        best_confidence = 0.0
        
        token_clean = token.lower().strip()
        
        # Simple heuristics for parsing
        # Remove parenthetical details, e.g. "Water (Aqua)" -> "Water"
        if "(" in token_clean:
            token_clean = token_clean.split("(")[0].strip()
        
        for comp in all_compounds:
            comp_name = comp.common_name.lower()
            comp_iupac = comp.iupac_name.lower() if comp.iupac_name else ""
            comp_uuid = comp.compound_uuid.lower()
            
            # Exact matches
            if token_clean == comp_name or token_clean == comp_iupac or token_clean == comp_uuid:
                matched_comp = comp
                best_confidence = 1.0
                break
            # Substring alias matching
            elif token_clean in comp_name or comp_name in token_clean:
                matched_comp = comp
                best_confidence = 0.85
            elif comp_iupac and (token_clean in comp_iupac or comp_iupac in token_clean):
                matched_comp = comp
                best_confidence = 0.80

        if matched_comp:
            # Score categorization
            rating = matched_comp.safety_tier_rating
            if rating == "Green":
                green_count += 1
            elif rating == "Yellow":
                yellow_count += 1
            elif rating == "Red":
                red_count += 1
                
            parsed_ingredients.append({
                "original_text": token,
                "matched": True,
                "confidence_score": best_confidence,
                "compound_uuid": matched_comp.compound_uuid,
                "common_name": matched_comp.common_name,
                "molecular_formula": matched_comp.molecular_formula,
                "safety_tier_rating": matched_comp.safety_tier_rating,
                "function_txt": matched_comp.function_txt,
                "description": matched_comp.description
            })
        else:
            # Check for common water, fragrance, or flavor terms
            if "water" in token_clean or "aqua" in token_clean:
                # Fallback to water
                water_comp = next((c for c in all_compounds if c.compound_uuid == "water"), None)
                if water_comp:
                    green_count += 1
                    parsed_ingredients.append({
                        "original_text": token,
                        "matched": True,
                        "confidence_score": 0.90,
                        "compound_uuid": "water",
                        "common_name": "Water",
                        "molecular_formula": "H2O",
                        "safety_tier_rating": "Green",
                        "function_txt": "Solvent",
                        "description": water_comp.description
                    })
                    continue
            
            # Unmatched ingredient
            parsed_ingredients.append({
                "original_text": token,
                "matched": False,
                "confidence_score": 0.0,
                "compound_uuid": None,
                "common_name": token.title(),
                "molecular_formula": "N/A",
                "safety_tier_rating": "Yellow",  # Treat unknown as precautionary yellow
                "function_txt": "Unknown Ingredient",
                "description": "This term did not match any standard chemical compound in our Everyday Chemistry database."
            })
            yellow_count += 1

    # Aggregate safety score calculations
    # Start at 100, deduct 10 for Yellow, 25 for Red
    base_score = 100.0 - (yellow_count * 10.0) - (red_count * 25.0)
    aggregate_score = max(0.0, min(100.0, base_score))
    
    # Generate a mockup UUID for the parsed product
    product_uuid = f"parsed_{uuid.uuid4().hex[:8]}"

    return {
        "product_uuid": product_uuid,
        "ingredients": parsed_ingredients,
        "safety_score_aggregate": aggregate_score,
        "ingredient_count": len(raw_tokens),
        "breakdown": {
            "green": green_count,
            "yellow": yellow_count,
            "red": red_count
        }
    }

# 4. Citizen Map - Get Public Map Data
@app.get("/api/metrics/map")
def get_map_metrics(db: Session = Depends(get_db)):
    # Only return approved metrics to the public map
    metrics = db.query(CitizenMetric).filter(CitizenMetric.verification_status == "approved").all()
    return [
        {
            "record_id": m.record_id,
            "location_bucket": m.location_bucket,
            "metric_type": m.metric_type,
            "numeric_value": m.numeric_value,
            "device_calibration_flag": m.device_calibration_flag
        } for m in metrics
    ]

# 5. Citizen Map - Submit Metric
@app.post("/api/metrics")
def submit_metric(payload: MetricSubmission, db: Session = Depends(get_db)):
    # Validate location bucket is not empty
    loc = payload.location_bucket.strip()
    if not loc:
        raise HTTPException(status_code=400, detail="Location bucket is required")
        
    # Anomaly Detection: pH must be 0-14. 
    # Outlier rules: Tap water typically is between pH 6.0 and 8.5. 
    # If the reading is < 5.5 or > 9.0, or if calibration is false, it goes to verification_pending.
    # If it is extremely out of bounds (< 4.0 or > 10.0), it is marked as pending.
    val = payload.numeric_value
    
    status = "approved"
    # Mark as pending if it's an outlier or not calibrated
    if val < 5.5 or val > 9.0 or not payload.device_calibration_flag:
        status = "pending"
        
    # Create user identity hash to prevent duplicates and protect privacy
    dummy_ip = "127.0.0.1" # Mock client IP
    user_hash = hashlib.sha256(dummy_ip.encode('utf-8')).hexdigest()[:12]
    
    new_metric = CitizenMetric(
        user_identity_hash=user_hash,
        location_bucket=loc,
        metric_type="pH",
        numeric_value=val,
        device_calibration_flag=payload.device_calibration_flag,
        verification_status=status
    )
    
    db.add(new_metric)
    db.commit()
    db.refresh(new_metric)
    
    return {
        "status": "success",
        "record_id": new_metric.record_id,
        "verification_status": new_metric.verification_status,
        "message": "Measurement submitted successfully." if status == "approved" else "Measurement flagged for validation review due to reading variance or calibration status."
    }

# 6. Admin - Get Pending Metrics
@app.get("/api/metrics/pending")
def get_pending_metrics(db: Session = Depends(get_db)):
    pending = db.query(CitizenMetric).filter(CitizenMetric.verification_status == "pending").all()
    return [
        {
            "record_id": p.record_id,
            "location_bucket": p.location_bucket,
            "metric_type": p.metric_type,
            "numeric_value": p.numeric_value,
            "device_calibration_flag": p.device_calibration_flag,
            "verification_status": p.verification_status
        } for p in pending
    ]

# 7. Admin - Verify Metric (Approve / Reject)
@app.post("/api/metrics/verify")
def verify_metric(payload: MetricVerifyRequest, db: Session = Depends(get_db)):
    metric = db.query(CitizenMetric).filter(CitizenMetric.record_id == payload.record_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Measurement record not found")
        
    if payload.action == "approve":
        metric.verification_status = "approved"
    elif payload.action == "reject":
        metric.verification_status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid verification action. Must be 'approve' or 'reject'.")
        
    db.commit()
    return {"status": "success", "record_id": metric.record_id, "new_status": metric.verification_status}

# 8. Podcast Track & Synced Annotations Endpoint
@app.get("/api/podcast/{episode_id}")
def get_podcast_episode(episode_id: str, db: Session = Depends(get_db)):
    track = db.query(PodcastTrack).filter(PodcastTrack.episode_id == episode_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Podcast episode not found")
        
    # Query timed annotations for this episode
    annotations = db.query(TimedAnnotation).filter(TimedAnnotation.episode_id == episode_id).order_by(TimedAnnotation.start_seconds).all()
    
    parsed_annotations = []
    for ann in annotations:
        comp_info = None
        if ann.compound_uuid:
            comp = db.query(ChemicalCompound).filter(ChemicalCompound.compound_uuid == ann.compound_uuid).first()
            if comp:
                comp_info = {
                    "compound_uuid": comp.compound_uuid,
                    "common_name": comp.common_name,
                    "molecular_formula": comp.molecular_formula,
                    "safety_tier_rating": comp.safety_tier_rating
                }
                
        parsed_annotations.append({
            "id": ann.id,
            "start_seconds": ann.start_seconds,
            "end_seconds": ann.end_seconds,
            "compound": comp_info,
            "annotation": safe_json_loads(ann.annotation_json, {})
        })
        
    # Construct a mock transcript for player display
    # Generate sentences from annotations
    transcript_segments = []
    for ann in parsed_annotations:
        text = ann["annotation"].get("body", "")
        transcript_segments.append({
            "start_seconds": ann["start_seconds"],
            "end_seconds": ann["end_seconds"],
            "text": text
        })

    return {
        "episode_id": track.episode_id,
        "title_slug": track.title_slug,
        "audio_cdn_url": track.audio_cdn_url,
        "duration_seconds": track.duration_seconds,
        "linked_research_papers": safe_json_loads(track.linked_research_papers, []),
        "annotations": parsed_annotations,
        "transcript": transcript_segments
    }

# 9. List Articles
@app.get("/api/articles")
def list_articles(db: Session = Depends(get_db)):
    articles = db.query(Article).all()
    return [
        {
            "slug": a.slug,
            "title": a.title,
            "category": a.category,
            "reading_level": a.reading_level,
            "last_reviewed_at": a.last_reviewed_at,
            "compound_ids": safe_json_loads(a.compound_ids, [])
        } for a in articles
    ]

# 10. Get Article by Slug
@app.get("/api/articles/{slug}")
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.slug == slug).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    # Get associated compound cards
    compound_uuids = safe_json_loads(article.compound_ids, [])
    compounds = db.query(ChemicalCompound).filter(ChemicalCompound.compound_uuid.in_(compound_uuids)).all()
    
    return {
        "slug": article.slug,
        "title": article.title,
        "category": article.category,
        "reading_level": article.reading_level,
        "source_log": safe_json_loads(article.source_log_json, {}),
        "last_reviewed_at": article.last_reviewed_at,
        "content": article.content,
        "compounds": [
            {
                "compound_uuid": c.compound_uuid,
                "common_name": c.common_name,
                "molecular_formula": c.molecular_formula,
                "safety_tier_rating": c.safety_tier_rating,
                "function_txt": c.function_txt
            } for c in compounds
        ]
    }


# ---------------------------------------------------------------------------
# Bootstrap helper – seeds a handful of rows so the UI isn't blank on Vercel
# ---------------------------------------------------------------------------
def _seed_if_empty():
    from sqlalchemy.orm import Session as S
    db = next(get_db())
    try:
        if db.query(ChemicalCompound).count() > 0:
            return  # already seeded

        compounds = [
            ChemicalCompound(
                compound_uuid=str(uuid.uuid4()),
                iupac_name="sodium chloride",
                common_name="Table Salt",
                molecular_formula="NaCl",
                safety_tier_rating="Green",
                description="Common table salt, an ionic compound of sodium and chlorine.",
                function_txt="Flavoring, preservative, electrolyte",
                mechanism_of_action_txt="Osmotic balance regulation; essential electrolyte",
                misconceptions_txt="Salt alone does not cause hypertension in everyone",
                alternatives_txt="Potassium chloride (KCl) as low-sodium substitute",
                source_urls='["https://pubchem.ncbi.nlm.nih.gov/compound/5234"]',
            ),
            ChemicalCompound(
                compound_uuid=str(uuid.uuid4()),
                iupac_name="acetic acid",
                common_name="Vinegar (Acetic Acid)",
                molecular_formula="CH3COOH",
                safety_tier_rating="Green",
                description="The main component of vinegar, a weak organic acid.",
                function_txt="Preservative, cleaning agent, flavor enhancer",
                mechanism_of_action_txt="Weak acid that lowers pH; antimicrobial at concentrations >5%",
                misconceptions_txt="Vinegar is NOT a disinfectant for pathogens like Salmonella",
                alternatives_txt="Citric acid for similar acidic cleaning applications",
                source_urls='["https://pubchem.ncbi.nlm.nih.gov/compound/176"]',
            ),
            ChemicalCompound(
                compound_uuid=str(uuid.uuid4()),
                iupac_name="sodium lauryl sulfate",
                common_name="SLS (Sodium Lauryl Sulfate)",
                molecular_formula="C12H25NaO4S",
                safety_tier_rating="Yellow",
                description="A surfactant and detergent found in many personal care products.",
                function_txt="Surfactant, foaming agent",
                mechanism_of_action_txt="Disrupts lipid bilayers; reduces surface tension",
                misconceptions_txt="SLS is not a carcinogen despite online claims",
                alternatives_txt="Sodium laureth sulfate (SLES), coco-glucoside",
                source_urls='["https://pubchem.ncbi.nlm.nih.gov/compound/3423265"]',
            ),
        ]
        db.add_all(compounds)

        articles = [
            Article(
                slug="what-is-in-your-tap-water",
                title="What's Really In Your Tap Water?",
                category="Water Quality",
                reading_level="Beginner",
                content="Tap water contains minerals, disinfectants like chlorine, and trace elements. Most municipal water is safe to drink and rigorously tested.",
                last_reviewed_at="2024-01-01",
                source_log_json='{"sources": ["EPA", "WHO"]}',
                compound_ids='[]',
            ),
            Article(
                slug="chemistry-of-cleaning-products",
                title="The Chemistry Behind Everyday Cleaning Products",
                category="Household Chemistry",
                reading_level="Intermediate",
                content="Cleaning products rely on surfactants, oxidizers, and acids/bases to break down grime. Understanding them helps you use them safely.",
                last_reviewed_at="2024-03-15",
                source_log_json='{"sources": ["ACS", "NIH"]}',
                compound_ids='[]',
            ),
        ]
        db.add_all(articles)
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


# Vercel / AWS Lambda ASGI bridge
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except ImportError:
    pass  # mangum optional; Vercel also supports ASGI apps natively
