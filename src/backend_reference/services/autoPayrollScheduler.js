const cron = require('node-cron');
const { adminDbPool, tenantPoolCache } = require('../middleware/tenantResolver');
const PayrollService = require('./payrollService');

/**
 * Automated Multi-Tenant Payroll Scheduler
 * Runs every day at 00:05 AM
 * Polls active tenant database configurations and executes payroll automatically if scheduled_day == today
 */
function initAutoPayrollScheduler() {
    console.log('[Scheduler] Initializing Automated Multi-Tenant Payroll Scheduler...');

    // Cron schedule: Every day at 00:05 AM
    cron.schedule('5 0 * * *', async () => {
        console.log('[Scheduler] Starting daily auto-payroll execution check...');

        try {
            const todayDate = new Date();
            const currentDayOfMonth = todayDate.getDate();
            const currentMonth = todayDate.getMonth();
            const currentYear = todayDate.getFullYear();

            // 1. Fetch all active company databases from Admin DB
            const [tenants] = await adminDbPool.query(
                'SELECT company_id, company_code, db_host, db_port, db_name, db_user, db_password FROM tenant_databases WHERE status = "ACTIVE"'
            );

            console.log(`[Scheduler] Found ${tenants.length} active tenant database(s). Checking schedules...`);

            for (const tenant of tenants) {
                try {
                    // Resolve tenant DB pool
                    let tenantPool = tenantPoolCache.get(tenant.company_code);
                    if (!tenantPool) {
                        const mysql = require('mysql2/promise');
                        tenantPool = mysql.createPool({
                            host: tenant.db_host,
                            port: tenant.db_port || 3306,
                            user: tenant.db_user,
                            password: tenant.db_password,
                            database: tenant.db_name,
                            waitForConnections: true,
                            connectionLimit: 5
                        });
                        tenantPoolCache.set(tenant.company_code, tenantPool);
                    }

                    // Check tenant auto-run settings
                    const config = await PayrollService.getAutoRunConfig(tenantPool);

                    if (config.auto_run_enabled && config.scheduled_day === currentDayOfMonth) {
                        console.log(`[Scheduler] Auto-run triggered for Company: ${tenant.company_code} (Scheduled Day: ${config.scheduled_day})`);

                        // Fetch pre-flight employees
                        const employees = await PayrollService.getPreflightChecks(tenantPool, currentMonth, currentYear);

                        const payload = {
                            month: currentMonth,
                            year: currentYear,
                            payment_date: todayDate.toISOString().split('T')[0],
                            employees: employees
                        };

                        // Execute batch run
                        const result = await PayrollService.executePayrollRun(tenantPool, payload, 'SYSTEM_CRON_SCHEDULER');
                        console.log(`[Scheduler] Auto-payroll completed successfully for ${tenant.company_code}. Run ID: ${result.run_id}`);
                    }
                } catch (err) {
                    console.error(`[Scheduler] Error running auto-payroll for company ${tenant.company_code}:`, err.message);
                }
            }
        } catch (error) {
            console.error('[Scheduler] Critical error in daily auto-payroll scheduler:', error);
        }
    });
}

module.exports = {
    initAutoPayrollScheduler
};
