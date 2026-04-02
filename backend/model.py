from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np

def arima_forecast(df):
    df = df.set_index('last_updated')
    model = ARIMA(df['temperature'], order=(5,1,0))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=7)
    return forecast.tolist()

def prophet_forecast(df):
    prophet_df = df[['last_updated', 'temperature']].copy()
    prophet_df.columns = ['ds', 'y']
    model = Prophet()
    model.fit(prophet_df)
    future = model.make_future_dataframe(periods=7)
    forecast = model.predict(future)
    return forecast[['ds', 'yhat']].tail(7).to_dict(orient='records')

def ensemble(arima, prophet):
    prophet_vals = [p['yhat'] for p in prophet]
    return [(a + p)/2 for a, p in zip(arima, prophet_vals)]

def evaluate(actual, predicted):
    mae = mean_absolute_error(actual, predicted)
    rmse = np.sqrt(mean_squared_error(actual, predicted))
    return {"MAE": mae, "RMSE": rmse}