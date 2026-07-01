import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from catboost import CatBoostClassifier
import joblib
import json

print("Loading data...")
df = pd.read_csv('../karnataka_crop_dataset_1500.csv')

# Save mapping of Crop -> Category
crop_to_category = df[['Crop', 'Category']].drop_duplicates().set_index('Crop')['Category'].to_dict()
with open('crop_category_mapping.json', 'w') as f:
    json.dump(crop_to_category, f)

# Features and target
numerical_features = ['Temperature', 'Rainfall', 'Humidity', 'Soil_pH']
categorical_features = ['Category', 'District', 'SoilType', 'Season']
features = numerical_features + categorical_features
target = 'Crop'

# Fill missing values if any
for col in numerical_features:
    df[col] = df[col].fillna(df[col].median())
for col in categorical_features:
    df[col] = df[col].fillna('Unknown')

X = df[features]
y = df[target]

# Label encode target
le_crop = LabelEncoder()
y_encoded = le_crop.fit_transform(y)
joblib.dump(le_crop, 'label_encoder_crop.pkl')

# For Random Forest, we need to label encode categorical features
le_cat = {}
X_rf = X.copy()
for col in categorical_features:
    le = LabelEncoder()
    # Ensure all strings
    X_rf[col] = le.fit_transform(X_rf[col].astype(str))
    le_cat[col] = le
joblib.dump(le_cat, 'label_encoder_cat.pkl')

print("Training CatBoost Classifier...")
# CatBoost can handle categorical features directly natively
model_cat = CatBoostClassifier(iterations=200, learning_rate=0.1, depth=6, cat_features=categorical_features, verbose=0, random_seed=42)
model_cat.fit(X, y_encoded)
joblib.dump(model_cat, 'catboost_model.pkl')

print("Training Random Forest Classifier...")
model_rf = RandomForestClassifier(n_estimators=100, random_state=42)
model_rf.fit(X_rf, y_encoded)
joblib.dump(model_rf, 'rf_model.pkl')

joblib.dump(features, 'model_columns.pkl')
joblib.dump(categorical_features, 'categorical_columns.pkl')
joblib.dump(numerical_features, 'numerical_columns.pkl')

print("✅ Ensemble Models trained successfully!")
