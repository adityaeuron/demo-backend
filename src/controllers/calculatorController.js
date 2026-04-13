class CalculatorController {
    static add(req, res) {
        const { a, b } = req.body;

        if (typeof a !== 'number' || typeof b !== 'number') {
            return res.status(400).json({
                error: 'Both operands must be numbers'
            });
        }

        res.json({ operation: 'add', result: a + b });
    }

    static subtract(req, res) {
        const { a, b } = req.body;

        if (typeof a !== 'number' || typeof b !== 'number') {
            return res.status(400).json({
                error: 'Both operands must be numbers'
            });
        }

        res.json({ operation: 'subtract', result: a - b });
    }

    static multiply(req, res) {
        const { a, b } = req.body;

        if (typeof a !== 'number' || typeof b !== 'number') {
            return res.status(400).json({
                error: 'Both operands must be numbers'
            });
        }

        res.json({ operation: 'multiply', result: a * b });
    }

    static divide(req, res) {
        const { a, b } = req.body;

        if (typeof a !== 'number' || typeof b !== 'number') {
            return res.status(400).json({
                error: 'Both operands must be numbers'
            });
        }

        if (b === 0) {
            return res.status(400).json({
                error: 'Cannot divide by zero'
            });
        }

        res.json({ operation: 'divide', result: a / b });
    }
}

module.exports = CalculatorController;
