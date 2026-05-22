# 🍽️ FlavorNest AI — Restaurant Sentiment Analysis Platform

An AI-powered restaurant feedback analysis platform that collects customer reviews, performs real-time sentiment analysis, generates restaurant performance summaries, and extracts key business insights using Large Language Models (LLMs).

Built with a modern full-stack architecture using React, FastAPI, Hugging Face AI models, and deployed with Vercel + Render.

---

# ✨ Features

## ✅ Customer Review System
- Submit restaurant reviews
- Star rating system
- Review persistence using JSON storage
- Real-time review rendering

## 🤖 AI Sentiment Analysis
- Positive / Neutral / Negative classification
- Confidence score prediction
- Hybrid NLP + rule-based sentiment correction
- Handles negation patterns like:
  - "not bad"
  - "not good"
  - mixed sentiments

## 📊 AI Analytics Dashboard
- Sentiment distribution visualization
- Positive review percentage tracking
- AI-generated restaurant performance summary
- Highly mentioned problems
- Highly praised qualities

## 📱 Responsive Design
- Mobile-first responsive UI
- Hamburger navigation menu
- Tablet optimization
- Smooth animations using Framer Motion

## ☁️ Deployment
- Frontend deployed on Vercel
- Backend deployed on Render
- Environment-based API configuration

---

# 🧠 AI Architecture

The project uses Hugging Face models for:

## Sentiment Classification
Model:
```bash
cardiffnlp/twitter-roberta-base-sentiment-latest
```

## AI Summary + Insights Generation
Model:
```bash
meta-llama/Llama-3.1-8B-Instruct
```

The backend applies:
- rule-based NLP corrections
- confidence threshold handling
- balanced sentiment detection
- negation analysis

to improve raw model predictions.

---

# 🏗️ Tech Stack

## Frontend
- React.js
- Vite
- Framer Motion
- CSS3

## Backend
- FastAPI
- Python
- Hugging Face Hub
- Pydantic

## Deployment
- Vercel
- Render

---

# 📂 Project Structure

```bash
ai-feedback-analyzer/
│
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   ├── reviews.json
│   │   │   └── reviews.tsv
│   │   │
│   │   ├── main.py
│   │   ├── model.py
│   │   ├── schemas.py
│   │   ├── storage.py
│   │   └── utils.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env
│
└── README.md

```
---

# Backend Setup

## 1. Navigate to backend

```bash
cd backend
```

## 2. Create virtual environment

```bash
python -m venv venv_ai
```

## 3. Activate virtual environment

### Linux/Mac

```bash
source venv_ai/bin/activate
```

### Windows

```bash
venv_ai\Scripts\activate
```

## 4. Install dependencies

```bash
pip install -r requirements.txt
```

## Create .env

```bash
HF_API_KEY=your_huggingface_api_key
```
## 6. Run backend server

```bash
uvicorn app.main:app --reload
```

Backend runs on:
```bash
http://127.0.0.1:8000
```
---

# 💻 Frontend Setup

## 1. Navigate to frontend

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```
## 3. Create .env

```bash
VITE_API_URL=http://127.0.0.1:8000
```
## 4. Run frontend

```bash
npm run dev
```
Frontend runs on:

```bash
http://localhost:5173
```
---

# 🚀 Deployment
# Frontend Deployment (Vercel)

## Build Settings

### Root Directory

```bash
frontend
```

### Build Command

```bash
npm run build
```
### Output Directory

```bash
dist
```

### Install Command

```bash
npm install
```

## Environment Variables

```bash
VITE_API_URL=https://your-render-url.onrender.com
```
---

# Backend Deployment (Render)

## Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port 10000
```
## Root Directory

```bash
backend
```

## Environment Variables

```bash
HF_API_KEY=your_huggingface_api_key
```
---

# 🔥 API Endpoints

## Analyze Review

```bash
POST /analyze
```

## Get Reviews

```bash
GET /reviews
```

## Get AI Summary

```bash
GET /summary
```

## Get AI Insights

```bash
GET /insights
```
---

# 🧪 Sample Review Payload

```bash
{
  "text": "The food was amazing and the service was excellent!",
  "rating": 5,
  "author": "Tsega"
}
```
 # 👨‍💻 Author
 Tsega Ephrem Tilahun

Software Engineering Student — Addis Ababa University

Frontend Developer | AI Enthusiast | Full-Stack Developer

# 📄 License
This project is for educational and portfolio purposes.