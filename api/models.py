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
- 0-0.4: Not stressed
- 0.4-0.5: Slightly stressed
- 0.5-0.6: Moderately stressed
- 0.6-0.8: Very stressed
- 0.8-1.0: Extremely stressed
Using this general score, the image and the individual cues, return 'description', which explains why the user is stressed, and whether or not he/she should contact a specialist. Be short in your description.
Also, return 'sentiment': a short sentence describing a person's emotional state based on a given score. The score ranges from 0 to 1. A score near 0 should describe a state of complete serenity, calmness, or peacefulness. A score near 1 should describe extreme stress, anxiety, or tension. A score near 0.5 should represent a balanced state, with mild tension or slight stress. Make the description concise but meaningful, reflecting the emotional intensity of the score.
return results as such:
```json
{{
    "description": ...,
    "sentiment": ...,
}}
```
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


    # buffer = BytesIO()
    # image.save(buffer, format="PNG", quality=80)
    # image_64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    buffer = BytesIO()
    image.convert('RGB').save(buffer, format="JPEG")
    img_bytes = buffer.getvalue()
    image_64 = base64.b64encode(img_bytes).decode('utf-8')

    res = client.chat.completions.create(
        model="pixtral-12b-latest",
        response_format={"type": "json_object"},
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

    try:
        res = json.loads(res.choices[0].message.content)
        assert "description" in res
        assert "sentiment" in res
    except Exception:
        return {
            "description": "La photo montre un stress moyen.",
            "sentiment": "La photo montre un stress moyen."
        }
    return res
