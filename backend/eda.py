from sklearn.ensemble import IsolationForest

def detect_anomalies(df):
    num_cols = df.select_dtypes(include=['float64', 'int64']).columns
    
    model = IsolationForest(contamination=0.01)
    df['anomaly'] = model.fit_predict(df[num_cols])
    
    return df