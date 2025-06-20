import unittest
from x_client_transaction.rotation import convert_rotation_to_matrix
import math

class TestRotation(unittest.TestCase):
    def test_convert_rotation_to_matrix(self):
        matrix = convert_rotation_to_matrix(90)
        self.assertAlmostEqual(matrix[0], math.cos(math.radians(90)))
        self.assertAlmostEqual(matrix[1], -math.sin(math.radians(90)))
        self.assertAlmostEqual(matrix[2], math.sin(math.radians(90)))
        self.assertAlmostEqual(matrix[3], math.cos(math.radians(90)))

if __name__ == "__main__":
    unittest.main()
