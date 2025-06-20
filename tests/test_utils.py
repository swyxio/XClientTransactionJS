import unittest
from x_client_transaction import utils

class TestUtils(unittest.TestCase):
    def test_math_round(self):
        self.assertEqual(utils.Math.round(1.2), 1)
        self.assertEqual(utils.Math.round(1.6), 2)

    def test_generate_headers(self):
        headers = utils.generate_headers()
        self.assertIn("Authority", headers)
        self.assertEqual(headers["Authority"], "x.com")

    def test_is_odd(self):
        self.assertEqual(utils.is_odd(3), -1.0)
        self.assertEqual(utils.is_odd(4), 0.0)

    def test_base64_encode_decode(self):
        encoded = utils.base64_encode("abc")
        self.assertEqual(encoded, "YWJj")
        decoded = utils.base64_decode("YWJj")
        self.assertEqual(decoded, "abc")

    def test_float_to_hex(self):
        self.assertEqual(utils.float_to_hex(10), "A")
        self.assertEqual(utils.float_to_hex(10.5), "A.8")
        self.assertEqual(utils.float_to_hex(15.75), "F.C")

if __name__ == "__main__":
    unittest.main()
