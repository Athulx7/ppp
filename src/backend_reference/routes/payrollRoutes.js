const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { tenantResolver } = require('../middleware/tenantResolver');

// Apply tenantResolver middleware to all payroll endpoints
router.use(tenantResolver);

// 1. Fetch Auto-Run Settings for the Company
router.get('/auto-run-config', payrollController.getAutoRunConfig);

// 2. Fetch Pre-flight Checks, LOP, Attendance & Employee Data
router.get('/preflight-checks', payrollController.getPreflightChecks);

// 3. Execute and Finalize Payroll Run Batch
router.post('/execute-run', payrollController.executePayrollRun);

module.exports = router;
