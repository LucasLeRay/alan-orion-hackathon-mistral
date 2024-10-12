import os
import json
from PIL import Image
from io import BytesIO
import base64

import clip
from openai import OpenAI
import torch

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
CLIP_MODEL, CLIP_TRANSFORMER = clip.load("ViT-B/32", device=DEVICE)

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
PROMPT = """
Using a photo of a person and scores from each potential stress cues, describe why the person is stressed.
Don't use any introduction, just give your insights.
You will also get a general score:
- 0-0.2: Not stressed
- 0.2-0.4: Slightly stressed
- 0.4-0.6: Moderately stressed
- 0.6-0.8: Very stressed
- 0.8-1.0: Extremely stressed
Using this general score, the image and the individual cues, explain why the user is stressed, and whether or not he/she should contact a specialist.
Be short in your description.
When you mention results, use percentages.
Here is the general stress score: {general_score}
Here are the individual scores: {scores}
"""

client = OpenAI(
    base_url="https://api.mistral.ai/v1",
    api_key=MISTRAL_API_KEY,
)


def get_image_description(image: Image, scores: dict, general_score: float):
    rounded_scores = {}
    for label, score in scores.items():
        rounded_scores[label] = f"{[s for s in score.items()][0][1]:.0%}"
    dict_desc = json.dumps(rounded_scores)
    general_score = f"{general_score:.0%}"
    prompt = PROMPT.format(
        general_score=general_score,
        scores=dict_desc
    )

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    image_64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    res = client.chat.completions.create(
        model="pixtral-12b-latest",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt,
                    },
                    {
                        "type": "image_url",
                        "image_url": f"data:image/png;base64,{image_64}"
                    }
                ]
            },
        ]
    )

    return res.choices[0].message.content
