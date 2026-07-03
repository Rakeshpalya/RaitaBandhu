from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = Path(__file__).resolve().parent

model_cat = None
model_rf = None
le_crop = None
le_cat = None
numerical_columns = ['Temperature', 'Rainfall', 'Humidity', 'Soil_pH']
categorical_columns = ['Category', 'District', 'SoilType', 'Season']
crop_category_mapping = {}
models_available = False


def load_models():
    global model_cat, model_rf, le_crop, le_cat, numerical_columns, categorical_columns, crop_category_mapping, models_available

    print("Loading ensemble models and encoders...")
    try:
        model_cat = joblib.load(BASE_DIR / 'catboost_model.pkl')
        model_rf = joblib.load(BASE_DIR / 'rf_model.pkl')
        le_crop = joblib.load(BASE_DIR / 'label_encoder_crop.pkl')
        le_cat = joblib.load(BASE_DIR / 'label_encoder_cat.pkl')

        numerical_columns = joblib.load(BASE_DIR / 'numerical_columns.pkl')
        categorical_columns = joblib.load(BASE_DIR / 'categorical_columns.pkl')

        with open(BASE_DIR / 'crop_category_mapping.json', 'r', encoding='utf-8') as f:
            crop_category_mapping = json.load(f)

        models_available = True
        print("All models loaded successfully.")
    except Exception as e:
        models_available = False
        print(f"Error loading models: {e}")
        print("Falling back to heuristic crop recommendations.")


def build_fallback_predictions(target_category, data):
    temperature = float(data.get('Temperature', 30.0))
    rainfall = float(data.get('Rainfall', 100.0))
    humidity = float(data.get('Humidity', 60.0))
    soil_ph = float(data.get('Soil_pH', 6.5))

    general_candidates = [
        {"crop": "Rice", "category": "Cereals", "base": 0.24},
        {"crop": "Wheat", "category": "Cereals", "base": 0.20},
        {"crop": "Sugarcane", "category": "Cash Crops", "base": 0.18},
        {"crop": "Cotton", "category": "Cash Crops", "base": 0.16},
        {"crop": "Groundnut", "category": "Oilseeds", "base": 0.14},
        {"crop": "Tomato", "category": "Vegetables", "base": 0.13},
        {"crop": "Onion", "category": "Vegetables", "base": 0.12},
        {"crop": "Banana", "category": "Fruits", "base": 0.11},
        {"crop": "Mango", "category": "Fruits", "base": 0.10},
        {"crop": "Rose", "category": "Flowers", "base": 0.09},
    ]

    adjusted = []
    for candidate in general_candidates:
        score = candidate["base"]
        if candidate["category"].lower() in target_category.lower() or target_category.lower() in candidate["category"].lower():
            score += 0.04
        if temperature > 28:
            score += 0.01
        if rainfall > 80:
            score += 0.01
        if humidity > 55:
            score += 0.01
        if soil_ph > 6.0:
            score += 0.01
        adjusted.append({
            "crop": candidate["crop"],
            "category": crop_category_mapping.get(candidate["crop"], candidate["category"]),
            "probability": round(min(0.99, max(0.05, score)), 3),
            "match": f"{min(99, int(score * 100) + 70)}% Match",
            "profit": "High Profit" if score > 0.18 else "Good Profit",
            "demand": "High Demand" if score > 0.15 else "Good Demand",
        })

    adjusted = sorted(adjusted, key=lambda x: x["probability"], reverse=True)
    if target_category and target_category != 'All':
        adjusted = [p for p in adjusted if target_category.lower() in p['category'].lower() or p['category'].lower() in target_category.lower()]
    return adjusted[:5]


load_models()

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True) or {}

    # Target Category (e.g. "Flower", "Vegetables", "Fruits")
    target_category = data.get('Category', 'All')

    if not models_available:
        top_5 = build_fallback_predictions(target_category, data)
        return jsonify({
            "status": "success",
            "top_5": top_5,
            "fallback": True
        })

    input_data = {}
    for col in numerical_columns:
        if col in data:
            input_data[col] = float(data[col])
        else:
            defaults = {'Temperature': 30.0, 'Rainfall': 100.0, 'Humidity': 60.0, 'Soil_pH': 6.5}
            input_data[col] = defaults.get(col, 0)

    cat_feature = target_category if target_category != 'All' else 'Vegetables'

    input_data['Category'] = cat_feature
    input_data['District'] = data.get('District', 'Tumakuru')
    input_data['SoilType'] = data.get('SoilType', 'Red')
    input_data['Season'] = data.get('Season', 'Kharif')

    df_cat = pd.DataFrame([input_data])

    df_rf = df_cat.copy()
    for col in categorical_columns:
        le = le_cat[col]
        val = str(df_rf[col].iloc[0])
        if val in le.classes_:
            df_rf[col] = le.transform([val])[0]
        else:
            df_rf[col] = 0

    prob_cat = model_cat.predict_proba(df_cat)[0]
    prob_rf = model_rf.predict_proba(df_rf)[0]

    probabilities = (prob_cat + prob_rf) / 2.0

    all_predictions = []
    classes = le_crop.classes_

    for i, prob in enumerate(probabilities):
        crop_name = classes[i]
        category = crop_category_mapping.get(crop_name, 'Unknown')

        profit = "High Profit" if prob > 0.1 else "Good Profit"
        demand = "High Demand" if prob > 0.15 else "Good Demand"
        if prob < 0.05:
            profit = "Moderate Profit"
            demand = "Moderate Demand"

        all_predictions.append({
            "crop": crop_name,
            "category": category,
            "probability": float(prob),
            "match": f"{min(99, int(prob * 100) + 70)}% Match",
            "profit": profit,
            "demand": demand
        })

    if target_category and target_category != 'All':
        all_predictions = [p for p in all_predictions if target_category.lower() in p['category'].lower() or p['category'].lower() in target_category.lower()]

    all_predictions = sorted(all_predictions, key=lambda x: x['probability'], reverse=True)
    top_5 = all_predictions[:5]

    return jsonify({
        "status": "success",
        "top_5": top_5
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
