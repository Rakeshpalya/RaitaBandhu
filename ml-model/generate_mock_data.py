import pandas as pd
import random

# Sample attributes provided by user
# Temperature Humidity Rainfall SunshineHours WindSpeed SoilType Soil_pH OrganicMatter Nitrogen Phosphorus Potassium WaterHolding Crop Category Season Yield Variety Irrigation Fertilizer Pesticide SowingMonth HarvestMonth MarketPrice Cost Profit District Latitude Longitude Altitude
# 33 75 120 5.1 6.9 Clay 6.1 1.3 416 65 231 0.45 Grapes Flower Kharif 3.4 Hybrid-11 Rainfed 174 50 2 8 72 105 139.8 Tumakuru 13.8475 75.0624 1091

def generate_mock_data(num_rows=500):
    data = []
    categories = ['Fruits', 'Vegetables', 'Flowers', 'Oil Seeds', 'Plantation']
    crops = {
        'Fruits': ['Mango', 'Banana', 'Papaya'],
        'Vegetables': ['Tomato', 'Onion', 'Potato'],
        'Flowers': ['Rose', 'Marigold', 'Grapes'], # Grapes classified as flower in user example
        'Oil Seeds': ['Sunflower', 'Groundnut'],
        'Plantation': ['Coconut', 'Arecanut']
    }
    seasons = ['Kharif', 'Rabi', 'Zaid']
    soil_types = ['Clay', 'Sandy', 'Loamy', 'Black']
    districts = ['Tumakuru', 'Bengaluru', 'Mysuru', 'Mandya', 'Hassan']

    for _ in range(num_rows):
        cat = random.choice(categories)
        crop = random.choice(crops[cat])
        
        row = {
            'Temperature': round(random.uniform(20.0, 40.0), 1),
            'Humidity': random.randint(40, 90),
            'Rainfall': random.randint(50, 300),
            'SunshineHours': round(random.uniform(4.0, 10.0), 1),
            'WindSpeed': round(random.uniform(2.0, 15.0), 1),
            'SoilType': random.choice(soil_types),
            'Soil_pH': round(random.uniform(5.5, 8.5), 1),
            'OrganicMatter': round(random.uniform(0.5, 2.5), 1),
            'Nitrogen': random.randint(100, 500),
            'Phosphorus': random.randint(20, 100),
            'Potassium': random.randint(100, 400),
            'WaterHolding': round(random.uniform(0.2, 0.8), 2),
            'Crop': crop,
            'Category': cat,
            'Season': random.choice(seasons),
            'Yield': round(random.uniform(2.0, 10.0), 1),
            'Variety': f"Var-{random.randint(1, 20)}",
            'Irrigation': random.choice(['Rainfed', 'Drip', 'Sprinkler']),
            'Fertilizer': random.randint(50, 250),
            'Pesticide': random.randint(10, 100),
            'SowingMonth': random.randint(1, 12),
            'HarvestMonth': random.randint(1, 12),
            'MarketPrice': random.randint(30, 200),
            'Cost': random.randint(20, 150),
            'Profit': round(random.uniform(10.0, 200.0), 1),
            'District': random.choice(districts),
            'Latitude': round(random.uniform(11.0, 18.0), 4),
            'Longitude': round(random.uniform(74.0, 78.0), 4),
            'Altitude': random.randint(500, 1500)
        }
        data.append(row)
        
    df = pd.DataFrame(data)
    df.to_csv('crop_data.csv', index=False)
    print(f"Generated {num_rows} rows of mock data in crop_data.csv")

if __name__ == "__main__":
    generate_mock_data()
