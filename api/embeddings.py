from itertools import chain

import clip
import pandas as pd

from models import CLIP_MODEL

LABELS = {
    "furrowed_brows": ["brows tense", "brows relaxed"],
    "clenched_jaw": ["jaw tight", "jaw loose"],
    "tight_lips": ["lips pressed together", "lips parted naturally"],
    "dark_under_eyes": ["dark circles present", "skin under eyes even"],
    "pale_skin": ["skin tone pale", "skin tone vibrant"],
    "redness_in_face": ["face flushed", "face clear"],
    "eye_puffiness": ["eyes swollen", "eyes normal"],
    "mouth_frown": ["corners of mouth downturned", "mouth neutral"],
    "shoulder_tension": ["shoulders raised", "shoulders relaxed"],
    "forehead_lines": ["forehead wrinkled", "forehead smooth"]
}


def get_text_embeddings():
    all_embeddings = (
        CLIP_MODEL.encode_text(
            clip.tokenize([
                text for text in chain.from_iterable(LABELS.values())
            ])
            .float()
            .long()
        )
    )
    all_embeddings /= all_embeddings.norm(dim=-1, keepdim=True)

    return pd.DataFrame({
        "label": chain.from_iterable(
            [[key] * len(LABELS[key]) for key in LABELS.keys()]
        ),
        "text": list(chain.from_iterable(LABELS.values())),
        "embedding": all_embeddings.tolist()
    })