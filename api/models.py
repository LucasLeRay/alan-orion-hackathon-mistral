import torch
import clip

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
CLIP_MODEL, CLIP_TRANSFORMER = clip.load("ViT-B/32", device=DEVICE)
