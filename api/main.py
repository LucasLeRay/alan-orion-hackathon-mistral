from io import BytesIO

from embeddings import get_text_embeddings
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from similarity import compute_labels_similarity
from score import compute_weighted_score
from models import get_image_description

ORIGINS = [
    # "http://localhost",
    # "http://localhost:3066",
    # "https://orion-alan.netlify.app",
    # "http://orion-alan.netlify.app",
    # "https://orion-alan.netlify.app/",
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
    try:
        image_data = await image.read()
        image = Image.open(BytesIO(image_data))
        scores = compute_labels_similarity(image, text_embeddings)
        general_score = compute_weighted_score(scores)

        return {
            **get_image_description(image, scores, general_score),
            "scores": scores,
            "general_score": float(f"{general_score:.2f}"),
        }
    except Exception:
        return {
            "description": "La photo montre un stress moyen.",
            "sentiment": "La photo montre un stress moyen.",
            "scores": {},
            "general_score": 0.5,
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
