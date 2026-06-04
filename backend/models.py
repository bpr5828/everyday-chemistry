from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey
from .database import Base

class ChemicalCompound(Base):
    __tablename__ = "chemical_compounds"

    compound_uuid = Column(String, primary_key=True, index=True)
    iupac_name = Column(String, nullable=True)
    common_name = Column(String, index=True)
    molecular_formula = Column(String, nullable=True)
    mechanism_of_action_txt = Column(String, nullable=True)
    safety_tier_rating = Column(String, default="Green") # Green, Yellow, Red
    source_urls = Column(String, nullable=True) # JSON array as string
    description = Column(String, nullable=True)
    function_txt = Column(String, nullable=True)
    misconceptions_txt = Column(String, nullable=True)
    alternatives_txt = Column(String, nullable=True)

class ConsumerProduct(Base):
    __tablename__ = "consumer_products"

    product_uuid = Column(String, primary_key=True, index=True)
    upc_barcode = Column(String, nullable=True)
    brand_name = Column(String, index=True)
    product_title = Column(String, index=True)
    category_tags = Column(String, nullable=True) # JSON array as string
    safety_score_aggregate = Column(Float, default=100.0)

class ProductIngredient(Base):
    __tablename__ = "product_ingredients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_uuid = Column(String, index=True)
    compound_uuid = Column(String, nullable=True)
    ingredient_text = Column(String)
    display_order = Column(Integer, default=0)
    confidence_score = Column(Float, default=1.0)

class Article(Base):
    __tablename__ = "articles"

    slug = Column(String, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    reading_level = Column(String)
    source_log_json = Column(String, nullable=True) # JSON object as string
    compound_ids = Column(String, nullable=True) # JSON array as string
    last_reviewed_at = Column(String)
    content = Column(String)

class PodcastTrack(Base):
    __tablename__ = "podcast_tracks"

    episode_id = Column(String, primary_key=True, index=True)
    title_slug = Column(String)
    audio_cdn_url = Column(String)
    duration_seconds = Column(Integer)
    transcript_url = Column(String, nullable=True)
    linked_research_papers = Column(String, nullable=True) # JSON array as string

class TimedAnnotation(Base):
    __tablename__ = "timed_annotations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    episode_id = Column(String, index=True)
    start_seconds = Column(Integer)
    end_seconds = Column(Integer)
    compound_uuid = Column(String, nullable=True)
    annotation_json = Column(String, nullable=True) # JSON object as string

class CitizenMetric(Base):
    __tablename__ = "citizen_metrics"

    record_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_identity_hash = Column(String)
    location_bucket = Column(String, index=True)
    metric_type = Column(String, default="pH")
    numeric_value = Column(Float)
    device_calibration_flag = Column(Boolean, default=False)
    verification_status = Column(String, default="pending") # pending, approved, rejected
