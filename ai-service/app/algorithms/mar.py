import numpy as np


def calculate_mar(mouth):
    """
    Calculate Mouth Aspect Ratio (MAR).

    Expected 6 points:
    [left_corner, upper_left, upper_right,
     right_corner, lower_right, lower_left]
    """

    mouth = np.asarray(mouth, dtype=np.float64)

    vertical_1 = np.linalg.norm(mouth[1] - mouth[5])
    vertical_2 = np.linalg.norm(mouth[2] - mouth[4])

    horizontal = np.linalg.norm(mouth[0] - mouth[3])

    if horizontal == 0:
        return 0.0

    mar = (vertical_1 + vertical_2) / (2.0 * horizontal)

    return float(mar)