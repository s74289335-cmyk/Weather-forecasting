from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from preprocessing import load_and_clean_data
from model import arima_forecast, prophet_forecast, ensemble
import os

port = int(os.environ.get("PORT", 8000))
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = load_and_clean_data("../data/GlobalWeatherRepository.csv")
@app.get("/locations")
def get_locations():
    locations = df['location_name'].unique().tolist()
    return {"locations": locations}

@app.get("/forecast/{location}")
def get_forecast(location: str):
    filtered_df = df[df['location_name'] == location]
    if filtered_df.empty:
        return {"error": "Location not found"}
    arima = arima_forecast(filtered_df)
    prophet = prophet_forecast(filtered_df)
    ens = ensemble(arima, prophet)
    return {
        "arima": arima,
        "prophet": prophet,
        "ensemble": ens
    }