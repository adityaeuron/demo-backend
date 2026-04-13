const express = require('express');
const router = express.Router();
const CalculatorController = require('../controllers/calculatorController');
const ScientificController = require('../controllers/scientificController');

// Basic operations
router.post('/add', CalculatorController.add);
router.post('/subtract', CalculatorController.subtract);
router.post('/multiply', CalculatorController.multiply);
router.post('/divide', CalculatorController.divide);

// Scientific operations
router.post('/factorial', ScientificController.factorial);
router.post('/sqrt', ScientificController.squareRoot);
router.post('/power', ScientificController.power);

module.exports = router;
