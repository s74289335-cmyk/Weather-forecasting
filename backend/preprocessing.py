import pandas as pd
from sklearn.preprocessing import StandardScaler

def load_and_clean_data(path):
    df = pd.read_csv(path)
    print("Columns in dataset:", df.columns.tolist())
    df.columns = df.columns.str.lower().str.strip()
    if 'last_updated' in df.columns:
        df['last_updated'] = pd.to_datetime(df['last_updated'])
        df = df.sort_values('last_updated')
    if 'temperature_celsius' in df.columns:
        df.rename(columns={'temperature_celsius': 'temperature'}, inplace=True)
    df.ffill(inplace=True)
    df.drop_duplicates(inplace=True)
    scaler = StandardScaler()
    num_cols = df.select_dtypes(include=['float64', 'int64']).columns
    if 'temperature' in num_cols:
        num_cols = num_cols.drop('temperature')
    df[num_cols] = scaler.fit_transform(df[num_cols])
    return df