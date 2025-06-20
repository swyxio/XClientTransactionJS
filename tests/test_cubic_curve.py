import unittest
from x_client_transaction.cubic_curve import Cubic

class TestCubicCurve(unittest.TestCase):
    def test_get_value(self):
        cubic = Cubic([0.1, 0.2, 0.3, 0.4])
        val = cubic.get_value(0.5)
        self.assertAlmostEqual(val, 0.5624697925, places=6)

if __name__ == "__main__":
    unittest.main()
