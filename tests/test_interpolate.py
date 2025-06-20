import unittest
from x_client_transaction.interpolate import interpolate

class TestInterpolate(unittest.TestCase):
    def test_interpolate(self):
        result = interpolate([0,0], [10,10], 0.5)
        self.assertEqual(result, [5.0,5.0])

if __name__ == "__main__":
    unittest.main()
