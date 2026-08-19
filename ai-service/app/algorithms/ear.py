import numpy as np


def calculate_ear(eye):
    """
    Calculate Eye Aspect Ratio (EAR).

    eye:
        6 eye landmark points in the following order:
        [left_corner, top_left, top_right, right_corner, bottom_right, bottom_left]

    Returns:
        EAR value
    """

    eye = np.asarray(eye, dtype=np.float64)

    # Vertical distances
    vertical_1 = np.linalg.norm(eye[1] - eye[5])
    vertical_2 = np.linalg.norm(eye[2] - eye[4])

    # Horizontal distance
    horizontal = np.linalg.norm(eye[0] - eye[3])

    if horizontal == 0:
        return 0.0

    ear = (vertical_1 + vertical_2) / (2.0 * horizontal)

    return float(ear)