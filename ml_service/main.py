from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from datetime import datetime, timedelta

app = FastAPI(title="SCVP ML Service", version="1.0.0")

# Load or create model
MODEL_PATH = "models/delay_predictor.joblib"
ENCODER_PATH = "models/label_encoders.joblib"

class ShipmentData(BaseModel):
    origin: str
    destination: str
    supplier_id: int
    estimated_days: int
    current_status: str
    distance_km: float = 1000.0  # Default distance

class PredictionResponse(BaseModel):
    delay_hours: float
    delay_probability: float
    risk_level: str

# Initialize model on startup
@app.on_event("startup")
async def load_model():
    global model, encoders
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        encoders = joblib.load(ENCODER_PATH)
    else:
        # Create and train basic model with synthetic data
        model, encoders = create_basic_model()
        joblib.dump(model, MODEL_PATH)
        joblib.dump(encoders, ENCODER_PATH)

def create_basic_model():
    # Generate synthetic training data
    np.random.seed(42)
    n_samples = 1000
    
    origins = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']
    destinations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']
    statuses = ['in_transit', 'customs', 'processing', 'shipped']
    
    data = []
    for _ in range(n_samples):
        origin = np.random.choice(origins)
        destination = np.random.choice(destinations)
        supplier_id = np.random.randint(1, 20)
        estimated_days = np.random.randint(1, 15)
        status = np.random.choice(statuses)
        distance = np.random.uniform(100, 2000)
        
        # Simple delay logic
        base_delay = distance / 100 + estimated_days * 0.5
        if status == 'customs': base_delay += 24
        if supplier_id > 15: base_delay += 12  # Poor suppliers
        delay_hours = max(0, base_delay + np.random.normal(0, 12))
        
        data.append([origin, destination, supplier_id, estimated_days, status, distance, delay_hours])
    
    df = pd.DataFrame(data, columns=['origin', 'destination', 'supplier_id', 'estimated_days', 'status', 'distance', 'delay_hours'])
    
    # Encode categorical variables
    encoders = {}
    for col in ['origin', 'destination', 'status']:
        encoders[col] = LabelEncoder()
        df[col] = encoders[col].fit_transform(df[col])
    
    # Train model
    X = df[['origin', 'destination', 'supplier_id', 'estimated_days', 'status', 'distance']]
    y = df['delay_hours']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    return model, encoders

@app.post("/predict-delay", response_model=PredictionResponse)
async def predict_delay(shipment: ShipmentData):
    try:
        # Prepare features
        features = pd.DataFrame([{
            'origin': encoders['origin'].transform([shipment.origin])[0] if shipment.origin in encoders['origin'].classes_ else 0,
            'destination': encoders['destination'].transform([shipment.destination])[0] if shipment.destination in encoders['destination'].classes_ else 0,
            'supplier_id': shipment.supplier_id,
            'estimated_days': shipment.estimated_days,
            'status': encoders['status'].transform([shipment.current_status])[0] if shipment.current_status in encoders['status'].classes_ else 0,
            'distance': shipment.distance_km
        }])
        
        # Predict
        delay_hours = model.predict(features)[0]
        delay_probability = min(1.0, delay_hours / 48)  # Normalize to probability
        
        # Risk level
        if delay_hours < 6:
            risk_level = "LOW"
        elif delay_hours < 24:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
        
        return PredictionResponse(
            delay_hours=round(delay_hours, 2),
            delay_probability=round(delay_probability, 2),
            risk_level=risk_level
        )
    except Exception as e:
        return PredictionResponse(delay_hours=0, delay_probability=0, risk_level="UNKNOWN")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": os.path.exists(MODEL_PATH)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)