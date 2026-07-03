# 🌱 RaitaBandhu (Farmer AI Platform)

RaitaBandhu is a full-stack, AI-powered agricultural application designed specifically for farmers in India. It assists farmers by dynamically recommending the most profitable crops to grow based on real-time environmental data and provides a step-by-step smart cultivation guide to track progress.

## ✨ Features
* **AI Crop Recommendation:** Uses an advanced XGBoost Machine Learning model trained on 65,000 rows of agricultural data to predict the best crops with high accuracy.
* **Smart Farming Dashboard:** Tracks planted crops, displays a growth progress bar, and automatically generates pending tasks (Watering, Fertilizer, Pest Control).
* **Multi-Language Support:** Fully localized UI for English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी).
* **Real-time Weather & Location:** Integrates geolocation to pull localized weather, temperature, humidity, and rainfall data.
* **Dark / Light Mode:** A beautifully designed, mobile-first interface that adapts to the farmer's viewing preference.
* **Market Price Trends:** Visual graphs displaying the average market price of the predicted crops to maximize farmer profitability.

## 🏗️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, Lucide-React
* **Backend API:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose), Local In-Memory Fallback
* **Machine Learning:** Python, Scikit-Learn, XGBoost, Flask API

## 📁 Project Structure
The repository is split into three main microservices:
1. `/client` - The React Frontend
2. `/backend` - The Node.js Gateway & Database API
3. `/ml-model` - The Python ML Model & Prediction API

---

## 🚀 How to Run Locally

### The Easy Way (Windows)
If you are on Windows, simply double click the `start.bat` file located in the root directory. This will automatically open the terminals and start all three servers for you!

### The Manual Way
**1. Start the Machine Learning API**
```bash
cd ml-model
pip install -r requirements.txt
python app.py
```
*(Runs on http://localhost:5000 unless you set a different backend host)*

**2. Start the Node.js Backend**
```bash
cd backend
npm install
npm run dev
```
*(Runs on http://localhost:3001)*

**3. Start the React Frontend**
```bash
cd client
npm install
npm run dev
```
*(Runs on http://localhost:5173)*

If you deploy the frontend to Netlify, set the `VITE_API_URL` environment variable to your hosted backend URL, for example:

```bash
VITE_API_URL=https://your-backend-url.onrender.com/api/predict
```

---

## 💾 Database Configuration
By default, the backend runs using a local in-memory array so you can test the "Add to Dashboard" functionality immediately without any setup.

To persist data to the cloud:
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a `.env` file inside the `backend/` folder.
3. Add your connection string:
`MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/raitabandhu`

## 🧠 Retraining the Model
If you get a new dataset, place it in the `ml-model` folder as `new_crop_data.csv` or `crop_data.xlsx`.
Then, simply run:
```bash
cd ml-model
python train.py
```
This will automatically preprocess the data, train new XGBoost models, and save them as `.pkl` files for the Flask API to use.
