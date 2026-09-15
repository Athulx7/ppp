/**
 * Multi-Tenant Payroll Service
 * Handles business logic, LOP calculation, Overtime calculations, Statutory tax slabs, and Batch execution.
 */

class PayrollService {
    /**
     * Get auto-run configuration for current company
     */
    static async getAutoRunConfig(tenantDb) {
        const [rows] = await tenantDb.query(
            'SELECT auto_run_enabled, scheduled_day, cutoff_day, default_pay_period FROM payroll_settings LIMIT 1'
        );
        return rows[0] || { auto_run_enabled: 1, scheduled_day: 28, cutoff_day: 25, default_pay_period: 'monthly' };
    }

    /**
     * Fetch pre-flight check metrics & employee data for the selected month/year
     */
    static async getPreflightChecks(tenantDb, month, year) {
        // 1. Fetch active employees with salary components
        const [employees] = await tenantDb.query(`
            SELECT 
                e.emp_id AS id,
                e.emp_code,
                e.full_name AS name,
                e.department,
                e.designation,
                e.status,
                s.basic,
                s.hra,
                s.conveyance,
                s.medical,
                s.special,
                s.gross_salary
            FROM employee_master e
            LEFT JOIN salary_structures s ON e.emp_id = s.emp_id
            WHERE e.status IN ('active', 'hold')
        `);

        // 2. Fetch attendance & leave summary for month/year
        const [attendanceLogs] = await tenantDb.query(`
            SELECT emp_id, present_days, paid_leave_days, lop_days, working_days 
            FROM attendance_monthly_summary 
            WHERE month = ? AND year = ?
        `, [month, year]);

        const attendanceMap = new Map(attendanceLogs.map(a => [a.emp_id, a]));

        // 3. Fetch Overtime logs
        const [otLogs] = await tenantDb.query(`
            SELECT emp_id, approved_ot_hours 
            FROM overtime_monthly_summary 
            WHERE month = ? AND year = ? AND status = 'APPROVED'
        `, [month, year]);

        const otMap = new Map(otLogs.map(o => [o.emp_id, o.approved_ot_hours]));

        // 4. Fetch Advance & Loan recoveries
        const [recoveries] = await tenantDb.query(`
            SELECT emp_id, advance_recovery, loan_emi_recovery 
            FROM salary_recoveries 
            WHERE month = ? AND year = ? AND status = 'PENDING'
        `, [month, year]);

        const recoveryMap = new Map(recoveries.map(r => [r.emp_id, r]));

        // Process employee list and calculate preview metrics
        const processedEmployees = employees.map(emp => {
            const att = attendanceMap.get(emp.id) || { present_days: 30, paid_leave_days: 0, lop_days: 0, working_days: 30 };
            const otHours = otMap.get(emp.id) || 0;
            const rec = recoveryMap.get(emp.id) || { advance_recovery: 0, loan_emi_recovery: 0 };

            const gross = Number(emp.gross_salary) || 0;
            const workingDays = att.working_days || 30;
            const perDayRate = workingDays > 0 ? gross / workingDays : 0;

            // Calculations
            const lopDeduction = Math.floor(perDayRate * att.lop_days);
            const hourlyRate = (gross / 30 / 8) * 1.5;
            const overtimePay = Math.floor(hourlyRate * otHours);

            // Statutory calculations
            const pf = Math.floor((emp.basic || (gross * 0.5)) * 0.12);
            const esi = gross <= 21000 ? Math.floor(gross * 0.0075) : 0;
            const professionalTax = gross > 15000 ? 200 : 0;
            const tds = Math.floor(gross * 0.05); // Simplified TDS projection

            const advanceRecovery = Number(rec.advance_recovery) || 0;
            const loanRecovery = Number(rec.loan_emi_recovery) || 0;

            const totalDeductions = lopDeduction + pf + esi + professionalTax + tds + advanceRecovery + loanRecovery;
            const netPay = gross + overtimePay - totalDeductions;

            return {
                ...emp,
                selected: emp.status === 'active',
                working_days: workingDays,
                present_days: att.present_days,
                leave_days: att.paid_leave_days,
                lop_days: att.lop_days,
                lop_deduction: lopDeduction,
                overtime_hours: otHours,
                overtime_pay: overtimePay,
                pf,
                esi,
                professional_tax: professionalTax,
                tds,
                advance_recovery: advanceRecovery,
                loan_recovery: loanRecovery,
                total_deductions: totalDeductions,
                net_pay: netPay,
                employer_pf: pf,
                employer_esi: esi > 0 ? Math.floor(gross * 0.0325) : 0,
                employer_total: pf + (esi > 0 ? Math.floor(gross * 0.0325) : 0)
            };
        });

        return processedEmployees;
    }

    /**
     * Execute final Payroll Run batch transaction
     */
    static async executePayrollRun(tenantDb, payload, processedBy) {
        const connection = await tenantDb.getConnection();
        await connection.beginTransaction();

        try {
            const { month, year, payment_date, employees } = payload;
            const runId = `PR${year}${String(month + 1).padStart(2, '0')}${Math.floor(100 + Math.random() * 900)}`;

            const selectedEmployees = employees.filter(e => e.selected);
            const totalGross = selectedEmployees.reduce((sum, e) => sum + e.gross_salary, 0);
            const totalDeductions = selectedEmployees.reduce((sum, e) => sum + e.total_deductions, 0);
            const totalNet = selectedEmployees.reduce((sum, e) => sum + e.net_pay, 0);

            // 1. Insert into payroll_runs table
            const [runHeader] = await connection.query(`
                INSERT INTO payroll_runs 
                (run_id, month, year, total_employees, total_gross, total_deductions, total_net, payment_date, status, processed_by, processed_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?, NOW())
            `, [runId, month + 1, year, selectedEmployees.length, totalGross, totalDeductions, totalNet, payment_date, processedBy]);

            // 2. Insert itemized payslips into payroll_run_details
            for (const emp of selectedEmployees) {
                await connection.query(`
                    INSERT INTO payroll_run_details
                    (run_id, emp_id, working_days, present_days, lop_days, gross_salary, lop_deduction, overtime_pay, pf_deduction, esi_deduction, pt_deduction, tds_deduction, advance_deduction, total_deductions, net_pay, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PROCESSED')
                `, [
                    runId, emp.id, emp.working_days, emp.present_days, emp.lop_days,
                    emp.gross_salary, emp.lop_deduction, emp.overtime_pay, emp.pf, emp.esi,
                    emp.professional_tax, emp.tds, emp.advance_recovery + emp.loan_recovery,
                    emp.total_deductions, emp.net_pay
                ]);
            }

            await connection.commit();
            connection.release();

            return {
                success: true,
                run_id: runId,
                employee_count: selectedEmployees.length,
                total_net: totalNet,
                payment_date: payment_date
            };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
}

module.exports = PayrollService;
