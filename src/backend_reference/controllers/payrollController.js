const PayrollService = require('../services/payrollService');

/**
 * Payroll Controller
 * Receives Express requests and delegates to PayrollService using tenantDb connection pool.
 */

// GET /api/payroll/auto-run-config
async function getAutoRunConfig(req, res) {
    try {
        const config = await PayrollService.getAutoRunConfig(req.tenantDb);
        return res.status(200).json({ success: true, data: config });
    } catch (error) {
        console.error('Error in getAutoRunConfig:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch auto-run settings.', error: error.message });
    }
}

// GET /api/payroll/preflight-checks?month=7&year=2026
async function getPreflightChecks(req, res) {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth();
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const employees = await PayrollService.getPreflightChecks(req.tenantDb, month, year);
        return res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error('Error in getPreflightChecks:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate pre-flight checklist metrics.', error: error.message });
    }
}

// POST /api/payroll/execute-run
async function executePayrollRun(req, res) {
    try {
        const processedBy = req.user?.emp_name || 'HR Admin';
        const result = await PayrollService.executePayrollRun(req.tenantDb, req.body, processedBy);

        return res.status(200).json({
            success: true,
            message: 'Payroll run executed and committed successfully.',
            data: result
        });
    } catch (error) {
        console.error('Error in executePayrollRun:', error);
        return res.status(500).json({ success: false, message: 'Payroll run transaction failed.', error: error.message });
    }
}

module.exports = {
    getAutoRunConfig,
    getPreflightChecks,
    executePayrollRun
};
