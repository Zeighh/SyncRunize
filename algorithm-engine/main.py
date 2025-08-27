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
import osmnx as ox
import networkx as nx

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
def safest_path_osm(G, origin_point, destination_point, alpha=0.5):
    """
    origin_point, destination_point = (lat, lng)
    """
    # Find nearest OSM nodes
    orig_node = ox.nearest_nodes(G, origin_point[1], origin_point[0])  # (lng, lat)
    dest_node = ox.nearest_nodes(G, destination_point[1], destination_point[0])

    # Custom weight: combine length and risk
    def weight(u, v, d):
        length = d.get("length", 1.0)
        risk = d.get("risk", 0.2)  # TODO: link with reports/trust
        return (1 - alpha) * length + alpha * risk

    # Run shortest path
    try:
        path = nx.shortest_path(G, orig_node, dest_node, weight=weight)
        coords = [(G.nodes[n]["y"], G.nodes[n]["x"]) for n in path]
        return coords
    except nx.NetworkXNoPath:
        return []

### === FastAPI Endpoint Examples === ###
@app.on_event("startup")
def load_graph():
    global road_graph
    print("Downloading OSM graph for Tarlac...")
    road_graph = ox.graph_from_place("Tarlac, Philippines", network_type="drive")
    print(f"Graph loaded: {len(road_graph.nodes)} nodes, {len(road_graph.edges)} edges")

@app.post("/agreement")
def get_agreement(input: ReportInput):
    score = compute_agreement_score(input.report, input.neighbors)
    return {"agreement_score": score}

@app.post("/trust")
def get_trust(reports: List[Report]):
    return {"trust_score": compute_trust(reports)}

@app.post("/route-osm")
def get_route_osm(start: Dict[str, float], end: Dict[str, float], alpha: float = 0.5):
    """
    Request:
    {
      "start": {"lat": 15.4801, "lng": 120.5890},
      "end":   {"lat": 15.3541, "lng": 120.5979},
      "alpha": 0.5
    }
    """
    coords = safest_path_osm(road_graph, (start["lat"], start["lng"]), (end["lat"], end["lng"]), alpha)
    return {"coordinates": coords}

@app.post("/sbert")
def get_computed_sbert(req: EmbedRequest):
    score = compute_sbert_similarity(req.text1, req.text2)
    return {"similarity_score": score}

@app.get("/")
def root():
    return {"message": "Algorithm microservice running!"}
