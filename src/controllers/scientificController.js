class ScientificController {
    static factorial(req, res) {
        const { n } = req.body;

        if (!Number.isInteger(n) || n < 0) {
            return res.status(400).json({
                error: 'Factorial requires a non-negative integer'
            });
        }

        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }

        res.json({ operation: 'factorial', input: n, result });
    }

    static squareRoot(req, res) {
        const { n } = req.body;

        if (typeof n !== 'number') {
            return res.status(400).json({
                error: 'Input must be a number'
            });
        }

        if (n < 0) {
            return res.status(400).json({
                error: 'Cannot calculate square root of negative number'
            });
        }

        res.json({ operation: 'sqrt', input: n, result: Math.sqrt(n) });
    }

    static power(req, res) {
        const { base, exponent } = req.body;

        if (typeof base !== 'number' || typeof exponent !== 'number') {
            return res.status(400).json({
                error: 'Base and exponent must be numbers'
            });
        }

        res.json({ operation: 'power', base, exponent, result: Math.pow(base, exponent) });
    }
}

module.exports = ScientificController;
