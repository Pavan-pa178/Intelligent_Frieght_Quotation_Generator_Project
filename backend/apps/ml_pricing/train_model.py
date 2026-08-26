import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

def train():
    csv_path = 'backend/apps/ml_pricing/data/freight_pricing_dataset_5000.csv'
    df = pd.read_csv(csv_path)
    print(f'1. Loaded Dataset: {len(df)} records')

    X = df.drop(columns=['shipment_id', 'spot_price_inr'])
    y = df['spot_price_inr']

    cat_cols = ['transport_mode', 'origin_gateway', 'dest_gateway', 'container_type']
    num_cols = ['distance_nm', 'container_count', 'gross_weight_kg', 'volume_cbm', 'bunker_fuel_index', 'port_dwell_days', 'seasonal_demand_factor']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)
        ]
    )

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', GradientBoostingRegressor(n_estimators=250, learning_rate=0.07, max_depth=5, random_state=42))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    print('2. Training Gradient Boosting Regressor (80% Train = 4,000 samples)...')
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

    print('\n================ TRAINED MODEL EVALUATION RESULTS ================')
    print(f'R? Score (Accuracy):                     {r2:.4f}')
    print(f'Mean Absolute Error (MAE):               ?{mae:,.2f}')
    print(f'Root Mean Squared Error (RMSE):          ?{rmse:,.2f}')
    print(f'Mean Absolute Percentage Error (MAPE):   {mape:.2f}%')
    print('==================================================================')

    model_file = 'backend/apps/ml_pricing/model.joblib'
    joblib.dump(pipeline, model_file)
    print(f'\n3. Model artifact saved successfully to: {model_file}')

if __name__ == '__main__':
    train()
