# algorithm_engine/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from typing import List, Optional, Dict, Tuple
from datetime import datetime
import numpy as np
from scipy.spatial.distance import cosine
import math
import requests
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache

app = FastAPI()
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### === Data Models === ###
class EmbedRequest(BaseModel):
    text1: str
    text2: str



class Report(BaseModel):
    id: int
    user_id: int
    type: str
    description: str
    lat: float
    lng: float
    reported_at: datetime
    agreement_score: Optional[float] = None

class ReportInput(BaseModel):
    report: Report
    neighbors: List[Report]

class RouteRequest(BaseModel):
    graph: Dict[str, List[Tuple[str, float, float]]]
    start: str
    end: str
    alpha: float

### === Time & Distance Decay === ###
def time_decay(t1, t2):
    delta = abs((t1 - t2).total_seconds()) / 60  # in minutes
    return math.exp(-0.0005 * delta)

def distance_decay(lat1, lon1, lat2, lon2):
    R = 6371000  # meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return math.exp(-0.01 * (R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))))

### === Agreement Score === ###
def compute_agreement_score(report, neighbors):
    if not neighbors:
        return 0.1
    total = 0
    for neighbor in neighbors:
        decay_t = time_decay(report.reported_at, neighbor.reported_at)
        decay_d = distance_decay(report.lat, report.lng, neighbor.lat, neighbor.lng)
        sim = semantic_similarity(report, neighbor)
        total += decay_t * decay_d * sim
    return total

### === Semantic Similarity === ###
sim_matrix = {
    'robbery': {'snatching': 0.8},
    'harassment': {'catcalling': 0.65},
    # ... Add more domain-specific similarities
}

def semantic_similarity(r1, r2):
    if r1.type == r2.type:
        return 1.0
    if r1.type in sim_matrix and r2.type in sim_matrix[r1.type]:
        return sim_matrix[r1.type][r2.type]
    elif r2.type in sim_matrix and r1.type in sim_matrix[r2.type]:
        return sim_matrix[r2.type][r1.type]
    else:
        return compute_sbert_similarity(r1.description, r2.description)

@lru_cache(maxsize=1000)
def encode_text_cached(text: str):
    return sbert_model.encode(text, convert_to_numpy=True)

def compute_sbert_similarity(text1, text2):
    # Use 
    try:
        emb1 = encode_text_cached(text1)
        emb2 = encode_text_cached(text2)
        return float(1 - cosine(emb1, emb2))
    except Exception as e:
        print(f"SBERT similarity error: {e}")
        return 0.0  # fallback similarity

### === Trust Score === ###
def compute_trust(reports):
    alpha = sum(1 for r in reports if r.agreement_score and r.agreement_score >= 0.4)
    beta = sum(1 for r in reports if r.agreement_score and r.agreement_score < 0.4)
    return (alpha + 1) / (alpha + beta + 2)

### === Modified Dijkstra === ###
def dijkstra_safest_path(graph, start, end, alpha):
    dist = {node: float('inf') for node in graph}
    prev = {}
    visited = set()
    dist[start] = 0

    while visited != set(graph):
        u = min((node for node in graph if node not in visited), key=lambda n: dist[n], default=None)
        if u is None: break
        visited.add(u)

        for v, weight, risk in graph[u]:
            if v in visited: continue
            total_cost = (1 - alpha) * weight + alpha * risk
            alt = dist[u] + total_cost
            if alt < dist[v]:
                dist[v] = alt
                prev[v] = u

    # reconstruct path
    path = []
    node = end
    while node in prev:
        path.insert(0, node)
        node = prev[node]
    if path:
        path.insert(0, start)
    return path

### === FastAPI Endpoint Examples === ###
@app.post("/agreement")
def get_agreement(input: ReportInput):
    score = compute_agreement_score(input.report, input.neighbors)
    return {"agreement_score": score}

@app.post("/trust")
def get_trust(reports: List[Report]):
    return {"trust_score": compute_trust(reports)}

@app.post("/route")
def get_route(data: RouteRequest):
    path = dijkstra_safest_path(data.graph, data.start, data.end, data.alpha)
    return {"path": path}

@app.post("/sbert")
def get_computed_sbert(req: EmbedRequest):
    score = compute_sbert_similarity(req.text1, req.text2)
    return {"similarity_score": score}

@app.get("/")
def root():
    return {"message": "Algorithm microservice running!"}
