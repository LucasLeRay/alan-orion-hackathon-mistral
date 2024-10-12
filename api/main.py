from io import BytesIO

from embeddings import get_text_embeddings
from fastapi import FastAPI, File, UploadFile
from PIL import Image
from similarity import compute_labels_similarity

app = FastAPI()
text_embeddings = get_text_embeddings()


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
