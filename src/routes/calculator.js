const express = require('express');
const router = express.Router();
const CalculatorController = require('../controllers/calculatorController');

router.post('/add', CalculatorController.add);
router.post('/subtract', CalculatorController.subtract);
router.post('/multiply', CalculatorController.multiply);
router.post('/divide', CalculatorController.divide);

module.exports = router;
