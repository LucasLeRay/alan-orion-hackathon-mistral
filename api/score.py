WEIGHTS = {
    'furrowed_brows': 15,
    'clenched_jaw': 15,
    'tight_lips': 10,
    'mouth_frown': 10,
    'forehead_lines': 10,
    'shoulder_tension': 15,
    'dark_under_eyes': 7.5,
    'eye_puffiness': 7.5,
    'pale_skin': 5,
    'redness_in_face': 5
}


def compute_weighted_score(scores):
    total_score = 0
    for label, score in scores.items():
        total_score += [s for s in score.items()][0][1] * WEIGHTS[label]
    return total_score / 100
