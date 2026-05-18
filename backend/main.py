from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import easyocr
from PIL import Image
import io
import numpy as np

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OCR Reader
reader = easyocr.Reader(['en'])

@app.get("/")
def home():
    return {
        "message": "ThreatScale AI Backend Running"
    }

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):

    try:

        contents = await file.read()

        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image_np = np.array(image)

        # OCR Extraction
        results = reader.readtext(
            image_np,
            detail=0
        )

        extracted_text = " ".join(results).lower()

        # Keyword Database
        keyword_list = {
            "urgent": 20,
            "bank": 15,
            "verify": 15,
            "otp": 20,
            "password": 25,
            "click here": 20,
            "limited time": 15,
            "winner": 10,
            "account suspended": 30,
            "gift card": 15,
            "claim now": 20,
            "prize": 15,
            "free": 10,
            "bitcoin": 20,
            "investment": 15,
            "login": 15,
            "security alert": 25,
        }

        suspicious_keywords = []
        score = 0

        for keyword, weight in keyword_list.items():

            if keyword in extracted_text:
                suspicious_keywords.append(keyword)
                score += weight

        score = min(score, 100)

        # Threat Levels
        if score >= 75:
            threat_level = "Critical"

        elif score >= 50:
            threat_level = "High"

        elif score >= 25:
            threat_level = "Medium"

        else:
            threat_level = "Low"

        # Emotion Detection
        emotions = []

        if "urgent" in extracted_text:
            emotions.append({
                "label": "Urgency",
                "value": 90,
                "color": "red"
            })

        if "winner" in extracted_text or "prize" in extracted_text:
            emotions.append({
                "label": "Excitement",
                "value": 75,
                "color": "cyan"
            })

        if "account suspended" in extracted_text:
            emotions.append({
                "label": "Fear",
                "value": 85,
                "color": "red"
            })

        if "verify" in extracted_text:
            emotions.append({
                "label": "Trust Bait",
                "value": 65,
                "color": "cyan"
            })

        if len(emotions) == 0:
            emotions.append({
                "label": "Neutral",
                "value": 20,
                "color": "cyan"
            })

        return {
            "success": True,
            "extracted_text": extracted_text,
            "threat_level": threat_level,
            "scam_probability": score,
            "emotions": emotions,
            "suspicious_keywords": suspicious_keywords
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }
    
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port
    )