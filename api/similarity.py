import pandas as pd
import torch

from models import DEVICE, CLIP_MODEL, CLIP_TRANSFORMER


def compute_labels_similarity(img, labels_embeddings: pd.DataFrame):
    with torch.no_grad():
        image_features = CLIP_TRANSFORMER(img).unsqueeze(0).to(DEVICE)
        image_features = CLIP_MODEL.encode_image(image_features)
        image_features /= image_features.norm(dim=-1, keepdim=True)

        scores = {}
        for unique_group in labels_embeddings['label'].unique():
            group = labels_embeddings[
                labels_embeddings['label'] == unique_group
            ]
            text_emb = torch.tensor(group['embedding'].tolist())
            similarities = (100.0 * image_features @ text_emb.T).softmax(dim=1)
            scores[unique_group] = {
                label: score
                for label, score in zip(group['text'], similarities[0].tolist())
            }
    return scores
