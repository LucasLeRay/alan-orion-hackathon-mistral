from fastapi import FastAPI, File, UploadFile
from PIL import Image
import torch
from typing import List

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI on GCP!"}

@app.post("/infer/")
async def infer(image: UploadFile = File(...), labels: List[str] = ["a photo of a dog", "a photo of a cat"]):
    image_data = await image.read()
    image = Image.open(BytesIO(image_data))

    return {"scores": "la quoi?"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)