from io import BytesIO

from embeddings import get_text_embeddings
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from similarity import compute_labels_similarity

ORIGINS = [
    "http://localhost",
    "http://localhost:3066",
    "*",
]

app = FastAPI()
text_embeddings = get_text_embeddings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,  # Define the allowed origins
    allow_credentials=True,  # Allow cookies, authentication headers
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers (authorization, content-type, etc.)
)


@app.get("/")
async def root():
    return {"message": "OK"}


@app.post("/infer/")
async def infer(image: UploadFile = File(...)):
    image_data = await image.read()
    image = Image.open(BytesIO(image_data))
    return {"scores": compute_labels_similarity(image, text_embeddings)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
